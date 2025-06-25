from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema

class ProjectBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=255, examples=["My Project"])]
    description: Annotated[str, Field(examples=["A detailed description of the project"])]


class Project(TimestampSchema, ProjectBase, UUIDSchema, PersistentDeletion):
    id: int
    user_id: int

class ProjectCreateInternal(ProjectBase):
    user_id: int

class ProjectUpdateInternal(BaseModel):
    name: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Project"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the project"], default=None)] = None
    user_id: int | None = None


class ProjectDeleteInternal(BaseModel):
    is_deleted: bool


class ProjectReadInternal(Project):
    pass

class ProjectRead(BaseModel):
    uuid: UUID | None = None
    name: Annotated[str, Field(min_length=1, max_length=255, examples=["My Project"])]
    description: Annotated[str, Field(examples=["A detailed description of the project"])]

class ProjectCreate(ProjectBase):
    model_config = ConfigDict(extra="forbid")
    

class ProjectUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Project"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the project"], default=None)] = None

class AdminProjectRead(Project):
    pass

class AdminProjectCreate(ProjectBase):
    user_id: int

class AdminProjectUpdate(BaseModel):
    name: Annotated[str | None, Field(min_length=1, max_length=255, examples=["My Project"], default=None)] = None
    description: Annotated[str | None, Field(examples=["A detailed description of the project"], default=None)] = None
    user_id: int | None = None

class AdminProjectDelete(BaseModel):
    is_deleted: bool

class ProjectRestoreDeleted(BaseModel):
    is_deleted: bool

class ProjectDelete(BaseModel):
    is_deleted: bool

