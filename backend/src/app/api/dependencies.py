from typing import Annotated, Any

from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.db.database import async_get_db
from ..core.exceptions.http_exceptions import ForbiddenException, RateLimitException, UnauthorizedException
from ..core.logger import logging
from ..core.security import TokenType, oauth2_scheme, verify_token
from ..core.utils.rate_limit import rate_limiter
from ..crud.crud_rate_limits import crud_rate_limits
from ..crud.crud_tiers import crud_tiers
from ..crud.crud_users import crud_users
from ..models.user import User
from ..schemas.rate_limit import sanitize_path
from ..schemas.user import UserReadInternal
from ..schemas.tier import TierRead

logger = logging.getLogger(__name__)

DEFAULT_LIMIT = settings.DEFAULT_RATE_LIMIT_LIMIT
DEFAULT_PERIOD = settings.DEFAULT_RATE_LIMIT_PERIOD


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[AsyncSession, Depends(async_get_db)]
) -> UserReadInternal | None:
    """Get the current authenticated user from the token.
    
    Raises:
        UnauthorizedException: 
            - If token is invalid
            - If user does not exist
            - If user is deleted
            - If user is not activated
    """
    token_data = await verify_token(token, TokenType.ACCESS, db)
    if token_data is None:
        raise UnauthorizedException("User not authenticated.")

    if "@" in token_data.username_or_email:
        db_user = await crud_users.get(db=db, email=token_data.username_or_email, is_deleted=False)
    else:
        db_user = await crud_users.get(db=db, username=token_data.username_or_email, is_deleted=False)

    if not db_user:
        raise UnauthorizedException("User not found or has been deleted.")
    
    user = UserReadInternal.model_validate(db_user)
        
    if not user.is_active:
        raise UnauthorizedException("Account is not activated. Please verify your email first.")

    return user


async def get_optional_user(request: Request, db: AsyncSession = Depends(async_get_db)) -> UserReadInternal | None:
    """Get user information from token if available, without raising exceptions.
    
    This is used for endpoints that:
    - Allow both authenticated and unauthenticated access
    - Need to apply different rate limits based on user/IP
    - Have different behavior for authenticated/unauthenticated users
    """
    token = request.headers.get("Authorization")
    if not token:
        return None

    try:
        token_type, _, token_value = token.partition(" ")
        if token_type.lower() != "bearer" or not token_value:
            return None

        # We don't use get_current_user here to avoid exception handling
        # and to return None instead of raising exceptions
        token_data = await verify_token(token_value, TokenType.ACCESS, db)
        if token_data is None:
            return None

        if "@" in token_data.username_or_email:
            db_user = await crud_users.get(db=db, email=token_data.username_or_email, is_deleted=False)
        else:
            db_user = await crud_users.get(db=db, username=token_data.username_or_email, is_deleted=False)

        if not db_user:
            return None

        user = UserReadInternal.model_validate(db_user)
        
        if not user.is_active:
            return None

        return user

    except HTTPException as http_exc:
        if http_exc.status_code != 401:
            logger.error(f"Unexpected HTTPException in get_optional_user: {http_exc.detail}")
        return None

    except Exception as exc:
        logger.error(f"Unexpected error in get_optional_user: {exc}")
        return None


async def get_current_superuser(current_user: Annotated[UserReadInternal, Depends(get_current_user)]) -> UserReadInternal:
    """Check if the current user is a superuser."""
    if not current_user.is_superuser:
        raise ForbiddenException("You do not have enough privileges.")

    return current_user


async def rate_limiter_dependency(
    request: Request, db: Annotated[AsyncSession, Depends(async_get_db)], user: UserReadInternal | None = Depends(get_optional_user)
) -> None:
    """Check rate limits for user or IP address."""
    if hasattr(request.app.state, "initialization_complete"):
        await request.app.state.initialization_complete.wait()

    path = sanitize_path(request.url.path)
    if user:
        user_id = user.id
        db_tier = await crud_tiers.get(db, id=user.tier_id)
        if db_tier:
            tier = TierRead.model_validate(db_tier)
            # Rate limit CRUD doesn't have a read schema, so we need to handle this differently
            # We'll use the raw model or create a custom query
            rate_limit_dict = await crud_rate_limits.get(db=db, tier_id=tier.id, path=path)
            if rate_limit_dict:
                # Since rate_limits CRUD has no read schema, we need to access the dict directly
                limit, period = rate_limit_dict["limit"], rate_limit_dict["period"]
            else:
                logger.warning(
                    f"User {user_id} with tier '{tier.name}' has no specific rate limit for path '{path}'. \
                        Applying default rate limit."
                )
                limit, period = DEFAULT_LIMIT, DEFAULT_PERIOD
        else:
            logger.warning(f"User {user_id} has no assigned tier. Applying default rate limit.")
            limit, period = DEFAULT_LIMIT, DEFAULT_PERIOD
    else:
        user_id = request.client.host if request.client else "unknown"
        limit, period = DEFAULT_LIMIT, DEFAULT_PERIOD

    # Convert user_id to int for rate limiter if it's a user ID, otherwise use string for IP
    if isinstance(user_id, int):
        rate_limit_user_id = user_id
    else:
        # For IP addresses, we'll use a hash or some other method to convert to int
        # For now, we'll use a simple hash
        rate_limit_user_id = hash(user_id) % (2**31)  # Ensure it fits in int32

    is_limited = await rate_limiter.is_rate_limited(db=db, user_id=rate_limit_user_id, path=path, limit=limit, period=period)
    if is_limited:
        raise RateLimitException("Rate limit exceeded.")
