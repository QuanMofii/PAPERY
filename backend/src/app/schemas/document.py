from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from enum import Enum

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema

class DocumentType(str, Enum):
    pdf = "pdf"
    docx = "docx"
    txt = "txt"
    markdown = "markdown"
    html = "html"
    json = "json"
    csv = "csv"
    excel = "excel"
    image = "image"
    audio = "audio"
    video = "video"
    other = "other"

class DocumentBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["My Document"])]
    file_path: Annotated[str, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"])]
    file_type: Annotated[DocumentType, Field(examples=["pdf"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)] = None

class Document(TimestampSchema, DocumentBase, UUIDSchema, PersistentDeletion):
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class DocumentCreateInternal(DocumentBase):
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class DocumentUpdateInternal(BaseModel):
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Document"], default=None)] = None
    file_path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"], default=None)] = None
    file_type: Annotated[DocumentType | None, Field(examples=["pdf"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)] = None
    project_id: int | None = None
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None
 

class DocumentDeleteInternal(BaseModel):
    is_deleted: bool

class DocumentReadInternal(Document):
    pass

class DocumentRead(BaseModel):
    uuid: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["My Document"])]
    file_path: Annotated[str, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"])]
    file_type: Annotated[DocumentType, Field(examples=["pdf"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)] = None
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None


class DocumentCreate(DocumentBase):
    model_config = ConfigDict(extra="forbid")
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class DocumentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Document"], default=None)] = None
    file_path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"], default=None)] = None
    file_type: Annotated[DocumentType | None, Field(examples=["pdf"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)] = None
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class AdminDocumentRead(Document):
    pass

class AdminDocumentCreate(DocumentBase):
    project_id: int
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class AdminDocumentUpdate(BaseModel):
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Document"], default=None)] = None
    file_path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/path/to/document.pdf"], default=None)] = None
    file_type: Annotated[DocumentType | None, Field(examples=["pdf"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the document"], default=None)] = None
    project_id: int | None = None
    file_size: int | None = None
    page_count: int | None = None
    meta_info: dict | None = None

class AdminDocumentDelete(BaseModel):
    is_deleted: bool


class DocumentRestoreDeleted(BaseModel):
    is_deleted: bool

class DocumentDelete(BaseModel):
    is_deleted: bool

