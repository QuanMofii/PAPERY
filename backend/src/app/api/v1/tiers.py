from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException
from ...crud.crud_tiers import crud_tiers
from ...crud.crud_users import crud_users
from ...schemas.tier import TierRead, TierCreate, TierUpdate, AdminTierRead, AdminTierCreate, AdminTierUpdate, TierCreateInternal, TierReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["tiers"])

# Regular user endpoints
@router.get("/tiers/me", response_model=APIResponse[TierRead])
async def read_tier(
    request: Request,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[TierRead]:
    """Get current user's tier information."""
    if not current_user.tier_id:
        raise NotFoundException("User does not have an assigned tier")
    
    tier_data = await crud_tiers.get(
        db=db,
        id=current_user.tier_id,
        is_deleted=False
    )
    if not tier_data:
        raise NotFoundException("Tier not found")

    return APIResponse(message="Tier data retrieved successfully", data=tier_data)

# Superuser endpoints
@router.post("/admin/tiers", response_model=APIResponse[AdminTierRead], dependencies=[Depends(get_current_superuser)])
async def admin_create_tier(
    request: Request,
    tier_create: AdminTierCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminTierRead]:
    """Create a new tier (Superuser only)."""
    tier_exists = await crud_tiers.exists(db=db, name=tier_create.name)
    if tier_exists:
        raise DuplicateValueException("A tier with this name already exists")

    create_internal = TierCreateInternal(**tier_create.model_dump())
    tier_data = await crud_tiers.create(db=db, object=create_internal)
    
    if not tier_data:
        raise CustomException(status_code=500, detail="Failed to create tier. Please try again later.")

    return APIResponse(message="Tier created successfully", data=tier_data)

@router.get("/admin/tiers", response_model=PaginatedAPIResponse[AdminTierRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_tiers(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminTierRead]:
    """Get a paginated list of tiers (Superuser only)."""
    tiers_data = await crud_tiers.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True
    )
    if not tiers_data:
        raise NotFoundException("Tiers not found")
    
    paginated_result = paginated_response(crud_data=tiers_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Tiers retrieved successfully", **paginated_result)

@router.get("/admin/tiers/{tier_id}", response_model=APIResponse[AdminTierRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_tier(
    request: Request,
    tier_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminTierRead]:
    """Get tier information by ID (Superuser only)."""
    tier_data = await crud_tiers.get(
        db=db, id=tier_id
    )
    if not tier_data:
        raise NotFoundException("Tier not found")

    return APIResponse(message="Tier retrieved successfully", data=tier_data)

@router.patch("/admin/tiers/{tier_id}", response_model=APIResponse[AdminTierRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_tier(
    request: Request,
    tier_id: int,
    tier_update: AdminTierUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse[AdminTierRead]:
    """Update a tier by ID (Superuser only)."""
    tier_exists = await crud_tiers.exists(db=db, id=tier_id)
    if not tier_exists:
        raise NotFoundException("Tier not found")

    if tier_update.name:
        tier_exists = await crud_tiers.exists(db=db, name=tier_update.name)
        if tier_exists:
            raise DuplicateValueException("A tier with this name already exists")

    update_dict = tier_update.model_dump(exclude_unset=True)
    tier_data = await crud_tiers.update(db=db, object=update_dict, id=tier_id,schema_to_select=TierReadInternal,return_as_model=True)
    if not tier_data:
        raise CustomException(status_code=500, detail="Failed to update tier. Please try again later.")
    
    return APIResponse(message="Tier updated successfully", data=tier_data)

@router.delete("/admin/tiers/{tier_id}", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_delete_tier(
    request: Request,
    tier_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Delete a tier by ID (mark as deleted) (Superuser only)."""
    tier_exists = await crud_tiers.exists(db=db, id=tier_id, is_deleted=False)
    if not tier_exists:
        raise NotFoundException("Tier not found or already deleted")
    
    # Check if any users are using this tier
    users_with_tier = await crud_users.exists(db=db, tier_id=tier_id, is_deleted=False)
    if users_with_tier:
        raise CustomException(status_code=400, detail="Cannot delete tier that has active users")
    
    await crud_tiers.delete(db=db, id=tier_id)
    return APIResponse(message="Tier deleted successfully")

@router.delete("/admin/tiers/{tier_id}/force", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_force_delete_tier(
    request: Request,
    tier_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Permanently delete a tier from the database (Superuser only)."""
    tier_exists = await crud_tiers.exists(db=db, id=tier_id)
    if not tier_exists:
        raise NotFoundException("Tier not found")
    
    # Check if any users are using this tier
    users_with_tier = await crud_users.exists(db=db, tier_id=tier_id)
    if users_with_tier:
        raise CustomException(status_code=400, detail="Cannot delete tier that has users")
    
    await crud_tiers.db_delete(db=db, id=tier_id)
    return APIResponse(message="Tier permanently deleted from the database")