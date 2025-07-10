from typing import Annotated, cast
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status, UploadFile, File, Form
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException, ForbiddenException
from ...core.db.minio import minio
from ...crud.crud_documents import crud_documents
from ...crud.access_controls import crud_access_controls
from ...schemas.access_control import AccessControlCreateInternal, AccessControlID, AccessControlReadInternal, ResourceType, PermissionType
from ...schemas.document import DocumentRead, DocumentCreate, DocumentUpdate, AdminDocumentRead, AdminDocumentCreate, AdminDocumentUpdate, DocumentCreateInternal, DocumentReadInternal, DocumentType, DOCUMENT_MIME_TYPES


from ...schemas.user import UserReadInternal
from ...schemas.utils import APIResponse, PaginatedAPIResponse

router = APIRouter(tags=["documents"])

# User endpoints
@router.get("/documents/", response_model=PaginatedAPIResponse[DocumentRead])
async def read_documents(
    request: Request,
    project_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)],
    page: int = 1,
    items_per_page: int = 10
) -> PaginatedAPIResponse[DocumentRead]:
    """Get documents in a project (with access control)"""
    # Lấy access control project và project_id
    acl_project = await crud_access_controls.get(
        db=db,
        resource_uuid=project_uuid,
        resource_type=ResourceType.PROJECT,
        user_id=current_user.id,
        schema_to_select=cast(type[AccessControlReadInternal], AccessControlID),
        return_as_model=False
    )
    if not acl_project:
        raise NotFoundException("Project not found or access denied")
    project_id = cast(dict, acl_project)["resource_id"]

    # Lấy danh sách document mà user có quyền truy cập
    documents_data = await crud_documents.get_multi(
        db=db,
        offset=compute_offset(page, items_per_page),
        limit=items_per_page,
        is_deleted=False,
        project_id=project_id,
        schema_to_select=cast(type[DocumentReadInternal], DocumentRead),
        return_total_count=True
    )
    if not documents_data["data"]:
        raise NotFoundException("Documents not found")
    paginated_docs_data = paginated_response(crud_data=documents_data, page=page, items_per_page=items_per_page)
    return PaginatedAPIResponse(message="Documents retrieved successfully", **paginated_docs_data)


