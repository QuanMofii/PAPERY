from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema

class ChatSessionBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["New Chat Session"])]

class ChatSession(TimestampSchema, ChatSessionBase, UUIDSchema, PersistentDeletion):
    project_id: int

class ChatSessionCreateInternal(ChatSessionBase):
    project_id: int

class ChatSessionUpdateInternal(BaseModel):
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["New Chat Session"], default=None)] = None
    project_id: int | None = None


class ChatSessionDeleteInternal(BaseModel):
    is_deleted: bool
 

class ChatSessionReadInternal(ChatSession):
    pass


class ChatSessionRead(BaseModel):
 
    uuid: UUID | None = None
    title: Annotated[str, Field(min_length=1, max_length=255, examples=["New Chat Session"])]
    project_id: int


class ChatSessionCreate(ChatSessionBase):
    model_config = ConfigDict(extra="forbid")

class ChatSessionUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["New Chat Session"], default=None)] = None

class AdminChatSessionRead(ChatSession):
    pass

class AdminChatSessionCreate(ChatSessionBase):
    project_id: int

class AdminChatSessionUpdate(BaseModel):
    title: Annotated[str | None, Field(min_length=1, max_length=255, examples=["New Chat Session"], default=None)] = None
    project_id: int | None = None

class AdminChatSessionDelete(BaseModel):
    is_deleted: bool

class ChatSessionRestoreDeleted(BaseModel):
    is_deleted: bool

class ChatSessionDelete(BaseModel):
    is_deleted: bool


