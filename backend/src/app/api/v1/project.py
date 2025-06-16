from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import PaginatedListResponse, compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import DuplicateValueException, ForbiddenException, NotFoundException
from ...crud.crud_projects import crud_projects
from ...schemas.project import ProjectCreate, ProjectCreateInternal, ProjectRead, ProjectUpdate

router = APIRouter(tags=["projects"])

# Regular user endpoints
@router.get("/project/me", response_model=PaginatedListResponse[ProjectRead])
async def read_projects_me(
    request: Request,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> dict:
    """Get current user's projects with pagination"""
    projects_data = await crud_projects.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        schema_to_select=ProjectRead,
        user_id=current_user["id"],
        is_deleted=False,
    )

    response: dict[str, Any] = paginated_response(crud_data=projects_data, page=page, items_per_page=items_per_page)
    return response


@router.get("/project/me/{project_id}", response_model=ProjectRead)
async def read_project_me(
    request: Request,
    project_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> ProjectRead:
    """Get specific project of current user"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        user_id=current_user["id"],
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    return db_project


@router.post("/project/me", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project_me(
    request: Request,
    project: ProjectCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> ProjectRead:
    """Create a new project for current user"""
    project_internal_dict = project.model_dump()
    project_internal_dict["user_id"] = current_user["id"]
    project_internal = ProjectCreateInternal(**project_internal_dict)
    created_project: ProjectRead = await crud_projects.create(db=db, object=project_internal)
    return created_project


@router.patch("/project/me/{project_id}")
async def update_project_me(
    request: Request,
    project_id: int,
    values: ProjectUpdate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Update specific project of current user"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        user_id=current_user["id"],
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    await crud_projects.update(db=db, object=values, id=project_id)
    return {"message": "Project updated"}


@router.delete("/project/me/{project_id}")
async def delete_project_me(
    request: Request,
    project_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Delete specific project of current user (mark as deleted)"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        user_id=current_user["id"],
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    await crud_projects.delete(db=db, id=project_id)
    return {"message": "Project deleted"}


# Superuser endpoints
@router.get("/projects", response_model=PaginatedListResponse[ProjectRead], dependencies=[Depends(get_current_superuser)])
async def read_projects(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> dict:
    """Get all projects with pagination (Superuser only)"""
    projects_data = await crud_projects.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        schema_to_select=ProjectRead,
        is_deleted=False,
    )

    response: dict[str, Any] = paginated_response(crud_data=projects_data, page=page, items_per_page=items_per_page)
    return response


@router.get("/project/{project_id}", response_model=ProjectRead, dependencies=[Depends(get_current_superuser)])
async def read_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> ProjectRead:
    """Get specific project by ID (Superuser only)"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    return db_project


@router.post("/project", response_model=ProjectRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def create_project(
    request: Request,
    project: ProjectCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> ProjectRead:
    """Create a new project (Superuser only)"""
    project_internal_dict = project.model_dump()
    project_internal = ProjectCreateInternal(**project_internal_dict)
    created_project: ProjectRead = await crud_projects.create(db=db, object=project_internal)
    return created_project


@router.patch("/project/{project_id}", dependencies=[Depends(get_current_superuser)])
async def update_project(
    request: Request,
    project_id: int,
    values: ProjectUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Update specific project by ID (Superuser only)"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    await crud_projects.update(db=db, object=values, id=project_id)
    return {"message": "Project updated"}


@router.delete("/project/{project_id}", dependencies=[Depends(get_current_superuser)])
async def delete_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Delete specific project by ID (mark as deleted) (Superuser only)"""
    db_project = await crud_projects.get(
        db=db,
        schema_to_select=ProjectRead,
        id=project_id,
        is_deleted=False
    )
    if db_project is None:
        raise NotFoundException("Project not found")

    await crud_projects.delete(db=db, id=project_id)
    return {"message": "Project deleted"}


@router.delete("/db_project/{project_id}", dependencies=[Depends(get_current_superuser)])
async def delete_db_project(
    request: Request,
    project_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> dict[str, str]:
    """Permanently delete project from database (Superuser only)"""
    db_project = await crud_projects.exists(db=db, id=project_id)
    if not db_project:
        raise NotFoundException("Project not found")

    await crud_projects.db_delete(db=db, id=project_id)
    return {"message": "Project deleted from the database"}
