# from typing import Generic, TypeVar, List
# from pydantic import BaseModel, Field

# DataType = TypeVar('DataType')

# class APIResponse(BaseModel, Generic[DataType]):
#     message: str = Field(..., examples=["Resource processed successfully"])
#     data: DataType | None = None

# class PaginatedAPIResponse(APIResponse[List[DataType]]):
#     total_count: int
#     has_more: bool
#     page: int
#     items_per_page: int 

from typing import Generic, TypeVar
from pydantic import Field
from pydantic.generics import GenericModel

T = TypeVar('T')

class APIResponse(GenericModel, Generic[T]):
    message: str = Field(..., examples=["Resource processed successfully"])
    data: T | None = None

class PaginatedAPIResponse(GenericModel, Generic[T]):
    message: str = Field(..., examples=["Resources retrieved successfully"])
    data: list[T]
    total_count: int
    has_more: bool
    page: int
    items_per_page: int
