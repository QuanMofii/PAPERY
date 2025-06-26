from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Request, status
from fastcrud.paginated import compute_offset, paginated_response
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.dependencies import get_current_superuser, get_current_user
from ...core.db.database import async_get_db
from ...core.exceptions.http_exceptions import CustomException, NotFoundException, DuplicateValueException


router = APIRouter(tags=["chat_messages"])