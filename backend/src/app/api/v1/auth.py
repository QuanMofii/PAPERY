from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.config import settings
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import BadRequestException, NotFoundException, UnauthorizedException
from ...core.security import (
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
    AuthUserRead,
    RefreshToken
)
from ...schemas.user import UserCreateInternal, UserReadInternal
from ...schemas.utils import APIResponse

from ...core.utils.email import send_verification_email
from ...core.utils.queue import redis_queue

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=APIResponse[Token])
async def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse[Token]:
    """Đăng nhập và lấy access token."""
    authenticated_user = await authenticate_user(username_or_email=form_data.username, password=form_data.password, db=db)
    if not authenticated_user:
        raise UnauthorizedException("Wrong username, email or password.")
    
    user = UserReadInternal.model_validate(authenticated_user)
    
    if not user.is_active:
        raise UnauthorizedException("Account is not activated. Please verify your email first.")

    access_token = await create_access_token(data={"sub": user.username})
    refresh_token = await create_refresh_token(data={"sub": user.username})
    # max_age = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
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
        id=user.id
    )
    
    token_data = Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
    return APIResponse(message="Login successful", data=token_data)


@router.post("/token", response_model=Token)
async def login_for_access_token_oauth2(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> Token:
    """OAuth2 compatible token endpoint for FastAPI docs."""
    authenticated_user = await authenticate_user(username_or_email=form_data.username, password=form_data.password, db=db)
    if not authenticated_user:
        raise UnauthorizedException("Wrong username, email or password.")
    
    user = UserReadInternal.model_validate(authenticated_user)
    
    if not user.is_active:
        raise UnauthorizedException("Account is not activated. Please verify your email first.")

    access_token = await create_access_token(data={"sub": user.username})
    refresh_token = await create_refresh_token(data={"sub": user.username})

    await crud_users.update(
        db=db,
        object={"last_login": datetime.utcnow()},
        id=user.id
    )
    
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")


@router.post("/refresh-token", response_model=APIResponse[Token])
async def refresh_access_token(
    refresh_data: RefreshToken,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse[Token]:
    """Làm mới access token bằng refresh token."""
    refresh_token = refresh_data.refresh_token
    if not refresh_token:
        raise UnauthorizedException("Refresh token missing.")

    user_data = await verify_token(refresh_token, TokenType.REFRESH, db)
    if not user_data:
        raise UnauthorizedException("Invalid refresh token.")

    db_user = await crud_users.get(
        db=db, 
        username=user_data.username_or_email,
        
    )
    if not db_user:
        raise UnauthorizedException("User not found.") # Should not happen if token is valid
        
    user = UserReadInternal.model_validate(db_user)
    if not user.is_active:
        raise UnauthorizedException("User is not active.")

    new_access_token = await create_access_token(data={"sub": user.username})
    new_refresh_token = await create_refresh_token(data={"sub": user.username})
    
    token_data = Token(access_token=new_access_token, refresh_token=new_refresh_token, token_type="bearer")
    return APIResponse(message="Token refreshed successfully", data=token_data)


@router.post("/logout", response_model=APIResponse)
async def logout(
    response: Response,
    refresh_data: RefreshToken,
    access_token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
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

        return APIResponse(message="Logged out successfully")

    except JWTError:
        raise UnauthorizedException("Invalid token.")


@router.post("/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: AuthUserCreate,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
    """Đăng ký user mới."""
    if await crud_users.exists(db=db, username=user_in.username):
        raise BadRequestException("Username already exists")
    if await crud_users.exists(db=db, email=user_in.email):
        raise BadRequestException("Email already exists")
    
    user_data = user_in.model_dump()
    user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
    user_data["tier_id"] = 1
    
    user_internal = UserCreateInternal(**user_data)
    user = await crud_users.create(db=db, object=user_internal)
    
    token = await create_verification_token(user.email, TokenType.VERIFY_ACCOUNT)
    
    await redis_queue.enqueue(
        "send_email",
        email=user.email,
        name=user.username,
        verification_code=token
    )
    
    return APIResponse(message="User registered successfully. Please check your email for verification.")


@router.post("/verify-account", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def verify_account(
    verification: EmailVerification,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
    """Xác thực tài khoản."""
    email = await verify_token_from_redis(verification.token, TokenType.VERIFY_ACCOUNT)
    if not email:
        raise BadRequestException("Invalid or expired verification token")
    
    db_user = await crud_users.get(db=db, email=email )
    if not db_user:
        raise NotFoundException("User not found")
    
    user = UserReadInternal.model_validate(db_user)
    if user.is_active:
        return APIResponse(message="Account already verified")
    
    await crud_users.update(db=db, object={"is_active": True}, id=user.id)
    return APIResponse(message="Account verified successfully")


@router.post("/forgot-password", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def request_password_reset(
    request: PasswordResetRequest,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
    """Yêu cầu reset password."""
    db_user = await crud_users.get(db=db, email=request.email, )
    if not db_user:
        return APIResponse(message="If your email is registered, you will receive password reset instructions")
    
    user = UserReadInternal.model_validate(db_user)
    token = await create_verification_token(user.email, TokenType.RESET_PASSWORD)
    
    await redis_queue.enqueue(
        "send_email",
        email=user.email,
        name=user.username,
        verification_code=token
    )
    
    return APIResponse(message="If your email is registered, you will receive password reset instructions")


@router.post("/reset-password", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def reset_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
    """Reset password với token."""
    email = await verify_token_from_redis(reset_data.token, TokenType.RESET_PASSWORD)
    if not email:
        raise BadRequestException("Invalid or expired reset token")
    
    db_user = await crud_users.get(db=db, email=email, )
    if not db_user:
        raise NotFoundException("User not found")
    
    user = UserReadInternal.model_validate(db_user)
    hashed_password = get_password_hash(reset_data.new_password)
    await crud_users.update(
        db=db, 
        object={"hashed_password": hashed_password}, 
        id=user.id
    )
    
    return APIResponse(message="Password reset successfully")

@router.post("/resend-verification", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def resend_verification_token(
    data: EmailVerification,
    db: AsyncSession = Depends(async_get_db)
) -> APIResponse:
    """Gửi lại token xác thực tài khoản cho user chưa xác thực."""
    db_user = await crud_users.get(db=db, email=data.email, )
    if not db_user:
        return APIResponse(message="If your email is registered, you will receive verification instructions")
        
    user = UserReadInternal.model_validate(db_user)
    if user.is_active:
        return APIResponse(message="Account already verified")

    token = await create_verification_token(user.email, TokenType.VERIFY_ACCOUNT)

    await redis_queue.enqueue(
        "send_email",
        email=user.email,
        name=user.username,
        verification_code=token
    )
    return APIResponse(message="Verification email sent. Please check your email.") 