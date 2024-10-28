from typing import Optional
from pydantic import BaseModel, EmailStr, Field 
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = Field(None, min_length=9, max_length=50)
    full_name: Optional[str] = Field(None, min_length=3, max_length=50)
    image: Optional[str] = None
    role: Optional[str] = Field("user", min_length=1)
    is_active: Optional[bool] = None

class UserCreate(UserBase):
    full_name:str = Field(min_length=3)
    email: EmailStr
    password: str = Field( min_length=6)

class UserOAuth2Create(BaseModel):
    full_name: Optional[str]
    email: EmailStr
    image: Optional[str]
    account_type: str
    is_active: bool = True

class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=6)


class UserInDB(UserBase):
    id: Optional[int] = None
    hashed_password: str
    account_type: Optional[str] = "local"
    is_active: Optional[bool] = False
    

    class Config:
        from_attributes=True

class UserUpdateInDB(BaseModel):
    full_name: Optional[str] = Field(None, min_length=3)
    hashed_password: Optional[str] = None
    is_active: Optional[bool] = None

    class Config:
        from_attributes=True

class User(UserInDB):
    pass

class UserMe(UserBase):
    pass

class UserActivate(BaseModel):
    is_active: Optional[bool] = None