from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException
from ...crud.crud_documents import crud_documents
from ...crud.crud_users import crud_users
from ...schemas.document import DocumentRead, DocumentCreate, DocumentUpdate, AdminDocumentRead, AdminDocumentCreate, AdminDocumentUpdate, DocumentCreateInternal, DocumentReadInternal
from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["documents"])

# Regular user endpoints
@router.get("/documents/", response_model=PaginatedAPIResponse[DocumentRead])
async def read_documents(
    request: Request,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[DocumentRead]:
    """Get current user's documents with pagination"""
    documents_data = await crud_documents.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        user_id=current_user.id,
        is_deleted=False,
        return_total_count=True
    )
    if not documents_data:
         raise NotFoundException("documents not found")
    paginated_documents_data = paginated_response(crud_data=documents_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="documents retrieved successfully", **paginated_documents_data)


@router.get("/documents/{document_uuid}", response_model=APIResponse[DocumentRead])
async def read_document(
    request: Request,
    document_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[DocumentRead]:
    """Get a specific document by UUID."""
    documents_data = await crud_documents.get(
        db=db,
        uuid=document_uuid,
        user_id=current_user.id,
        is_deleted=False
    )
    if not documents_data:
        raise NotFoundException("document not found")

    return APIResponse(message="document retrieved successfully", data=documents_data)

@router.post("/documents", response_model=APIResponse[DocumentRead], status_code=status.HTTP_201_CREATED)
async def create_document(
    request: Request,
    document_create: DocumentCreate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[DocumentRead]:
    """Create a new document for the current user."""
    document_exists = await crud_documents.exists(db=db, name=document_create.name, user_id=current_user.id)
    if document_exists:
        raise DuplicateValueException("A document with this name already exists.")
    
    create_dict = document_create.model_dump()
    create_dict["user_id"] = current_user.id
    create_internal = DocumentCreateInternal(**create_dict)
    
    document_data = await crud_documents.create(db=db, object=create_internal)
    if not document_data:
         raise CustomException(status_code=500 ,detail="Failed to create document. Please try again later.")
    return APIResponse(message="document created successfully", data=document_data)


@router.patch("/documents/{document_uuid}", response_model=APIResponse[DocumentRead])
async def update_document(
    request: Request,
    document_uuid: UUID,
    document_update: DocumentUpdate,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[DocumentRead]:
    """Update a document for the current user."""
    document_exists = await crud_documents.exists(
        db=db,
        uuid=document_uuid,
        user_id=current_user.id,
        is_deleted=False
    )
    if not document_exists:
        raise NotFoundException("document not found")
    
    if document_update.name:
        document_exists = await crud_documents.exists(db=db, name=document_update.name, user_id=current_user.id)
        if document_exists:
            raise DuplicateValueException("A document with this name already exists.")
            
    update_dict = document_update.model_dump(exclude_unset=True)
    document_data = await crud_documents.update(db=db, object=update_dict, uuid=document_uuid, return_as_model=True,schema_to_select=DocumentReadInternal)
    
    if not document_data:
        raise CustomException(status_code=500 ,detail="Failed to update document. Please try again later.")
    
    return APIResponse(message="document updated successfully", data=document_data )


@router.delete("/documents/{document_uuid}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_document(
    request: Request,
    document_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a document for the current user."""
    document_exists = await crud_documents.exists(
        db=db,
        uuid=document_uuid,
        user_id=current_user.id,
        is_deleted=False
    )
    if not document_exists:
        raise NotFoundException("document not found")
        
    await crud_documents.delete(db=db, uuid=document_uuid)
    return APIResponse(message="document deleted successfully")


# Superuser endpoints
@router.get("/admin/documents", response_model=PaginatedAPIResponse[AdminDocumentRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_documents(
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[AdminDocumentRead]:
    """Get all documents with pagination (Superuser only)."""
    documents_data = await crud_documents.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        return_total_count=True
    )

    paginated_documents_data = paginated_response(crud_data=documents_data, page=page, items_per_page=items_per_page)

    return PaginatedAPIResponse(message="documents retrieved successfully", **paginated_documents_data)


@router.get("/admin/documents/{document_id}", response_model=APIResponse[AdminDocumentRead], dependencies=[Depends(get_current_superuser)])
async def admin_read_document(
    request: Request,
    document_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminDocumentRead]:
    """Get a specific document by ID (Superuser only)."""
    documents_data = await crud_documents.get(
        db=db,
        id=document_id,
    )
    if not documents_data:
        raise NotFoundException("document not found")

    return APIResponse(message="document retrieved successfully", data=documents_data)


@router.post("/admin/documents/", response_model=APIResponse[AdminDocumentRead], status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_superuser)])
async def admin_create_document(
    request: Request,
    document_create: AdminDocumentCreate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminDocumentRead]:
    """Create a new document (Superuser only)."""
    user_exists = await crud_users.exists(db=db, id=document_create.user_id)
    if not user_exists:
        raise NotFoundException("User not found")
        
    document_exists = await crud_documents.exists(db=db, name=document_create.name, user_id=document_create.user_id)
    if document_exists:
        raise DuplicateValueException("A document with this name already exists for this user.")

    create_internal = DocumentCreateInternal(**document_create.model_dump())
    documents_data = await crud_documents.create(db=db, object=create_internal)
    if not documents_data:
         raise CustomException(status_code=500 ,detail="Failed to create document. Please try again later.")
    
    return APIResponse(message="document created successfully", data=documents_data)


@router.patch("/admin/documents/{document_id}", response_model=APIResponse[AdminDocumentRead], dependencies=[Depends(get_current_superuser)])
async def admin_update_document(
    request: Request,
    document_id: int,
    document_update: AdminDocumentUpdate,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[AdminDocumentRead]:
    """Update a specific document by ID (Superuser only)."""
    document_data_old = await crud_documents.get(db=db, id=document_id,return_as_model=True,schema_to_select=DocumentReadInternal)
    if not document_data_old:
        raise NotFoundException("document not found")
    
    document_data_old = DocumentReadInternal.model_validate(document_data_old)
    
    if document_update.user_id and document_update.user_id != document_data_old.user_id:
        user_exists = await crud_users.exists(db=db, id=document_update.user_id)
        if not user_exists:
            raise NotFoundException("User not found")

    if document_update.name:
        user_id_to_check = document_update.user_id if document_update.user_id is not None else  document_data_old.user_id
        document_exists = await crud_documents.exists(db=db, name=document_update.name, user_id=user_id_to_check)
        if document_exists:
            raise DuplicateValueException("A document with this name already exists for this user.")

    update_dict = document_update.model_dump(exclude_unset=True)
    document_data = await crud_documents.update(db=db, object=update_dict, id=document_id,return_as_model=True,schema_to_select=DocumentReadInternal)
    
    if not document_data:
        raise CustomException(status_code=500 ,detail="Failed to update document. Please try again later.")
    
    return APIResponse(message="document updated successfully", data=document_data)


@router.delete("/admin/documents/{document_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_document(
    request: Request,
    document_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a specific document by ID (mark as deleted) (Superuser only)."""
    document_exists = await crud_documents.exists(
        db=db,
        id=document_id,
        is_deleted=False
    )
    if not document_exists:
        raise NotFoundException("document not found or already delete")

    await crud_documents.delete(db=db, id=document_id)
    return APIResponse(message="document deleted successfully")


@router.delete("/admin/documents/{document_id}/force", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_db_document(
    request: Request,
    document_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Permanently delete a document from the database (Superuser only)."""
    document_exists = await crud_documents.exists(db=db, id=document_id)
    if not document_exists:
        raise NotFoundException("document not found")

    await crud_documents.db_delete(db=db, id=document_id)
    return APIResponse(message="document deleted from the database")
