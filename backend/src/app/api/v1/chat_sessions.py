from typing import Annotated, cast
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException, ForbiddenException, UnauthorizedException
from ...crud.crud_chat_session import crud_chatSessions
from ...crud.crud_projects import crud_projects
from ...crud.access_controls import crud_access_controls
from ...schemas.access_control import AccessControlCreateInternal, AccessControlID, AccessControlReadInternal, AccessControlUpdateInternal, AdminAccessControlRead, ResourceType, PermissionType
from ...schemas.chat_session import ChatSessionRead, ChatSessionCreate, ChatSessionUpdate, AdminChatSessionRead, AdminChatSessionCreate, AdminChatSessionUpdate, ChatSessionCreateInternal, ChatSessionReadInternal
from ...schemas.project import ProjectRead, ProjectReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse, OnlyID

router = APIRouter(tags=["chat_sessions"])

# Regular user endpoints
@router.get("/chat-sessions/", response_model=PaginatedAPIResponse[ChatSessionRead])
async def read_chat_sessions(
    request: Request,
    project_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[ChatSessionRead]:
    """Get current user's chat sessions in a project with pagination"""

    # Lấy access control của user với project này
    acl_project_id = await crud_access_controls.get(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
        schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
        return_as_model=False
    )
    if not acl_project_id:
        raise NotFoundException("Project not found or access denied")
    acl_project_id_dict = cast(dict, acl_project_id)
    project_id = acl_project_id_dict["resource_id"] 

    # Lọc chat session theo project_id và access control
    chat_sessions_data = await crud_chatSessions.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        is_deleted=False,
        project_id=project_id,
        schema_to_select=cast(type[ChatSessionReadInternal], ChatSessionRead),
        return_total_count=True
    )
    
    if not chat_sessions_data["data"]:
        raise NotFoundException("Chat sessions not found")
    paginated_chat_sessions_data = paginated_response(crud_data=chat_sessions_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Chat sessions retrieved successfully", **paginated_chat_sessions_data)


@router.get("/chat-sessions/{chat_session_uuid}", response_model=APIResponse[ChatSessionRead])
async def read_chat_session(
    request: Request,
    chat_session_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatSessionRead]:
    """Get a specific chat session by UUID."""
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=chat_session_uuid,
        resource_type=ResourceType.CHAT_SESSION,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Chat session not found or access denied")
    
    chat_session_data = await crud_chatSessions.get(
        db=db,
        uuid=chat_session_uuid,
        is_deleted=False,
        schema_to_select=cast(type[ChatSessionReadInternal], ChatSessionRead),
    )
    if not chat_session_data:
        raise NotFoundException("Chat session not found")

    return APIResponse(message="Chat session retrieved successfully", data=chat_session_data)


@router.post("/chat-sessions", response_model=APIResponse[ChatSessionRead], status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    request: Request,
    chat_session_create: ChatSessionCreate,
    project_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatSessionRead]:
    """Create a new chat session for the current user in a specific project."""
    # Check quyền và lấy luôn project_id từ access control
    acl_project_id = await crud_access_controls.get(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
        schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
        return_as_model=False
    )
    if not acl_project_id:
        raise NotFoundException("Project not found or access denied")
    acl_project_id_dict = cast(dict, acl_project_id)
    project_id = acl_project_id_dict["resource_id"]

    # Check trùng lặp title trong project
    chat_session_exists = await crud_chatSessions.exists(
        db=db, 
        title=chat_session_create.title, 
        project_id=project_id
    )
    if chat_session_exists:
        raise DuplicateValueException("A chat session with this title already exists in this project.")
    
    create_dict = chat_session_create.model_dump()
    create_dict["project_id"] = project_id
    create_internal = ChatSessionCreateInternal(**create_dict)
    
    chat_session_data = await crud_chatSessions.create(db=db, object=create_internal)
    if not chat_session_data:
        raise CustomException(status_code=500, detail="Failed to create chat session. Please try again later.")
     
    chat_session_access = await crud_access_controls.create(
        db=db,
        object=AccessControlCreateInternal(
            user_id=current_user.id,
            resource_id=chat_session_data.id,
            resource_uuid=chat_session_data.uuid,
            resource_type=ResourceType.CHAT_SESSION,
            permission=PermissionType.OWNER
        )
    )
    if not chat_session_access:
        raise CustomException(status_code=500, detail="Failed to create chat session access. Please try again later.")
     
    return APIResponse(message="Chat session created successfully", data=chat_session_data)


@router.patch("/chat-sessions/{chat_session_uuid}", response_model=APIResponse[ChatSessionRead])
async def update_chat_session(
    request: Request,
    chat_session_uuid: UUID,
    chat_session_update: ChatSessionUpdate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatSessionRead]:
    """Update a chat session for the current user."""
    # Kiểm tra quyền với chat session
    chat_session_acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=chat_session_uuid,
        resource_type=ResourceType.CHAT_SESSION,
        user_id=current_user.id,
    )
    if not chat_session_acl_exists:
        raise NotFoundException("Chat session not found or access denied")
    
    # Lấy thông tin chat session hiện tại để lấy project_id
    current_chat_session = await crud_chatSessions.get(
        db=db,
        uuid=chat_session_uuid,
        is_deleted=False,
        schema_to_select=cast(type[ChatSessionReadInternal], OnlyID),
   
    )
    if not current_chat_session:
        raise NotFoundException("Chat session not found")

    project_id = cast(dict,current_chat_session)["id"]
    if chat_session_update.title:
        chat_session_exists = await crud_chatSessions.exists(
            db=db, 
            title=chat_session_update.title, 
            project_id=project_id
        )
        if chat_session_exists:
            raise DuplicateValueException("A chat session with this title already exists in this project.")
            
    update_dict = chat_session_update.model_dump(exclude_unset=True)
    chat_session_data = await crud_chatSessions.update(
        db=db, 
        object=update_dict, 
        uuid=chat_session_uuid, 
        return_as_model=True,
        schema_to_select=cast(type[ChatSessionReadInternal], ChatSessionRead)
    )
    
    if not chat_session_data:
        raise CustomException(status_code=500, detail="Failed to update chat session. Please try again later.")
    
    return APIResponse(message="Chat session updated successfully", data=chat_session_data)


