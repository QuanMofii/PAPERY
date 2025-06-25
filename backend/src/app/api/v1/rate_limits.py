from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException
from ...crud.crud_rate_limits import crud_rate_limits
from ...crud.crud_tiers import crud_tiers
from ...schemas.rate_limit import RateLimitRead, RateLimitCreate, RateLimitUpdate, AdminRateLimitRead, AdminRateLimitCreate, AdminRateLimitUpdate, RateLimitCreateInternal, RateLimitReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["rate_limits"])

# Regular user endpoints
@router.get("/rate-limits/me", response_model=PaginatedAPIResponse[RateLimitRead])
async def read_rate_limits(
    request: Request,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[RateLimitRead]:
    """Get current user's tier rate limits with pagination."""
    if not current_user.tier_id:
        raise NotFoundException("User does not have an assigned tier")
    
    rate_limits_data = await crud_rate_limits.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        tier_id=current_user.tier_id,
        is_deleted=False,
        return_total_count=True
    )
    if not rate_limits_data:
        raise NotFoundException("Rate limits not found for your tier")
    
    paginated_result = paginated_response(crud_data=rate_limits_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Rate limits retrieved successfully", **paginated_result)

@router.get("/rate-limits/{rate_limit_uuid}", response_model=APIResponse[RateLimitRead])
async def read_rate_limit(
    request: Request,
    rate_limit_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[RateLimitRead]:
    """Get a specific rate limit by UUID (only if it belongs to user's tier)."""
    if not current_user.tier_id:
        raise NotFoundException("User does not have an assigned tier")
    
    rate_limit_data = await crud_rate_limits.get(
        db=db,
        uuid=rate_limit_uuid,
        tier_id=current_user.tier_id,
        is_deleted=False
    )
    if not rate_limit_data:
        raise NotFoundException("Rate limit not found")

    return APIResponse(message="Rate limit retrieved successfully", data=rate_limit_data)

# Superuser endpoints
@router.post("/admin/rate-limits", response_model=APIResponse[AdminRateLimitRead], dependencies=[Depends(get_current_superuser)])
async def admin_create_rate_limit(
    request: Request,
    rate_limit_create: AdminRateLimitCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminRateLimitRead]:
    """Create a new rate limit (Superuser only)."""
    # Check if tier exists
    tier_exists = await crud_tiers.exists(db=db, id=rate_limit_create.tier_id)
    if not tier_exists:
        raise NotFoundException("Tier not found")
    
    # Check if rate limit with same name and tier already exists
    rate_limit_exists = await crud_rate_limits.exists(
        db=db, 
        name=rate_limit_create.name, 
        tier_id=rate_limit_create.tier_id
    )
    if rate_limit_exists:
        raise DuplicateValueException("A rate limit with this name already exists for this tier")

    create_internal = RateLimitCreateInternal(**rate_limit_create.model_dump())
    rate_limit_data = await crud_rate_limits.create(db=db, object=create_internal)
    
    if not rate_limit_data:
        raise CustomException(status_code=500, detail="Failed to create rate limit. Please try again later.")

    return APIResponse(message="Rate limit created successfully", data=rate_limit_data)

@router.get("/admin/rate-limits", response_model=PaginatedAPIResponse[AdminRateLimitRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_rate_limits(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminRateLimitRead]:
    """Get a paginated list of rate limits (Superuser only)."""
    rate_limits_data = await crud_rate_limits.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True
    )
    if not rate_limits_data:
        raise NotFoundException("Rate limits not found")
    
    paginated_result = paginated_response(crud_data=rate_limits_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Rate limits retrieved successfully", **paginated_result)

@router.get("/admin/rate-limits/{rate_limit_id}", response_model=APIResponse[AdminRateLimitRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_rate_limit(
    request: Request,
    rate_limit_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminRateLimitRead]:
    """Get rate limit information by ID (Superuser only)."""
    rate_limit_data = await crud_rate_limits.get(
        db=db, id=rate_limit_id
    )
    if not rate_limit_data:
        raise NotFoundException("Rate limit not found")

    return APIResponse(message="Rate limit retrieved successfully", data=rate_limit_data)

@router.patch("/admin/rate-limits/{rate_limit_id}", response_model=APIResponse[AdminRateLimitRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_rate_limit(
    request: Request,
    rate_limit_id: int,
    rate_limit_update: AdminRateLimitUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse[AdminRateLimitRead]:
    """Update a rate limit by ID (Superuser only)."""
    rate_limit_exists = await crud_rate_limits.exists(db=db, id=rate_limit_id)
    if not rate_limit_exists:
        raise NotFoundException("Rate limit not found")

    # If updating tier_id, check if new tier exists
    if rate_limit_update.tier_id:
        tier_exists = await crud_tiers.exists(db=db, id=rate_limit_update.tier_id)
        if not tier_exists:
            raise NotFoundException("Tier not found")

    # If updating name, check for duplicates
    if rate_limit_update.name:
        tier_id_to_check = rate_limit_update.tier_id if rate_limit_update.tier_id is not None else None
        # Get current rate limit to check tier_id if not provided in update
        if tier_id_to_check is None:
            current_rate_limit = await crud_rate_limits.get(db=db, id=rate_limit_id, return_as_model=True, schema_to_select=RateLimitReadInternal)
            if current_rate_limit:
                current_rate_limit = RateLimitReadInternal.model_validate(current_rate_limit)
                tier_id_to_check = current_rate_limit.tier_id
        
        if tier_id_to_check:
            rate_limit_exists = await crud_rate_limits.exists(
                db=db, 
                name=rate_limit_update.name, 
                tier_id=tier_id_to_check
            )
            if rate_limit_exists:
                raise DuplicateValueException("A rate limit with this name already exists for this tier")

    update_dict = rate_limit_update.model_dump(exclude_unset=True)
    rate_limit_data = await crud_rate_limits.update(db=db, object=update_dict, id=rate_limit_id)
    if not rate_limit_data:
        raise CustomException(status_code=500, detail="Failed to update rate limit. Please try again later.")
    
    return APIResponse(message="Rate limit updated successfully", data=rate_limit_data)

@router.delete("/admin/rate-limits/{rate_limit_id}", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_delete_rate_limit(
    request: Request,
    rate_limit_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Delete a rate limit by ID (mark as deleted) (Superuser only)."""
    rate_limit_exists = await crud_rate_limits.exists(db=db, id=rate_limit_id, is_deleted=False)
    if not rate_limit_exists:
        raise NotFoundException("Rate limit not found or already deleted")
    
    await crud_rate_limits.delete(db=db, id=rate_limit_id)
    return APIResponse(message="Rate limit deleted successfully")

@router.delete("/admin/rate-limits/{rate_limit_id}/force", response_model=APIResponse, dependencies=[Depends(get_current_superuser)])
async def admin_force_delete_rate_limit(
    request: Request,
    rate_limit_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> APIResponse:
    """Permanently delete a rate limit from the database (Superuser only)."""
    rate_limit_exists = await crud_rate_limits.exists(db=db, id=rate_limit_id)
    if not rate_limit_exists:
        raise NotFoundException("Rate limit not found")
    
    await crud_rate_limits.db_delete(db=db, id=rate_limit_id)
    return APIResponse(message="Rate limit permanently deleted from the database")