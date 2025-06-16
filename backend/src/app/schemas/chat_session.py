from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema


class ChatSessionBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["New Chat Session"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the chat session"], default=None)]


class ChatSession(TimestampSchema, ChatSessionBase, UUIDSchema, PersistentDeletion):
    project_id: int
    settings: dict | None = None


class ChatSessionRead(BaseModel):
    id: int
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["New Chat Session"])]
    description: Annotated[str | None, Field(examples=["A detailed description of the chat session"], default=None)]
    project_id: int
    settings: dict | None = None
    created_at: datetime
    updated_at: datetime


class ChatSessionCreate(ChatSessionBase):
    model_config = ConfigDict(extra="forbid")
    
    settings: dict | None = None


class ChatSessionCreateInternal(ChatSessionBase):
    project_id: int
    settings: dict | None = None


class ChatSessionUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["New Chat Session"], default=None)]
    description: Annotated[str | None, Field(examples=["A detailed description of the chat session"], default=None)]
    settings: dict | None = None


class ChatSessionUpdateInternal(ChatSessionUpdate):
    updated_at: datetime


class ChatSessionDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime


class ChatSessionRestoreDeleted(BaseModel):
    is_deleted: bool
