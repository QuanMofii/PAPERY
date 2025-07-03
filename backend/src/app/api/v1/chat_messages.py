from typing import Annotated, cast
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException, ForbiddenException
from ...crud.crud_chat_message import crud_chatMessages
from ...crud.crud_chat_session import crud_chatSessions
from ...crud.access_controls import crud_access_controls
from ...schemas.access_control import AccessControlCreateInternal, AccessControlID, AccessControlReadInternal, AccessControlUpdateInternal, AdminAccessControlRead, ResourceType, PermissionType
from ...schemas.chat_message import ChatMessageRead, ChatMessageCreate, ChatMessageUpdate, AdminChatMessageRead, AdminChatMessageCreate, AdminChatMessageUpdate, ChatMessageCreateInternal, ChatMessageReadInternal
from ...schemas.chat_session import ChatSessionReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse, OnlyID

router = APIRouter(tags=["chat_messages"])

# User endpoints
@router.get("/chat-messages/", response_model=PaginatedAPIResponse[ChatMessageRead])
async def read_chat_messages(
    request: Request,
    chat_session_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[ChatMessageRead]:
    """Get messages in a chat session (with access control)"""
    # Lấy access control chat session
    acl_chat_session = await crud_access_controls.get(
        db=db,
        resource_uuid=chat_session_uuid,
        resource_type=ResourceType.CHAT_SESSION,
        user_id=current_user.id,
        schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
        return_as_model=False
    )
    if not acl_chat_session:
        raise NotFoundException("Chat session not found or access denied")
    chat_session_id = cast(dict, acl_chat_session)["resource_id"]

    messages_data = await crud_chatMessages.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        is_deleted=False,
        chat_session_id=chat_session_id,
        schema_to_select=cast(type[ChatMessageReadInternal], ChatMessageRead),
        return_total_count=True
    )
    if not messages_data["data"]:
        raise NotFoundException("Messages not found")
    paginated_messages_data = paginated_response(crud_data=messages_data, page=page, items_per_page=items_per_page)
    return PaginatedAPIResponse(message="Messages retrieved successfully", **paginated_messages_data)


@router.get("/chat-messages/{message_uuid}", response_model=APIResponse[ChatMessageRead])
async def read_chat_message(
    request: Request,
    message_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatMessageRead]:
    """Get a specific message by uuid (with access control)"""
    # Lấy access control message
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=message_uuid,
        resource_type=ResourceType.CHAT_MESSAGE,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Message not found or access denied")
    message_data = await crud_chatMessages.get(
        db=db,
        uuid=message_uuid,
        is_deleted=False,
        schema_to_select=cast(type[ChatMessageReadInternal], ChatMessageRead),
    )
    if not message_data:
        raise NotFoundException("Message not found")
    return APIResponse(message="Message retrieved successfully", data=message_data)


@router.post("/chat-messages", response_model=APIResponse[ChatMessageRead], status_code=status.HTTP_201_CREATED)
async def create_chat_message(
    request: Request,
    message_create: ChatMessageCreate,
    chat_session_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatMessageRead]:
    """Create a new message in a chat session (with access control)"""
    # Lấy access control chat session
    acl_chat_session = await crud_access_controls.get(
        db=db,
        resource_uuid=chat_session_uuid,
        resource_type=ResourceType.CHAT_SESSION,
        user_id=current_user.id,
        schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
        return_as_model=False
    )
    if not acl_chat_session:
        raise NotFoundException("Chat session not found or access denied")
    chat_session_id = cast(dict, acl_chat_session)["resource_id"]

    result = await db.execute(
        text("SELECT MAX(sequence_number) FROM chat_message WHERE chat_session_id = :chat_session_id"),
        {"chat_session_id": chat_session_id}
    )
    max_seq = result.scalar() or 0
    next_seq = max_seq + 1
    create_dict = message_create.model_dump()
    create_dict["chat_session_id"] = chat_session_id
    create_dict["sequence_number"] = next_seq
    create_internal = ChatMessageCreateInternal(**create_dict)
    message_data = await crud_chatMessages.create(db=db, object=create_internal)
    if not message_data:
        raise CustomException(status_code=500, detail="Failed to create message. Please try again later.")
    # Tạo access control cho message
    message_access = await crud_access_controls.create(
        db=db,
        object=AccessControlCreateInternal(
            user_id=current_user.id,
            resource_id=message_data.id,
            resource_uuid=message_data.uuid,
            resource_type=ResourceType.CHAT_MESSAGE,
            permission=PermissionType.OWNER
        )
    )
    if not message_access:
        raise CustomException(status_code=500, detail="Failed to create message access. Please try again later.")
    return APIResponse(message="Message created successfully", data=message_data)