@router.delete("/chat-sessions/{chat_session_uuid}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_chat_session(
    request: Request,
    chat_session_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a chat session for the current user."""
    chat_session_acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=chat_session_uuid,
        resource_type=ResourceType.CHAT_SESSION,
        user_id=current_user.id,
    )
    if not chat_session_acl_exists:
        raise NotFoundException("Chat session not found or access denied")
        
    await crud_chatSessions.delete(db=db, uuid=chat_session_uuid)
    await crud_access_controls.delete(db=db, resource_uuid=chat_session_uuid, resource_type=ResourceType.CHAT_SESSION)
    return APIResponse(message="Chat session deleted successfully")


# Superuser endpoints
@router.get("/admin/chat-sessions", response_model=PaginatedAPIResponse[AdminChatSessionRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_chat_sessions(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminChatSessionRead]:
    """Get all chat sessions with pagination (Superuser only)."""
    chat_sessions_data = await crud_chatSessions.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True,
        schema_to_select=cast(type[ChatSessionReadInternal], AdminChatSessionRead)
    )

    paginated_chat_sessions_data = paginated_response(crud_data=chat_sessions_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="Chat sessions retrieved successfully", **paginated_chat_sessions_data)


@router.get("/admin/chat-sessions/{chat_session_id}", response_model=APIResponse[AdminChatSessionRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_chat_session(
    request: Request,
    chat_session_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatSessionRead]:
    """Get a specific chat session by ID (Superuser only)."""
    chat_session_data = await crud_chatSessions.get(
        db=db,
        id=chat_session_id,
        schema_to_select=cast(type[ChatSessionReadInternal], AdminChatSessionRead)
    )
    if not chat_session_data:
        raise NotFoundException("Chat session not found")

    return APIResponse(message="Chat session retrieved successfully", data=chat_session_data)


@router.post("/admin/chat-sessions/", response_model=APIResponse[AdminChatSessionRead], status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def admin_create_chat_session(
    request: Request,
    chat_session_create: AdminChatSessionCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatSessionRead]:
    """Create a new chat session (Superuser only)."""
    project_exists = await crud_projects.exists(db=db, id=chat_session_create.project_id)
    if not project_exists:
        raise NotFoundException("Project not found")
        
    chat_session_exists = await crud_chatSessions.exists(
        db=db, 
        title=chat_session_create.title, 
        project_id=chat_session_create.project_id
    )
    if chat_session_exists:
        raise DuplicateValueException("A chat session with this title already exists in this project.")

    create_internal = ChatSessionCreateInternal(**chat_session_create.model_dump())
    chat_session_data = await crud_chatSessions.create(db=db, object=create_internal)
    if not chat_session_data:
        raise CustomException(status_code=500, detail="Failed to create chat session. Please try again later.")
    
    # Create access control for the project owner
    project_data = await crud_projects.get(
        db=db,
        id=chat_session_create.project_id,
        schema_to_select=cast(type[ProjectReadInternal], ProjectReadInternal),
    )
    
    if not project_data:
        raise NotFoundException("Project not found")
    
    project_data = ProjectReadInternal.model_validate(project_data)
    
    chat_session_access = await crud_access_controls.create(
        db=db,
        object=AccessControlCreateInternal(
            user_id=project_data.user_id,
            resource_id=chat_session_data.id,
            resource_uuid=chat_session_data.uuid,
            resource_type=ResourceType.CHAT_SESSION,
            permission=PermissionType.OWNER
        )
    )
    if not chat_session_access:
        raise CustomException(status_code=500, detail="Failed to create chat session access. Please try again later.")
     
    return APIResponse(message="Chat session created successfully", data=chat_session_data)


@router.patch("/admin/chat-sessions/{chat_session_id}", response_model=APIResponse[AdminChatSessionRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_chat_session(
    request: Request,
    chat_session_id: int,
    chat_session_update: AdminChatSessionUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatSessionRead]:
    """Update a specific chat session by ID (Superuser only)."""
    chat_session_data_old = await crud_chatSessions.get(
        db=db, 
        id=chat_session_id,
        return_as_model=True,
        schema_to_select=cast(type[ChatSessionReadInternal], AdminChatSessionRead)
    )
    if not chat_session_data_old:
        raise NotFoundException("Chat session not found")
    
    chat_session_data_old = AdminChatSessionRead.model_validate(chat_session_data_old)
    
    if chat_session_update.project_id and chat_session_update.project_id != chat_session_data_old.project_id:
        project_exists = await crud_projects.exists(db=db, id=chat_session_update.project_id)
        if not project_exists:
            raise NotFoundException("Project not found")
        
        # Update access control for new project owner
        new_project_data = await crud_projects.get(
            db=db,
            id=chat_session_update.project_id,
            schema_to_select=cast(type[ProjectReadInternal], ProjectReadInternal),
        )
        
        if not new_project_data:
            raise NotFoundException("New project not found")
        
        new_project_data = ProjectReadInternal.model_validate(new_project_data)
        
        chat_session_access = await crud_access_controls.update(
            db=db, 
            object=AccessControlUpdateInternal(
                user_id=new_project_data.user_id,
            ), 
            resource_id=chat_session_id,
            resource_type=ResourceType.CHAT_SESSION, 
            schema_to_select=cast(type[AccessControlReadInternal], AdminAccessControlRead)
        )
        if not chat_session_access:
            raise CustomException(status_code=500, detail="Failed to update chat session access. Please try again later.")

    if chat_session_update.title:
        project_id_to_check = chat_session_update.project_id if chat_session_update.project_id is not None else chat_session_data_old.project_id
        chat_session_exists = await crud_chatSessions.exists(
            db=db, 
            title=chat_session_update.title, 
            project_id=project_id_to_check
        )
        if chat_session_exists:
            raise DuplicateValueException("A chat session with this title already exists in this project.")

    update_dict = chat_session_update.model_dump(exclude_unset=True)
    chat_session_data = await crud_chatSessions.update(
        db=db, 
        object=update_dict, 
        id=chat_session_id,
        return_as_model=True,
        schema_to_select=cast(type[ChatSessionReadInternal], AdminChatSessionRead)
    )
    
    if not chat_session_data:
        raise CustomException(status_code=500, detail="Failed to update chat session. Please try again later.")
    return APIResponse(message="Chat session updated successfully", data=chat_session_data)


@router.delete("/admin/chat-sessions/{chat_session_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_chat_session(
    request: Request,
    chat_session_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a specific chat session by ID (mark as deleted) (Superuser only)."""
    chat_session_exists = await crud_chatSessions.exists(
        db=db,
        id=chat_session_id,
        is_deleted=False
    )
    if not chat_session_exists:
        raise NotFoundException("Chat session not found or already deleted")

    await crud_chatSessions.delete(db=db, id=chat_session_id)
    await crud_access_controls.delete(db=db, resource_id=chat_session_id, resource_type=ResourceType.CHAT_SESSION)
    return APIResponse(message="Chat session deleted successfully")


@router.delete("/admin/chat-sessions/{chat_session_id}/force", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_db_chat_session(
    request: Request,
    chat_session_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Permanently delete a chat session from the database (Superuser only)."""
    chat_session_exists = await crud_chatSessions.exists(db=db, id=chat_session_id)
    if not chat_session_exists:
        raise NotFoundException("Chat session not found")

    await crud_chatSessions.db_delete(db=db, id=chat_session_id)
    await crud_access_controls.db_delete(db=db, resource_id=chat_session_id, resource_type=ResourceType.CHAT_SESSION)
    return APIResponse(message="Chat session deleted from the database")