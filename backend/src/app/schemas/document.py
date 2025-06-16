from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema
from ..models.document import DocumentType


class DocumentBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["My Document"])]
    file_path: Annotated[str, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"])]
    file_type: Annotated[DocumentType, Field(examples=["pdf"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)]


class Document(TimestampSchema, DocumentBase, UUIDSchema, PersistentDeletion):
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None


class DocumentRead(BaseModel):
    id: int
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["My Document"])]
    file_path: Annotated[str, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"])]
    file_type: Annotated[DocumentType, Field(examples=["pdf"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)]
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None
    created_at: datetime
    updated_at: datetime


class DocumentCreate(DocumentBase):
    model_config = ConfigDict(extra="forbid")
    
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None


class DocumentCreateInternal(DocumentBase):
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None


class DocumentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Document"], default=None)]
    file_path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"], default=None)]
    file_type: Annotated[DocumentType | None, Field(examples=["pdf"], default=None)]
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)]
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None


class DocumentUpdateInternal(DocumentUpdate):
    updated_at: datetime


class DocumentDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime


class DocumentRestoreDeleted(BaseModel):
    is_deleted: bool
