from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from ..core.schemas import TimestampSchema, PersistentDeletion, UUIDSchema
from ..models.access_control import ResourceType, PermissionType

class AccessControlBase(BaseModel):
    user_id: int
    resource_id: int
    resource_uuid: UUID
    resource_type: ResourceType
    permission: PermissionType

class AccessControl(TimestampSchema, AccessControlBase, UUIDSchema, PersistentDeletion):
    id: int

class AccessControlCreateInternal(AccessControlBase):
    pass

class AccessControlUpdateInternal(BaseModel):
    user_id: int | None = None
    resource_id: int | None = None
    resource_uuid: UUID | None = None
    resource_type: ResourceType | None = None
    permission: PermissionType | None = None

class AccessControlDeleteInternal(BaseModel):
    is_deleted: bool

class AccessControlReadInternal(AccessControl):
    pass

class AccessControlRead(BaseModel):
    uuid: UUID | None = None
    user_id: int
    resource_id: int
    resource_uuid: UUID
    resource_type: ResourceType
    permission: PermissionType

class AccessControlCreate(AccessControlBase):
    model_config = ConfigDict(extra="forbid")

class AccessControlUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    user_id: int | None = None
    resource_id: int | None = None
    resource_uuid: UUID | None = None
    resource_type: ResourceType | None = None
    permission: PermissionType | None = None

class AdminAccessControlRead(AccessControl):
    pass

class AdminAccessControlCreate(AccessControlBase):
    pass

class AdminAccessControlUpdate(BaseModel):
    user_id: int | None = None
    resource_id: int | None = None
    resource_uuid: UUID | None = None
    resource_type: ResourceType | None = None
    permission: PermissionType | None = None

class AdminAccessControlDelete(BaseModel):
    is_deleted: bool

class AccessControlRestoreDeleted(BaseModel):
    is_deleted: bool

class AccessControlID(BaseModel):
    resource_id: int

