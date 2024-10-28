

from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class VerifyBase(BaseModel):
    code_active: Optional[str] = Field(None, min_length=1)
    exp_active: Optional[datetime] = None
    code_recovery: Optional[str] = Field(None, min_length=1)
    exp_recovery: Optional[datetime] = None

class VerifyCreate(VerifyBase):
    user_id: int = Field(..., gt=0)

class VerifyUpdate(VerifyBase):
    pass

class VerifyInDB(VerifyBase):
    id: Optional[int] = None
    user_id: int

    class Config:
         from_attributes=True

class Verify(VerifyInDB):
    pass

class ActivateCodeBase(BaseModel):
    code_active: Optional[str] = Field(None, min_length=1)
    exp_active: Optional[datetime] = None

class ActivateCodeCreate(ActivateCodeBase):
    user_id: int = Field(..., gt=0)

class ActivateCodeUpdate(ActivateCodeBase):
    pass

class ActivateCodeInDB(ActivateCodeBase):
    id: Optional[int] = None
    user_id: int

    class Config:
         from_attributes=True

class ActivateCode(ActivateCodeInDB):
    pass

# RecoveryCode Schemas
class RecoveryCodeBase(BaseModel):
    code_recovery: Optional[str] = Field(None, min_length=1)
    exp_recovery: Optional[datetime] = None

class RecoveryCodeCreate(RecoveryCodeBase):
    user_id: int = Field(..., gt=0)

class RecoveryCodeUpdate(RecoveryCodeBase):
    pass

class RecoveryCodeInDB(RecoveryCodeBase):
    id: Optional[int] = None
    user_id: int

    class Config:
         from_attributes=True

class RecoveryCode(RecoveryCodeInDB):
    pass