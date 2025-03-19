from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .user import UserBase, UserRead


class Token(BaseModel):
  
    access_token: str
    refresh_token: str
    token_type: str


class AuthUserCreate(UserBase):
  
    model_config = ConfigDict(extra="forbid")
    
    password: Annotated[str, Field(
        pattern=r"^.{8,}|[0-9]+|[A-Z]+|[a-z]+|[^a-zA-Z0-9]+$", 
        examples=["Str1ngst!"]
    )]


class AuthUserCreateInternal(UserBase):
    hashed_password: str
    is_superuser: bool = False
    is_active: bool = False
    last_login: datetime | None = None


class PasswordReset(BaseModel):
    email: EmailStr
    token: str
    new_password: Annotated[str, Field(
        pattern=r"^.{8,}|[0-9]+|[A-Z]+|[a-z]+|[^a-zA-Z0-9]+$",
        examples=["NewStr1ngst!"]
    )]


class PasswordResetRequest(BaseModel):
    email: EmailStr


class EmailVerification(BaseModel):

    email: EmailStr
    token: str


class AuthUserRead(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    last_login: datetime | None
    profile_image_url: str


class RefreshToken(BaseModel):
    refresh_token: str

