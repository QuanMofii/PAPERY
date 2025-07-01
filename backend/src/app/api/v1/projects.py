from typing import Annotated, cast
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession


from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException, ForbiddenException, UnauthorizedException
from ...crud.crud_projects import crud_projects
from ...crud.crud_users import crud_users
from ...crud.access_controls import crud_access_controls
from ...schemas.access_control import  AccessControlCreateInternal, AccessControlID, AccessControlReadInternal, AccessControlUpdateInternal, AdminAccessControlRead, ResourceType, PermissionType
from ...schemas.project import ProjectRead, ProjectCreate, ProjectUpdate, AdminProjectRead, AdminProjectCreate, AdminProjectUpdate, ProjectCreateInternal, ProjectReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["projects"])

# Regular user endpoints
@router.get("/projects/", response_model=PaginatedAPIResponse[ProjectRead])
async def read_projects(
    request: Request,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[ProjectRead]:
    """Get current user's projects with pagination"""

    acl_data = await crud_access_controls.get_multi(
    db=db,
    user_id=current_user.id,
    resource_type=ResourceType.PROJECT,
    return_as_model=False,
    schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
    return_total_count=True,
    )
    if not acl_data:
         raise NotFoundException("Projects not found or access denied")
    acl_data_dict = cast(list[dict], acl_data["data"])
    project_ids = [r["resource_id"] for r in  acl_data_dict]
    
    projects_data = await crud_projects.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        is_deleted=False,
        id__in=project_ids,
        schema_to_select=cast(type[ProjectReadInternal], ProjectRead),
        return_total_count=True
    )
    
    if not projects_data["data"]:
         raise NotFoundException("Projects not found")
    paginated_projects_data = paginated_response(crud_data=projects_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Projects retrieved successfully", **paginated_projects_data)


@router.get("/projects/{project_uuid}", response_model=APIResponse[ProjectRead])
async def read_project(
    request: Request,
    project_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ProjectRead]:
    """Get a specific project by UUID."""
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Project not found or access denied")
    
    projects_data = await crud_projects.get(
        db=db,
        uuid=project_uuid,
        is_deleted=False,
        schema_to_select=cast(type[ProjectReadInternal], ProjectRead),
    )
    if not projects_data:
        raise NotFoundException("Project not found")

    return APIResponse(message="Project retrieved successfully", data=projects_data)

@router.post("/projects", response_model=APIResponse[ProjectRead], status_code=status.HTTP_201_CREATED)
async def create_project(
    request: Request,
    project_create: ProjectCreate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ProjectRead]:
    """Create a new project for the current user."""
    project_exists = await crud_projects.exists(db=db, name=project_create.name, user_id=current_user.id)
    if project_exists:
        raise DuplicateValueException("A project with this name already exists.")
    
    create_dict = project_create.model_dump()
    create_dict["user_id"] = current_user.id
    create_internal = ProjectCreateInternal(**create_dict)
    
    project_data = await crud_projects.create(db=db, object=create_internal)
    if not project_data:
         raise CustomException(status_code=500 ,detail="Failed to create project. Please try again later.")
     
    project_access = await crud_access_controls.create(
    db=db,
    object=AccessControlCreateInternal(
        user_id=current_user.id,
        resource_id=project_data.id,
        resource_uuid=project_data.uuid,
        resource_type=ResourceType.PROJECT,
        permission=PermissionType.OWNER
        )
    )
    if not project_access:
         raise CustomException(status_code=500 ,detail="Failed to create project access. Please try again later.")
     
    return APIResponse(message="Project created successfully", data=project_data)


@router.patch("/projects/{project_uuid}", response_model=APIResponse[ProjectRead])
async def update_project(
    request: Request,
    project_uuid: UUID,
    project_update: ProjectUpdate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ProjectRead]:
    """Update a project for the current user."""
    project_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
    )
    if not project_exists:
        raise NotFoundException("Project not found or access denied")
    
    if project_update.name:
        project_exists = await crud_projects.exists(db=db, name=project_update.name, user_id=current_user.id)
        if project_exists:
            raise DuplicateValueException("A project with this name already exists.")
            
    update_dict = project_update.model_dump(exclude_unset=True)
    project_data = await crud_projects.update(db=db, object=update_dict, uuid=project_uuid, return_as_model=True,schema_to_select=cast(type[ProjectReadInternal], ProjectRead))
    
    if not project_data:
        raise CustomException(status_code=500 ,detail="Failed to update project. Please try again later.")
    
    return APIResponse(message="Project updated successfully", data=project_data )