@router.get("/documents/{document_uuid}", response_model=APIResponse[DocumentRead])
async def read_document(
    request: Request,
    document_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse[DocumentRead]:
    """Get a specific document by uuid (with access control)"""
    acl_exists = await crud_access_controls.exists(
        db=db,
        resource_uuid=document_uuid,
        resource_type=ResourceType.DOCUMENT,
        user_id=current_user.id,
    )
    if not acl_exists:
        raise NotFoundException("Document not found or access denied")
    document_data = await crud_documents.get(
        db=db,
        uuid=document_uuid,
        is_deleted=False,
        schema_to_select=cast(type[DocumentReadInternal], DocumentRead),
    )
    if not document_data:
        raise NotFoundException("Document not found")
    document_data = DocumentRead.model_validate(document_data)
    presigned_url = minio.get_presigned_url(document_data.file_path)
    if not presigned_url:
        raise CustomException(status_code=500, detail="Cannot generate presigned url for this document.")
    document_read = DocumentRead(
        uuid=document_data.uuid,
        title=document_data.title,
        file_path=presigned_url,
        file_type=document_data.file_type,
        description=document_data.description,
        project_id=document_data.project_id,
        file_size=document_data.file_size,
        page_count=document_data.page_count,
        meta_info=document_data.meta_info
    )
    return APIResponse(message="Document retrieved successfully", data=document_read)


@router.post("/documents", response_model=APIResponse[DocumentRead], status_code=status.HTTP_201_CREATED)
async def create_document(
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)] ,
    project_uuid: UUID,
    file: UploadFile = File(...),
    description: str | None = Form(None),
) -> APIResponse[DocumentRead]:
    """Upload a new document to a project (with access control)"""
    # Lấy project_id
    acl_project = await crud_access_controls.get(db=db, resource_uuid=project_uuid, resource_type=ResourceType.PROJECT, user_id=current_user.id)
    if not acl_project:
        raise NotFoundException("Project not found or access denied")
    project_id = cast(dict, acl_project)["resource_id"]

    # Kiểm tra và xử lý tên file
    filename = file.filename or "uploaded_file"
    # Kiểm tra định dạng file (extension)
    allowed_extensions = {"txt", "doc", "docx", "pdf"}
    if "." not in filename:
        raise CustomException(status_code=400, detail="File must have an extension. Supported extensions: txt, doc, docx, pdf")
    file_extension = filename.rsplit(".", 1)[-1].lower()
    if file_extension not in allowed_extensions:
        raise CustomException(
            status_code=400,
            detail=f"File extension '{file_extension}' not allowed. Supported extensions: {', '.join(allowed_extensions)}"
        )

    # Kiểm tra file type được phép - dựa vào MIME type
    content_type = file.content_type if file.content_type else "application/octet-stream"
    if content_type not in DOCUMENT_MIME_TYPES:
        supported_mime_types = list(DOCUMENT_MIME_TYPES.keys())
        raise CustomException(
            status_code=400, 
            detail=f"MIME type '{content_type}' not allowed. Supported MIME types: {', '.join(supported_mime_types)}"
        )
    doc_type = DOCUMENT_MIME_TYPES[content_type]
    title = filename  # Giữ nguyên tên file với extension làm title
    
    # Tạo object_name đơn giản: {project_uuid}/{filename}
    object_name = f"{project_uuid}/{filename}"
    
    # Upload file lên MinIO
    try:
        minio.upload_file(file.file, object_name, content_type, file.size)
    except Exception as e:
        raise CustomException(status_code=500, detail=f"Failed to upload file to storage: {e}")
    # Tạo record trong DB
    document_create = DocumentCreateInternal(
        title=title,
        description=description,
        file_path=object_name,
        file_type=doc_type,
        project_id=project_id,
        file_size=file.size
    )
    document_data = await crud_documents.create(db=db, object=document_create)
    if not document_data:
        minio.delete_file(object_name) 
        raise CustomException(status_code=500, detail="Failed to create document record.")

    acl_create = AccessControlCreateInternal(
        user_id=current_user.id,
        resource_id=document_data.id,
        resource_uuid=document_data.uuid,
        resource_type=ResourceType.DOCUMENT,
        permission=PermissionType.OWNER
    )
    document_access = await crud_access_controls.create(db=db, object=acl_create)
    if not document_access:
        raise CustomException(status_code=500, detail="Failed to create chat session access. Please try again later.")
    return APIResponse(message="Document created successfully", data=document_data)


@router.delete("/documents/{document_uuid}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_document(
    document_uuid: UUID,
    current_user: Annotated[UserReadInternal, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Delete a document (with access control)"""
    # Lấy document và kiểm tra quyền
    document_data = await crud_documents.get(db=db, uuid=document_uuid, is_deleted=False)
    if not document_data:
        raise NotFoundException("Document not found")
    acl_exists = await crud_access_controls.exists(db=db, resource_uuid=document_uuid, resource_type=ResourceType.DOCUMENT, user_id=current_user.id)
    if not acl_exists:
        raise ForbiddenException("You are not authorized to delete this document")
    document_data = DocumentReadInternal.model_validate(document_data)
    # Xóa file trên MinIO
    minio.delete_file(document_data.file_path)

    # Xóa trong DB
    await crud_documents.delete(db=db, uuid=document_uuid)
    await crud_access_controls.delete(db=db, resource_uuid=document_uuid, resource_type=ResourceType.DOCUMENT)
    return APIResponse(message="Document deleted successfully")

# Admin endpoints
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
        return_total_count=True,
        schema_to_select=cast(type[DocumentReadInternal], AdminDocumentRead)
    )
    paginated_data = paginated_response(crud_data=documents_data, page=page, items_per_page=items_per_page)
    return PaginatedAPIResponse(message="Documents retrieved successfully", **paginated_data)


@router.delete("/admin/documents/{document_id}/force", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_superuser)])
async def admin_delete_db_document(
    document_id: int,
    db: Annotated[AsyncSession, Depends(async_get_db)]
) -> APIResponse:
    """Permanently delete a document from the database and storage (Superuser only)."""
    document_data = await crud_documents.get(db=db, id=document_id)
    if not document_data:
        raise NotFoundException("Document not found")
    document_data = DocumentReadInternal.model_validate(document_data)
    # Xóa file trên MinIO
    minio.delete_file(document_data.file_path)
    # Xóa khỏi DB
    await crud_documents.db_delete(db=db, id=document_id)
    await crud_access_controls.db_delete(db=db, resource_id=document_id, resource_type=ResourceType.DOCUMENT)
    return APIResponse(message="Document permanently deleted from database and storage")

