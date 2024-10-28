from typing import Optional
from pydantic import BaseModel, Field

# Item Schemas
class ItemBase(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None

class ItemCreate(ItemBase):
    owner_id: int = Field(..., gt=0)

class ItemUpdate(ItemBase):
    pass

class ItemInDB(ItemBase):
    id: Optional[int] = None
    owner_id: int = Field(..., gt=0)

    class Config:
        from_attributes=True

class ItemUpdateInDB(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None

    class Config:
        from_attributes=True

class Item(ItemInDB):
    pass