@router.delete("/projects/{project_uuid}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_project(
    request: Request,
    project_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a project for the current user."""
    project_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
    )
    if not project_exists:
        raise NotFoundException("Project not found or access denied")
        
    await crud_projects.delete(db=db, uuid=project_uuid)
    await crud_access_controls.delete(db=db, resource_uuid=project_uuid, resource_type=ResourceType.PROJECT)
    return APIResponse(message="Project deleted successfully")


# Superuser endpoints
@router.get("/admin/projects", response_model=PaginatedAPIResponse[AdminProjectRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_projects(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminProjectRead]:
    """Get all projects with pagination (Superuser only)."""
    projects_data = await crud_projects.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True,
        schema_to_select=cast(type[ProjectReadInternal], AdminProjectRead)
    )

    paginated_projects_data = paginated_response(crud_data=projects_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Projects retrieved successfully", **paginated_projects_data)


@router.get("/admin/projects/{project_id}", response_model=APIResponse[AdminProjectRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminProjectRead]:
    """Get a specific project by ID (Superuser only)."""
    projects_data = await crud_projects.get(
        db=db,
        id=project_id,
        schema_to_select=cast(type[ProjectReadInternal], AdminProjectRead)
    )
    if not projects_data:
        raise NotFoundException("Project not found")

    return APIResponse(message="Project retrieved successfully", data=projects_data)


@router.post("/admin/projects/", response_model=APIResponse[AdminProjectRead], status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def admin_create_project(
    request: Request,
    project_create: AdminProjectCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminProjectRead]:
    """Create a new project (Superuser only)."""
    user_exists = await crud_users.exists(db=db, id=project_create.user_id)
    if not user_exists:
        raise NotFoundException("User not found")
        
    project_exists = await crud_projects.exists(db=db, name=project_create.name, user_id=project_create.user_id)
    if project_exists:
        raise DuplicateValueException("A project with this name already exists for this user.")

    create_internal = ProjectCreateInternal(**project_create.model_dump())
    projects_data = await crud_projects.create(db=db, object=create_internal)
    if not projects_data:
         raise CustomException(status_code=500 ,detail="Failed to create project. Please try again later.")
    project_access = await crud_access_controls.create(
    db=db,
    object=AccessControlCreateInternal(
        user_id=project_create.user_id,
        resource_id=projects_data.id,
        resource_uuid=projects_data.uuid,
        resource_type=ResourceType.PROJECT,
        permission=PermissionType.OWNER
        )
    )
    if not project_access:
         raise CustomException(status_code=500 ,detail="Failed to create project access. Please try again later.")
     
    return APIResponse(message="Project created successfully", data=projects_data)


@router.patch("/admin/projects/{project_id}", response_model=APIResponse[AdminProjectRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_project(
    request: Request,
    project_id: int,
    project_update: AdminProjectUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminProjectRead]:
    """Update a specific project by ID (Superuser only)."""
    project_data_old = await crud_projects.get(db=db, id=project_id,return_as_model=True,schema_to_select=cast(type[ProjectReadInternal], AdminProjectRead))
    if not project_data_old:
        raise NotFoundException("Project not found")
    
    project_data_old = AdminProjectRead.model_validate(project_data_old)
    
    if project_update.user_id and project_update.user_id != project_data_old.user_id:
        user_exists = await crud_users.exists(db=db, id=project_update.user_id)
        if not user_exists:
            raise NotFoundException("User not found")
        project_access = await crud_access_controls.update(db=db, object=AccessControlUpdateInternal(
            user_id=project_update.user_id,
        ), resource_id=project_id,resource_type=ResourceType.PROJECT, schema_to_select=cast(type[AccessControlReadInternal], AdminAccessControlRead))
        if not project_access:
            raise CustomException(status_code=500 ,detail="Failed to update project access. Please try again later.")
        

    if project_update.name:
        user_id_to_check = project_update.user_id if project_update.user_id is not None else  project_data_old.user_id
        project_exists = await crud_projects.exists(db=db, name=project_update.name, user_id=user_id_to_check)
        if project_exists:
            raise DuplicateValueException("A project with this name already exists for this user.")

    update_dict = project_update.model_dump(exclude_unset=True)
    project_data = await crud_projects.update(db=db, object=update_dict, id=project_id,return_as_model=True,schema_to_select=cast(type[ProjectReadInternal], AdminProjectRead))
    
    if not project_data:
        raise CustomException(status_code=500 ,detail="Failed to update project. Please try again later.")
    return APIResponse(message="Project updated successfully", data=project_data)


@router.delete("/admin/projects/{project_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a specific project by ID (mark as deleted) (Superuser only)."""
    project_exists = await crud_projects.exists(
        db=db,
        id=project_id,
        is_deleted=False
    )
    if not project_exists:
        raise NotFoundException("Project not found or already delete")

    await crud_projects.delete(db=db, id=project_id)
    await crud_access_controls.delete(db=db, resource_id=project_id, resource_type=ResourceType.PROJECT)
    return APIResponse(message="Project deleted successfully")


@router.delete("/admin/projects/{project_id}/force", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_db_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Permanently delete a project from the database (Superuser only)."""
    project_exists = await crud_projects.exists(db=db, id=project_id)
    if not project_exists:
        raise NotFoundException("Project not found")

    await crud_projects.db_delete(db=db, id=project_id)
    await crud_access_controls.delete(db=db, resource_id=project_id, resource_type=ResourceType.PROJECT)
    return APIResponse(message="Project deleted from the database")
