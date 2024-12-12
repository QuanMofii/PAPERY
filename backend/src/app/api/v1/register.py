from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastcrud.paginated import PaginatedListResponse, compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies import get_current_superuser, get_current_user
from core.db.database import async_get_db
from core.exceptions.http_exceptions import DuplicateValueException, ForbiddenException, NotFoundException
from core.security import blacklist_token, get_password_hash, oauth2_scheme
from crud.crud_rate_limit import crud_rate_limits
from crud.crud_tier import crud_tiers
from crud.crud_users import crud_users
from models.tier import Tier
from schemas.tier import TierRead
from schemas.user import UserCreate, UserCreateInternal, UserRead, UserTierUpdate, UserUpdate

router = APIRouter(tags=["register"])


@router.post("/register", response_model=UserRead, status_code=201)
async def write_user(
    request: Request, user: UserCreate, db: Annotated[AsyncSession, Depends(async_get_db)]
) -> UserRead:
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
