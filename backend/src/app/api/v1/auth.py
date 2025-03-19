from datetime import datetime, timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession


from ...core.config import settings
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import BadRequestException, NotFoundException, UnauthorizedException
from ...core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    blacklist_tokens,
    create_access_token,
    create_refresh_token,
    create_verification_token,
    get_password_hash,
    verify_token,
    verify_token_from_redis,
    oauth2_scheme,
    TokenType
)
from ...crud.crud_users import crud_users
from ...schemas.auth import (
    Token,
    PasswordReset,
    PasswordResetRequest,
    EmailVerification,
    AuthUserCreate,
    AuthUserCreateInternal,
    AuthUserRead,
    RefreshToken
)

from ...core.utils.email import send_verification_email
from ...core.utils.queue import redis_queue

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    """Đăng nhập và lấy access token."""
    user = await authenticate_user(username_or_email=form_data.username, password=form_data.password, db=db)
    if not user:
        raise UnauthorizedException("Wrong username, email or password.")
    
    if not user["is_active"]:
        raise UnauthorizedException("Account is not activated. Please verify your email first.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)

    refresh_token = await create_refresh_token(data={"sub": user["username"]})
    max_age = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    print(refresh_token)
    print(access_token)
    # response.set_cookie(
    #     key="refresh_token",
    #     value=refresh_token,
    #     httponly=True,
    #     secure=True,
    #     samesite="Lax",
    #     max_age=max_age
    # )

    await crud_users.update(
        db=db,
        object={"last_login": datetime.utcnow()},
        id=user["id"]
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "refresh_token": refresh_token
    }


@router.post("/refresh-token", response_model=Token, status_code=status.HTTP_200_OK)
async def refresh_access_token(
    refresh_data: RefreshToken,
    db: AsyncSession = Depends(async_get_db)
) -> dict[str, str]:
    """Làm mới access token bằng refresh token."""
    refresh_token = refresh_data.refresh_token
    if not refresh_token:
        raise UnauthorizedException("Refresh token missing.")

    user_data = await verify_token(refresh_token, TokenType.REFRESH, db)
    if not user_data:
        raise UnauthorizedException("Invalid refresh token.")

    # Kiểm tra xem user có còn active không
    user = await crud_users.get(db=db, username=user_data.username_or_email, schema_to_select=AuthUserRead)
    if not user or not user["is_active"]:
        raise UnauthorizedException("User is not active.")

    new_access_token = await create_access_token(data={"sub": user_data.username_or_email})
    new_refresh_token = await create_refresh_token(data={"sub": user_data.username_or_email})
    
    return {
        "access_token": new_access_token, 
        "token_type": "bearer",
        "refresh_token": new_refresh_token
    }


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    response: Response,
    refresh_data: RefreshToken,
    access_token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(async_get_db)
) -> dict[str, str]:
    """Đăng xuất và blacklist tokens."""
    try:
        refresh_token = refresh_data.refresh_token
        if not refresh_token:
            raise UnauthorizedException("Refresh token not found")
            
        await blacklist_tokens(
            access_token=access_token,
            refresh_token=refresh_token,
            db=db
        )

        return {"message": "Logged out successfully"}

    except JWTError:
        raise UnauthorizedException("Invalid token.")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: AuthUserCreate,
    db: AsyncSession = Depends(async_get_db)
) -> dict:
    """Đăng ký user mới."""
    # Kiểm tra username và email
    if await crud_users.exists(db=db, username=user_in.username):
        raise BadRequestException("Username already exists")
    if await crud_users.exists(db=db, email=user_in.email):
        raise BadRequestException("Email already exists")
    
    # Tạo user mới
    user_data = user_in.model_dump()
    user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
    user_data["is_superuser"] = False
    user_data["is_active"] = False
    user_data["last_login"] = None
    
    user_internal = AuthUserCreateInternal(**user_data)
    user = await crud_users.create(db=db, object=user_internal)
    
    # Tạo verification token và gửi email
    token = await create_verification_token(user.email, TokenType.VERIFY_ACCOUNT)
    
    # Thêm task gửi email vào queue
    job_id = await redis_queue.enqueue(
        "send_email",
        email=user.email,
        name=user.name,
        verification_code=token
    )
    
    return {
        "message": "User registered successfully. Please check your email for verification.",
        
    }

@router.get("/task/{task_id}", status_code=status.HTTP_200_OK)
async def get_task_status(task_id: str) -> dict:
    """Kiểm tra trạng thái của task."""
    status = await redis_queue.get_job_status(task_id)
    return status

@router.post("/verify-account", status_code=status.HTTP_200_OK)
async def verify_account(
    verification: EmailVerification,
    db: AsyncSession = Depends(async_get_db)
) -> dict:
    """Xác thực tài khoản."""
    email = await verify_token_from_redis(verification.token, TokenType.VERIFY_ACCOUNT)
    if not email:
        raise BadRequestException("Invalid or expired verification token")
    
    user = await crud_users.get(db=db, email=email, schema_to_select=AuthUserRead)
    if not user:
        raise NotFoundException("User not found")
    
    if user["is_active"]:
        return {"message": "Account already verified"}
    
    # Kích hoạt tài khoản
    await crud_users.update(db=db, object={"is_active": True}, id=user["id"])
    return {"message": "Account verified successfully"}


@router.post("/request-password-reset", status_code=status.HTTP_200_OK)
async def request_password_reset(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(async_get_db)
) -> dict:
    """Yêu cầu reset password."""
    user = await crud_users.get(db=db, email=request.email, schema_to_select=AuthUserRead)
    if not user:
        # Trả về thông báo thành công ngay cả khi email không tồn tại để tránh leak thông tin
        return {"message": "If your email is registered, you will receive password reset instructions"}
    
    # Tạo reset token và gửi email
    token = await create_verification_token(user["email"], TokenType.RESET_PASSWORD)
    
    background_tasks.add_task(
        send_verification_email,
        email=user["email"],
        name=user["name"],
        verification_code=token
    )
    
    return {"message": "If your email is registered, you will receive password reset instructions"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(async_get_db)
) -> dict:
    """Reset password với token."""
    email = await verify_token_from_redis(reset_data.token, TokenType.RESET_PASSWORD)
    if not email:
        raise BadRequestException("Invalid or expired reset token")
    
    user = await crud_users.get(db=db, email=email, schema_to_select=AuthUserRead)
    if not user:
        raise NotFoundException("User not found")
    
    # Cập nhật password
    hashed_password = get_password_hash(reset_data.new_password)
    await crud_users.update(
        db=db, 
        object={"hashed_password": hashed_password}, 
        id=user["id"]
    )
    
    # Đăng xuất khỏi tất cả các thiết bị
    # TODO: Implement logout from all devices
    
    return {"message": "Password reset successfully"} 