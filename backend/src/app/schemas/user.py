from datetime import datetime
from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from ..core.schemas import PersistentDeletion, TimestampSchema, UUIDSchema

class UserBase(BaseModel):
    username: Annotated[str, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userson"])]
    email: Annotated[EmailStr, Field(examples=["user@example.com"])]
    profile_image_url: str | None = None

class User(TimestampSchema, UserBase, UUIDSchema, PersistentDeletion):
    id: int
    hashed_password: str
    is_superuser: bool = False
    is_active: bool = False
    last_login: datetime | None = None
    tier_id: int | None = None

class UserCreateInternal(UserBase):
    hashed_password: str
    is_superuser: bool = False
    is_active: bool = False
    last_login: datetime | None = None
    tier_id: int | None = None

class UserUpdateInternal(BaseModel):
    username: Annotated[str | None, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userson"], default=None)] = None
    email: Annotated[EmailStr | None, Field(examples=["user@example.com"], default=None)] = None
    profile_image_url: str | None = None
    hashed_password: str | None = None
    is_superuser: bool | None = None
    is_active: bool | None = None
    last_login: datetime | None = None
    tier_id: int | None = None

class UserDeleteInternal(BaseModel):
    is_deleted: bool

class UserReadInternal(User):
    pass

class UserRead(BaseModel):
    uuid: UUID | None = None
    username: Annotated[str, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userberg"])]
    email: Annotated[EmailStr, Field(examples=["user@example.com"])]
    profile_image_url: str | None = None
    tier_id: int | None = None

class UserCreate(UserBase):
    model_config = ConfigDict(extra="forbid")
    password: Annotated[str, Field(pattern=r"^.{8,}|[0-9]+|[A-Z]+|[a-z]+|[^a-zA-Z0-9]+$", examples=["Str1ngst!"])]

class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    username: Annotated[str | None, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userberg"], default=None)] = None
    email: Annotated[EmailStr | None, Field(examples=["userg@example.com"], default=None)] = None
    profile_image_url: str | None = None


class AdminUserRead(User):
    pass

class AdminUserCreate(UserBase):
    password: Annotated[str, Field(pattern=r"^.{8,}|[0-9]+|[A-Z]+|[a-z]+|[^a-zA-Z0-9]+$", examples=["Str1ngst!"])]
    is_superuser: bool = False
    is_active: bool = False
    tier_id: int | None = 1

class AdminUserUpdate(BaseModel):
    username: Annotated[str | None, Field(min_length=2, max_length=20, pattern=r"^[a-z0-9]+$", examples=["userson"])]= None
    email: Annotated[EmailStr | None, Field(examples=["user@example.com"])]= None
    profile_image_url: str | None = None
    password: Annotated[str | None, Field(pattern=r"^.{8,}|[0-9]+|[A-Z]+|[a-z]+|[^a-zA-Z0-9]+$", examples=["Str1ngst!"], default=None)] = None
    is_superuser: bool | None = None
    is_active: bool | None = None
    tier_id: int | None = None

class AdminUserDelete(BaseModel):
    is_deleted: bool

class UserTierUpdate(BaseModel):
    tier_id: int

class UserRestoreDeleted(BaseModel):
    is_deleted: bool
