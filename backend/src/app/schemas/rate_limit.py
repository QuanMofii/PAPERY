from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema
def sanitize_path(path: str) -> str:
    return path.strip("/").replace("/", "_")
class RateLimitBase(BaseModel):
    tier_id: int
    name: Annotated[str, Field(min_length=1, max_length=100, examples=["API Rate Limit", "Chat Rate Limit"])]
    path: Annotated[str, Field(min_length=1, max_length=255, examples=["/api/v1/chat", "/api/v1/projects"])]
    limit: Annotated[int, Field(gt=0, examples=[100, 1000])]
    period: Annotated[int, Field(gt=0, examples=[60, 3600])]  # in seconds

class RateLimit(TimestampSchema, RateLimitBase, UUIDSchema, PersistentDeletion):
    id: int

class RateLimitCreateInternal(RateLimitBase):
    pass

class RateLimitUpdateInternal(BaseModel):
    tier_id: int | None = None
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["API Rate Limit", "Chat Rate Limit"], default=None)] = None
    path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/api/v1/chat", "/api/v1/projects"], default=None)] = None
    limit: Annotated[int | None, Field(gt=0, examples=[100, 1000], default=None)] = None
    period: Annotated[int | None, Field(gt=0, examples=[60, 3600], default=None)] = None  # in seconds

class RateLimitDeleteInternal(BaseModel):
    is_deleted: bool

class RateLimitReadInternal(RateLimit):
    pass

class RateLimitRead(BaseModel):
    uuid: UUID | None = None
    tier_id: int
    name: Annotated[str, Field(min_length=1, max_length=100, examples=["API Rate Limit", "Chat Rate Limit"])]
    path: Annotated[str, Field(min_length=1, max_length=255, examples=["/api/v1/chat", "/api/v1/projects"])]
    limit: Annotated[int, Field(gt=0, examples=[100, 1000])]
    period: Annotated[int, Field(gt=0, examples=[60, 3600])]  # in seconds

class RateLimitCreate(RateLimitBase):
    model_config = ConfigDict(extra="forbid")

class RateLimitUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["API Rate Limit", "Chat Rate Limit"], default=None)] = None
    path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/api/v1/chat", "/api/v1/projects"], default=None)] = None
    limit: Annotated[int | None, Field(gt=0, examples=[100, 1000], default=None)] = None
    period: Annotated[int | None, Field(gt=0, examples=[60, 3600], default=None)] = None  # in seconds

class AdminRateLimitRead(RateLimit):
    pass

class AdminRateLimitCreate(RateLimitBase):
    pass

class AdminRateLimitUpdate(BaseModel):
    tier_id: int | None = None
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["API Rate Limit", "Chat Rate Limit"], default=None)] = None
    path: Annotated[str | None, Field(min_length=1, max_length=255, examples=["/api/v1/chat", "/api/v1/projects"], default=None)] = None
    limit: Annotated[int | None, Field(gt=0, examples=[100, 1000], default=None)] = None
    period: Annotated[int | None, Field(gt=0, examples=[60, 3600], default=None)] = None  # in seconds

class AdminRateLimitDelete(BaseModel):
    is_deleted: bool

class RateLimitRestoreDeleted(BaseModel):
    is_deleted: bool

