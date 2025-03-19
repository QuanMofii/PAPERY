from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import PaginatedListResponse, compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import DuplicateValueException, ForbiddenException, NotFoundException
from ...core.security import blacklist_token, get_password_hash, oauth2_scheme
from ...crud.crud_rate_limit import crud_rate_limits
from ...crud.crud_tier import crud_tiers
from ...crud.crud_users import crud_users
from ...models.tier import Tier
from ...schemas.tier import TierRead
from ...schemas.user import UserCreate, UserCreateInternal, UserRead, UserTierUpdate, UserUpdate

router = APIRouter(tags=["users"])

# Regular user endpoints
@router.get("/user/me", response_model=UserRead)
async def read_user_me(
    request: Request, 
    current_user: Annotated[UserRead, Depends(get_current_user)]
) -> UserRead:
    """Get current user information"""
    
    return current_user


@router.patch("/user/me")
async def update_user_me(
    request: Request,
    values: UserUpdate,
    current_user: Annotated[UserRead, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    """Update current user information"""
    if values.username != current_user["username"]:
        existing_username = await crud_users.exists(db=db, username=values.username)
        if existing_username:
            raise DuplicateValueException("Username not available")

    if values.email != current_user["email"]:
        existing_email = await crud_users.exists(db=db, email=values.email)
        if existing_email:
            raise DuplicateValueException("Email is already registered")

    await crud_users.update(db=db, object=values, username=current_user["username"])
    return {"message": "User updated"}


@router.delete("/user/me")
async def delete_user_me(
    request: Request,
    current_user: Annotated[UserRead, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    token: str = Depends(oauth2_scheme),
) -> dict[str, str]:
    """Delete current user (mark as deleted)"""
    await crud_users.delete(db=db, username=current_user["username"])
    await blacklist_token(token=token, db=db)
    return {"message": "User deleted"}


@router.get("/user/me/tier")
async def read_user_me_tier(
    request: Request,
    current_user: Annotated[UserRead, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict | None:
    """Get current user tier information"""
    db_tier = await crud_tiers.exists(db=db, id=current_user["tier_id"])
    if not db_tier:
        raise NotFoundException("Tier not found")

    joined: dict = await crud_users.get_joined(
        db=db,
        join_model=Tier,
        join_prefix="tier_",
        schema_to_select=UserRead,
        join_schema_to_select=TierRead,
        username=current_user["username"],
    )

    return joined


@router.get("/user/me/rate_limits")
async def read_user_me_rate_limits(
    request: Request,
    current_user: Annotated[UserRead, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, Any]:
    """Get current user rate limits"""
    if current_user["tier_id"] is None:
        current_user["tier_rate_limits"] = []
        return current_user

    db_tier = await crud_tiers.get(db=db, id=current_user["tier_id"])
    if db_tier is None:
        raise NotFoundException("Tier not found")

    db_rate_limits = await crud_rate_limits.get_multi(db=db, tier_id=db_tier["id"])
    current_user["tier_rate_limits"] = db_rate_limits["data"]

    return current_user

# Superuser endpoints
@router.post("/user", response_model=UserRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def create_user(
    request: Request, 
    user: UserCreate, 
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> UserRead:
    """Create a new user (Superuser only)"""
    email_row = await crud_users.exists(db=db, email=user.email)
    if email_row:
        raise DuplicateValueException("Email is already registered")

    username_row = await crud_users.exists(db=db, username=user.username)
    if username_row:
        raise DuplicateValueException("Username not available")

    user_internal_dict = user.model_dump()
    user_internal_dict["hashed_password"] = get_password_hash(password=user_internal_dict["password"])
    del user_internal_dict["password"]

    user_internal = UserCreateInternal(**user_internal_dict)
    created_user: UserRead = await crud_users.create(db=db, object=user_internal)
    return created_user


@router.get("/users", response_model=PaginatedListResponse[UserRead], dependencies=[Depends(get_current_superuser)])
async def read_users(
    request: Request, 
    db: Annotated[AsyncSession, Depends(async_get_db)], 
    page: int = 1, 
    items_per_page: int = 10
) -> dict:
    """Get all users with pagination (Superuser only)"""
    users_data = await crud_users.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        schema_to_select=UserRead,
        is_deleted=False,
    )

    response: dict[str, Any] = paginated_response(crud_data=users_data, page=page, items_per_page=items_per_page)
    return response


@router.get("/user/{username}", response_model=UserRead, dependencies=[Depends(get_current_superuser)])
async def read_user(
    request: Request, 
    username: str, 
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict:
    """Get user by username (Superuser only)"""
    db_user: UserRead | None = await crud_users.get(
        db=db, schema_to_select=UserRead, username=username, is_deleted=False
    )
    if db_user is None:
        raise NotFoundException("User not found")

    return db_user


@router.patch("/user/{username}", dependencies=[Depends(get_current_superuser)])
async def update_user(
    request: Request,
    username: str,
    values: UserUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    """Update user by username (Superuser only)"""
    db_user = await crud_users.get(db=db, schema_to_select=UserRead, username=username)
    if db_user is None:
        raise NotFoundException("User not found")

    if values.username != db_user["username"]:
        existing_username = await crud_users.exists(db=db, username=values.username)
        if existing_username:
            raise DuplicateValueException("Username not available")

    if values.email != db_user["email"]:
        existing_email = await crud_users.exists(db=db, email=values.email)
        if existing_email:
            raise DuplicateValueException("Email is already registered")

    await crud_users.update(db=db, object=values, username=username)
    return {"message": "User updated"}


@router.delete("/user/{username}", dependencies=[Depends(get_current_superuser)])
async def delete_user(
    request: Request,
    username: str,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    """Delete user by username (mark as deleted) (Superuser only)"""
    db_user = await crud_users.get(db=db, schema_to_select=UserRead, username=username)
    if not db_user:
        raise NotFoundException("User not found")

    await crud_users.delete(db=db, username=username)
    return {"message": "User deleted"}


@router.delete("/db_user/{username}", dependencies=[Depends(get_current_superuser)])
async def delete_db_user(
    request: Request,
    username: str,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> dict[str, str]:
    """Permanently delete user from database (Superuser only)"""
    db_user = await crud_users.exists(db=db, username=username)
    if not db_user:
        raise NotFoundException("User not found")

    await crud_users.db_delete(db=db, username=username)
    return {"message": "User deleted from the database"}


@router.patch("/user/{username}/tier", dependencies=[Depends(get_current_superuser)])
async def update_user_tier(
    request: Request, 
    username: str, 
    values: UserTierUpdate, 
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Update user tier (Superuser only)"""
    db_user = await crud_users.get(db=db, username=username, schema_to_select=UserRead)
    if db_user is None:
        raise NotFoundException("User not found")

    db_tier = await crud_tiers.get(db=db, id=values.tier_id)
    if db_tier is None:
        raise NotFoundException("Tier not found")

    await crud_users.update(db=db, object=values, username=username)
    return {"message": f"User {db_user['name']} Tier updated"}