from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import DuplicateValueException, CustomException, NotFoundException
from ...core.security import blacklist_token, get_password_hash, oauth2_scheme
from ...crud.crud_users import crud_users

from ...schemas.user import UserRead, UserCreate, UserUpdate, AdminUserRead, AdminUserCreate, AdminUserUpdate, UserTierUpdate, UserCreateInternal, UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["users"])

# Regular user endpoints
@router.get("/users/me", response_model=APIResponse[UserRead])
async def read_current_user(
    request: Request, 
    current_user: Annotated[UserReadInternal, Depends(get_current_user)]
) -> APIResponse[UserRead]:
    """Get current user's information."""
    return APIResponse(message="User data retrieved successfully", data=current_user)

@router.patch("/users/me", response_model=APIResponse[UserRead])
async def update_current_user(
    request: Request,
    user_update: UserUpdate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse[UserRead]:
    """Update current user's information."""
    if user_update.username and user_update.username != current_user.username:
        user_exists = await crud_users.exists(db=db, username=user_update.username)
        if user_exists:
            raise DuplicateValueException("Username not available")

    if user_update.email and user_update.email != current_user.email:
        email_exists = await crud_users.exists(db=db, email=user_update.email)
        if email_exists:
            raise DuplicateValueException("Email is already registered")

    update_dict = user_update.model_dump(exclude_unset=True)
    user_data = await crud_users.update(db=db, object=update_dict, uuid=current_user.uuid,return_as_model=True,schema_to_select=UserReadInternal)
    if  not user_data:
         raise CustomException(status_code=500 ,detail="Failed to update user. Please try again later.")
    
    return APIResponse(message="User updated successfully", data=user_data)

@router.delete("/users/me", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_current_user(
    request: Request,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    token: str = Depends(oauth2_scheme),
) -> APIResponse:
    """Delete current user."""
    await crud_users.delete(db=db, id=current_user.id)
    await blacklist_token(token=token, db=db)
    return APIResponse(message="User deleted successfully")

# Superuser endpoints
@router.post("/admin/users", response_model=APIResponse[AdminUserRead], dependencies=[Depends(get_current_superuser)])
async def admin_create_user(
    request: Request, 
    user_create: AdminUserCreate, 
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminUserRead]:
    """Create a new user (Superuser only)."""
    email_exists = await crud_users.exists(db=db, email=user_create.email)
    if email_exists:
        raise DuplicateValueException("Email is already registered")

    username_exists = await crud_users.exists(db=db, username=user_create.username)
    if username_exists:
        raise DuplicateValueException("Username not available")

    create_dict = user_create.model_dump()
    create_dict["hashed_password"] = get_password_hash(password=create_dict.pop("password"))

    create_internal = UserCreateInternal(**create_dict)
    user_data = await crud_users.create(db=db, object=create_internal)
    
    if not user_data:
        raise CustomException(status_code=500 ,detail="Failed to create user. Please try again later.")
    

    return APIResponse(message="User created successfully", data=user_data)

@router.get("/admin/users", response_model=PaginatedAPIResponse[AdminUserRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_users(
    request: Request, 
    db: Annotated[AsyncSession, Depends(async_get_db)], 
    page: int = 1, 
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminUserRead]:
    """Get a paginated list of users (Superuser only)."""
    users_data = await crud_users.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True
    )
    if not users_data:
        raise NotFoundException("Users not found")
    
    paginated_result = paginated_response(crud_data=users_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Users retrieved successfully", **paginated_result)

@router.get("/admin/users/{user_id}", response_model=APIResponse[AdminUserRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_user(
    request: Request, 
    user_id: int, 
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminUserRead]:
    """Get user information by ID (Superuser only)."""
    user_data = await crud_users.get(
        db=db, id=user_id
    )
    if not user_data:
        raise NotFoundException("User not found")

    return APIResponse(message="User retrieved successfully", data=user_data)

@router.patch("/admin/users/{user_id}", response_model=APIResponse[AdminUserRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_user(
    request: Request,
    user_id: int,
    user_update: AdminUserUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse[AdminUserRead]:
    """Update a user by ID (Superuser only)."""
    user_exists = await crud_users.exists(db=db, id=user_id)
    if not user_exists:
        raise NotFoundException("User not found")

    if user_update.username:
        user_exists = await crud_users.exists(db=db, username=user_update.username)
        if user_exists:
            raise DuplicateValueException("Username not available")

    if user_update.email:
        email_exists = await crud_users.exists(db=db, email=user_update.email)
        if email_exists:
            raise DuplicateValueException("Email is already registered")

    update_dict = user_update.model_dump(exclude_unset=True)
    if "password" in update_dict:
        update_dict["hashed_password"] = get_password_hash(update_dict.pop("password"))
        
    user_data = await crud_users.update(db=db, object=update_dict, id=user_id)
    if not user_data:
        raise CustomException(status_code=500 ,detail="Failed to update user. Please try again later.")
    
    return APIResponse(message="User updated successfully", data=user_data)


@router.delete("/admin/users/{user_id}", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_delete_user(
    request: Request,
    user_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Delete a user by ID (mark as deleted) (Superuser only)."""
    user_exists = await crud_users.exists(db=db, id=user_id, is_deleted=False)
    if not user_exists:
        raise NotFoundException("User not found or already delete")
    await crud_users.delete(db=db, id=user_id)
    return APIResponse(message="User deleted successfully")

@router.delete("/admin/users/{user_id}/force", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_force_delete_user(
    request: Request,
    user_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Permanently delete a user from the database (Superuser only)."""
    user_exists = await crud_users.exists(db=db, id=user_id)
    if not user_exists:
        raise NotFoundException("User not found")
    await crud_users.db_delete(db=db, id=user_id)
    return APIResponse(message="User permanently deleted from the database")