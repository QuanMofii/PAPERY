from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy import select, update , delete, asc, desc,column,text
from sqlalchemy.orm import load_only
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]) -> None:
        self._model = model

    async def create(
        self, 
        session: AsyncSession, 
        obj_in: CreateSchemaType
    ) -> ModelType:
        obj_in_data = dict(obj_in)
        db_obj = self._model(**obj_in_data)
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def get(
        self, 
        session: AsyncSession, 
        return_columns: List[Any] = None,
        *args, 
        **kwargs
    ) -> Optional[ModelType]:
        query = select(self._model).filter(*args).filter_by(**kwargs)
        if return_columns:
            model_columns = [getattr(self._model, column) for column in return_columns]
            query = query.options(load_only(*model_columns))
        result = await session.execute(query)
        return result.scalars().first()
    async def get_multi(
        self,
        session: AsyncSession,
        return_columns: List[Any] = None,
        *args,
        offset: int = 0,
        limit: int = 100,
        order_by=None,
        order_direction: str = "desc",
        **kwargs,
    ) -> List[ModelType]:
  
        query = select(self._model).filter(*args).filter_by(**kwargs)
        
        if return_columns:
            model_columns = [getattr(self._model, column) for column in return_columns]
            query = query.options(load_only(*model_columns))
            
        if order_by:
            if order_direction == "desc":
                query = query.order_by(desc(order_by))
            elif order_direction == "asc":
                query = query.order_by(asc(order_by))
        query = query.offset(offset).limit(limit)
        
        result = await session.execute(query)

        return result.scalars().all()

    async def update(
        self,
        session: AsyncSession,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
        return_columns: List[Any] = None,
        *args,
        **kwargs
    ) -> Optional[ModelType]:
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True, exclude_none=True)
        query = update(self._model).filter(*args).filter_by(**kwargs).values(**update_data)
        #if you use postgres, you can use .returning(self._model):
        # .returning(self._model)
        # result = await session.execute(query)
        # return result
        await session.execute(query)
        await session.commit()
        return await self.get(session,return_columns=return_columns,*args, **kwargs)

    async def delete(
        self,
        session: AsyncSession,
        *args,
        **kwargs
    ) -> int:
        query = delete(self._model).filter(*args).filter_by(**kwargs)
        result = await session.execute(query)
        await session.commit()
        
        if result.rowcount == 0:
            return False
        return True
