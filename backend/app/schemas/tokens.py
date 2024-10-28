from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from .users import User

# Token Schemas
class TokenBase(BaseModel):
    refresh_token: Optional[str] = None
    exp: Optional[datetime] = None

class TokenCreate(TokenBase):
    user_id: int = Field(..., gt=0)

class TokenUpdate(TokenBase):
    pass

class TokenInDB(TokenBase):
    id: Optional[int] = None
    user_id: int

    class Config:
          from_attributes=True

class Token(TokenInDB):
    owner: Optional[User] = None

    class Config:
          from_attributes=True


class TokenLogin(BaseModel):
    token_type: Literal["bearer"]
    refresh_token: Optional[str] = None
    access_token: Optional[str] = None

class AccessTokenPayload(BaseModel):
    user_id: Optional[int] = None
    exp: Optional[datetime] = None
