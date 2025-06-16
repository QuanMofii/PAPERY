from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema


class ProjectBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=255, examples=["My Project"])]
    description: Annotated[str, Field(examples=["A detailed description of the project"])]


class Project(TimestampSchema, ProjectBase, UUIDSchema, PersistentDeletion):
    user_id: int


class ProjectRead(BaseModel):
    id: int
    name: Annotated[str, Field(min_length=1, max_length=255, examples=["My Project"])]
    description: Annotated[str, Field(examples=["A detailed description of the project"])]


class ProjectCreate(ProjectBase):
    model_config = ConfigDict(extra="forbid")
    


class ProjectCreateInternal(ProjectBase):
    user_id: int



class ProjectUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Project"], default=None)]
    description: Annotated[str | None, Field(examples=["A detailed description of the project"], default=None)]



class ProjectUpdateInternal(ProjectUpdate):
    updated_at: datetime


class ProjectDelete(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_deleted: bool
    deleted_at: datetime


class ProjectRestoreDeleted(BaseModel):
    is_deleted: bool
