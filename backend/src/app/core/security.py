from enum import Enum
from datetime import UTC, datetime, timedelta
from typing import Any, Literal
import uuid

import bcrypt
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from ..crud.crud_users import crud_users
from .config import settings
from .db.crud_token_blacklist import crud_token_blacklist
from .schemas import TokenBlacklistCreate, TokenData
from .utils.redis_storage import redis_storage


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS

# Thời gian hết hạn cho các token
RESET_PASSWORD_EXPIRE_MINUTES = 30
VERIFY_ACCOUNT_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"
    RESET_PASSWORD = "reset_password"
    VERIFY_ACCOUNT = "verify_account"


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    correct_password: bool = bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
    return correct_password


def get_password_hash(password: str) -> str:
    hashed_password: str = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    return hashed_password


async def create_verification_token(email: str, token_type: TokenType) -> str:
    """Tạo token xác thực (reset password hoặc verify account)"""
    token = str(uuid.uuid4())
    
    # Tính thời gian hết hạn
    if token_type == TokenType.RESET_PASSWORD:
        expires = datetime.now(UTC) + timedelta(minutes=RESET_PASSWORD_EXPIRE_MINUTES)
    else:  # VERIFY_ACCOUNT
        expires = datetime.now(UTC) + timedelta(days=VERIFY_ACCOUNT_EXPIRE_DAYS)
    
    # Lưu vào Redis với thời gian hết hạn
    key = f"{token_type}:{token}"
    expire_seconds = int(expires.timestamp() - datetime.now(UTC).timestamp())
    await redis_storage.set(key, email, expire=expire_seconds)
    
    return token


async def verify_token_from_redis(token: str, token_type: TokenType) -> str | None:
    """Xác thực token từ Redis và trả về email nếu hợp lệ"""
    key = f"{token_type}:{token}"
    email = await redis_storage.get(key, delete=True)
    if email:
        return email
    return None


async def authenticate_user(username_or_email: str, password: str, db: AsyncSession) -> dict[str, Any] | Literal[False]:
    if "@" in username_or_email:
        db_user: dict | None = await crud_users.get(db=db, email=username_or_email, is_deleted=False)
    else:
        db_user = await crud_users.get(db=db, username=username_or_email, is_deleted=False)

    if not db_user:
        return False

    elif not await verify_password(password, db_user["hashed_password"]):
        return False

    return db_user


async def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC).replace(tzinfo=None) + expires_delta
    else:
        expire = datetime.now(UTC).replace(tzinfo=None) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "token_type": TokenType.ACCESS})
    encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def create_refresh_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC).replace(tzinfo=None) + expires_delta
    else:
        expire = datetime.now(UTC).replace(tzinfo=None) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": TokenType.REFRESH})
    encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def verify_token(token: str, expected_token_type: TokenType, db: AsyncSession) -> TokenData | None:
    """Verify a JWT token and return TokenData if valid.

    Parameters
    ----------
    token: str
        The JWT token to be verified.
    expected_token_type: TokenType
        The expected type of token (access or refresh)
    db: AsyncSession
        Database session for performing database operations.

    Returns
    -------
    TokenData | None
        TokenData instance if the token is valid, None otherwise.
    """
    is_blacklisted = await crud_token_blacklist.exists(db, token=token)
    if is_blacklisted:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username_or_email: str = payload.get("sub")
        token_type: str = payload.get("token_type")
        
        if username_or_email is None or token_type != expected_token_type:
            return None
            
        return TokenData(username_or_email=username_or_email)

    except JWTError:
        return None


async def blacklist_tokens(access_token: str, refresh_token: str, db: AsyncSession) -> None:
    """Blacklist both access and refresh tokens.

    Parameters
    ----------
    access_token: str
        The access token to blacklist
    refresh_token: str
        The refresh token to blacklist
    db: AsyncSession
        Database session for performing database operations.
    """
    for token in [access_token, refresh_token]:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        expires_at = datetime.fromtimestamp(payload.get("exp"))
        await crud_token_blacklist.create(
            db, 
            object=TokenBlacklistCreate(
                token=token,
                expires_at=expires_at
            )
        )

async def blacklist_token(token: str, db: AsyncSession) -> None:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    expires_at = datetime.fromtimestamp(payload.get("exp"))
    await crud_token_blacklist.create(
        db, 
        object=TokenBlacklistCreate(
            token=token,
            expires_at=expires_at
        )
    )
