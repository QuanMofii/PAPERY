from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema

class TierBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100, examples=["Free", "Premium", "Enterprise"])]

class Tier(TimestampSchema, TierBase, UUIDSchema, PersistentDeletion):
    id: int

class TierCreateInternal(TierBase):
    pass

class TierUpdateInternal(BaseModel):
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["Free", "Premium", "Enterprise"], default=None)] = None

class TierDeleteInternal(BaseModel):
    is_deleted: bool

class TierReadInternal(Tier):
    pass

class TierRead(BaseModel):
    uuid: UUID | None = None
    name: Annotated[str, Field(min_length=1, max_length=100, examples=["Free", "Premium", "Enterprise"])]

class TierCreate(TierBase):
    model_config = ConfigDict(extra="forbid")

class TierUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["Free", "Premium", "Enterprise"], default=None)] = None

class AdminTierRead(Tier):
    pass

class AdminTierCreate(TierBase):
    pass

class AdminTierUpdate(BaseModel):
    name: Annotated[str | None, Field(min_length=1, max_length=100, examples=["Free", "Premium", "Enterprise"], default=None)] = None

class AdminTierDelete(BaseModel):
    is_deleted: bool

class TierRestoreDeleted(BaseModel):
    is_deleted: bool
