from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema
from ..models.chat_message import Role


class ChatMessageBase(BaseModel):
    content: Annotated[str, Field(examples=["what is the capital of France?"])]
    role: Annotated[Role, Field(examples=["user"])]
    model_name: Annotated[str, Field(min_length=1, max_length=50, examples=["gpt-4"])]


class ChatMessage(TimestampSchema, ChatMessageBase, UUIDSchema, PersistentDeletion):
    chat_session_id: int
    sequence_number: int
    token_count: int = 0


class ChatMessageCreateInternal(ChatMessageBase):
    chat_session_id: int
    token_count: int = 0

class ChatMessageUpdateInternal(BaseModel):
    content: Annotated[str | None, Field(examples=["what is the capital of France?"], default=None)] = None
    role: Annotated[Role | None, Field(examples=["user"], default=None)] = None
    model_name: Annotated[str | None, Field(min_length=1, max_length=50, examples=["gpt-4"], default=None)] = None
    chat_session_id: int | None = None
    token_count: int | None = None
  

class ChatMessageDeleteInternal(BaseModel):
    is_deleted: bool

class ChatMessageReadInternal(ChatMessage):
    pass


class ChatMessageRead(BaseModel):
 
    uuid: UUID | None = None
    content: Annotated[str, Field(examples=["what is the capital of France?"])]
    role: Annotated[Role, Field(examples=["user"])]
    sequence_number: int
    model_name: Annotated[str, Field(min_length=1, max_length=50, examples=["gpt-4"])]
    chat_session_id: int
    token_count: int


class ChatMessageCreate(ChatMessageBase):
    model_config = ConfigDict(extra="forbid")
    token_count: int = 0

class ChatMessageUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    content: Annotated[str | None, Field(examples=["what is the capital of France?"], default=None)] = None
    role: Annotated[Role | None, Field(examples=["user"], default=None)] = None
    model_name: Annotated[str | None, Field(min_length=1, max_length=50, examples=["gpt-4"], default=None)] = None
    token_count: int | None = None


class AdminChatMessageRead(ChatMessage):
    pass

class AdminChatMessageCreate(ChatMessageBase):
    chat_session_id: int
    token_count: int = 0

class AdminChatMessageUpdate(BaseModel):
    content: Annotated[str | None, Field(examples=["what is the capital of France?"], default=None)] = None
    role: Annotated[Role | None, Field(examples=["user"], default=None)] = None
    model_name: Annotated[str | None, Field(min_length=1, max_length=50, examples=["gpt-4"], default=None)] = None
    chat_session_id: int | None = None
    token_count: int | None = None

class AdminChatMessageDelete(BaseModel):
    is_deleted: bool


class ChatMessageRestoreDeleted(BaseModel):
    is_deleted: bool

class ChatMessageDelete(BaseModel):
    is_deleted: bool

