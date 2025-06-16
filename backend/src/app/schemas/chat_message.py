from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema
from ..models.chat_message import Role


class ChatMessageBase(BaseModel):
    content: Annotated[str, Field(examples=["what is the capital of France?"])]
    role: Annotated[Role, Field(examples=["user"])]
    sequence_number: Annotated[int, Field(examples=[1])]
    model_name: Annotated[str, Field(min_length=1, max_length=50, examples=["gpt-4"])]


class ChatMessage(TimestampSchema, ChatMessageBase, UUIDSchema, PersistentDeletion):
    chat_session_id: int
    token_count: int = 0


class ChatMessageRead(BaseModel):
    id: int
    content: Annotated[str, Field(examples=["what is the capital of France?"])]
    role: Annotated[Role, Field(examples=["user"])]
    sequence_number: Annotated[int, Field(examples=[1])]
    model_name: Annotated[str, Field(min_length=1, max_length=50, examples=["gpt-4"])]
    chat_session_id: int
    token_count: int
    created_at: datetime
    updated_at: datetime


class ChatMessageCreate(ChatMessageBase):
    model_config = ConfigDict(extra="forbid")
    
    token_count: int = 0


class ChatMessageCreateInternal(ChatMessageBase):
    chat_session_id: int
    token_count: int = 0


class ChatMessageUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    content: Annotated[str | None, Field(examples=["what is the capital of France?"], default=None)]
    role: Annotated[Role | None, Field(examples=["user"], default=None)]
    sequence_number: Annotated[int | None, Field(examples=[1], default=None)]
    model_name: Annotated[str | None, Field(min_length=1, max_length=50, examples=["gpt-4"], default=None)]
    token_count: int | None = None


class ChatMessageUpdateInternal(ChatMessageUpdate):
    updated_at: datetime


class ChatMessageDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime


class ChatMessageRestoreDeleted(BaseModel):
    is_deleted: bool