@router.patch("/chat-messages/{message_uuid}", response_model=APIResponse[ChatMessageRead])
async def update_chat_message(
    request: Request,
    message_uuid: UUID,
    message_update: ChatMessageUpdate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[ChatMessageRead]:
    """Update a message (with access control)"""
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=message_uuid,
        resource_type=ResourceType.CHAT_MESSAGE,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Message not found or access denied")

    update_dict = message_update.model_dump(exclude_unset=True)
    message_data = await crud_chatMessages.update(
        db=db,
        object=update_dict,
        uuid=message_uuid,
        return_as_model=True,
        schema_to_select=cast(type[ChatMessageReadInternal], ChatMessageRead)
    )
    if not message_data:
        raise CustomException(status_code=500, detail="Failed to update message. Please try again later.")
    return APIResponse(message="Message updated successfully", data=message_data)


@router.delete("/chat-messages/{message_uuid}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_chat_message(
    request: Request,
    message_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a message (with access control)"""
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=message_uuid,
        resource_type=ResourceType.CHAT_MESSAGE,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Message not found or access denied")
    await crud_chatMessages.delete(db=db, uuid=message_uuid)
    await crud_access_controls.delete(db=db, resource_uuid=message_uuid, resource_type=ResourceType.CHAT_MESSAGE)
    return APIResponse(message="Message deleted successfully")


# Admin endpoints
@router.get("/admin/chat-messages", response_model=PaginatedAPIResponse[AdminChatMessageRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_chat_messages(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminChatMessageRead]:
    """Get all messages with pagination (Superuser only)."""
    messages_data = await crud_chatMessages.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True,
        schema_to_select=cast(type[ChatMessageReadInternal], AdminChatMessageRead)
    )
    paginated_messages_data = paginated_response(crud_data=messages_data, page=page, items_per_page=items_per_page)
    return PaginatedAPIResponse(message="Messages retrieved successfully", **paginated_messages_data)


@router.get("/admin/chat-messages/{message_id}", response_model=APIResponse[AdminChatMessageRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_chat_message(
    request: Request,
    message_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatMessageRead]:
    """Get a specific message by ID (Superuser only)."""
    message_data = await crud_chatMessages.get(
        db=db,
        id=message_id,
        schema_to_select=cast(type[ChatMessageReadInternal], AdminChatMessageRead)
    )
    if not message_data:
        raise NotFoundException("Message not found")
    return APIResponse(message="Message retrieved successfully", data=message_data)


@router.post("/admin/chat-messages/", response_model=APIResponse[AdminChatMessageRead], status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def admin_create_chat_message(
    request: Request,
    message_create: AdminChatMessageCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatMessageRead]:
    """Create a new message (Superuser only)."""
    create_internal = ChatMessageCreateInternal(**message_create.model_dump())
    message_data = await crud_chatMessages.create(db=db, object=create_internal)
    if not message_data:
        raise CustomException(status_code=500, detail="Failed to create message. Please try again later.")
    return APIResponse(message="Message created successfully", data=message_data)


@router.patch("/admin/chat-messages/{message_id}", response_model=APIResponse[AdminChatMessageRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_chat_message(
    request: Request,
    message_id: int,
    message_update: AdminChatMessageUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminChatMessageRead]:
    """Update a specific message by ID (Superuser only)."""

    update_dict = message_update.model_dump(exclude_unset=True)
    message_data = await crud_chatMessages.update(
        db=db,
        object=update_dict,
        id=message_id,
        return_as_model=True,
        schema_to_select=cast(type[ChatMessageReadInternal], AdminChatMessageRead)
    )
    if not message_data:
        raise CustomException(status_code=500, detail="Failed to update message. Please try again later.")
    return APIResponse(message="Message updated successfully", data=message_data)


@router.delete("/admin/chat-messages/{message_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_chat_message(
    request: Request,
    message_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a specific message by ID (mark as deleted) (Superuser only)."""
    message_exists = await crud_chatMessages.exists(
        db=db,
        id=message_id,
        is_deleted=False
    )
    if not message_exists:
        raise NotFoundException("Message not found or already deleted")
    await crud_chatMessages.delete(db=db, id=message_id)
    await crud_access_controls.delete(db=db, resource_id=message_id, resource_type=ResourceType.CHAT_MESSAGE)
    return APIResponse(message="Message deleted successfully")


@router.delete("/admin/chat-messages/{message_id}/force", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_db_chat_message(
    request: Request,
    message_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Permanently delete a message from the database (Superuser only)."""
    message_exists = await crud_chatMessages.exists(db=db, id=message_id)
    if not message_exists:
        raise NotFoundException("Message not found")
    await crud_chatMessages.db_delete(db=db, id=message_id)
    await crud_access_controls.db_delete(db=db, resource_id=message_id, resource_type=ResourceType.CHAT_MESSAGE)
    return APIResponse(message="Message deleted from the database")