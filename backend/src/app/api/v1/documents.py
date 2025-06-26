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

