from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, delete, select, func, asc, desc
from sqlalchemy.orm import joinedload, selectinload,aliased
from sqlalchemy.sql.expression import or_, and_
from typing import Callable, Type, Generic, TypeVar, List, Any, Dict, Optional, Tuple
import operator
from pydantic import BaseModel

Entity = TypeVar('Entity')
T = TypeVar('T',bound=BaseModel) 

class BaseRepository(Generic[Entity, T]):
    def __init__(self,  entity_type: Type[Entity], schema_type: Type[T]):
        self.entity_type = entity_type
        self.schema_type = schema_type

    async def get(self, session: AsyncSession,  filters: Optional[Dict[str, Any]] = None,
                  columns: Optional[List[str]] = None,
                  order_by: Optional[List[str]] = None,
                  joins: Optional[List[Tuple[str, str]]] = None) -> Optional[T]:
        if columns:
            entity_alias = aliased(self.entity_type)
            query = select([getattr(entity_alias, col) for col in columns])
        else:
            query = select(self.entity_type)
            
        if joins:
            for join_type, onclause in joins:
                if join_type.lower() == 'joined':
                    query = query.options(joinedload(onclause))
                elif join_type.lower() == 'select':
                    query = query.options(selectinload(onclause))
        for key, value in (filters or {}).items():
            field, op = self._parse_field_operator(key)
            query = query.where(op(getattr(self.entity_type, field), value))
        if order_by:
            for field in order_by:
                desc_indicator = '-' if field.startswith('-') else ''
                field_clean = field.lstrip('-+')
                query = query.order_by(desc(getattr(self.entity_type, field_clean)) if desc_indicator else asc(getattr(self.entity_type, field_clean)))
        result = await session.execute(query)
        entity = result.scalars().first()
        return self.schema_type.model_validate(entity) if entity else None
        # return  result.scalars().first()
    async def get_all(self,session: AsyncSession, filters: Optional[Dict[str, Any]] = None,
                      columns: Optional[List[str]] = None,
                      order_by: Optional[List[str]] = None,
                      group_by: Optional[List[str]] = None,
                      having: Optional[Dict[str, Any]] = None,
                      joins: Optional[List[Tuple[str, str]]] = None,
                      limit: Optional[int] = None,
                      offset: Optional[int] = None) -> List[T]:
        if columns:
            entity_alias = aliased(self.entity_type)
            query = select([getattr(entity_alias, col) for col in columns])
        else:
            query = select(self.entity_type)
        if joins:
            for join_type, onclause in joins:
                if join_type.lower() == 'joined':
                    query = query.options(joinedload(onclause))
                elif join_type.lower() == 'select':
                    query = query.options(selectinload(onclause))
        for key, value in (filters or {}).items():
            field, op = self._parse_field_operator(key)
            query = query.where(op(getattr(self.entity_type, field), value))
        if group_by:
            query = query.group_by(*[getattr(self.entity_type, gb) for gb in group_by])
        if having:
            for condition, value in having.items():
                query = query.having(func.count(getattr(self.entity_type, condition)) > value)
        if order_by:
            for field in order_by:
                desc_indicator = '-' if field.startswith('-') else ''
                field_clean = field.lstrip('-+')
                query = query.order_by(desc(getattr(self.entity_type, field_clean)) if desc_indicator else asc(getattr(self.entity_type, field_clean)))
        if limit:
            query = query.limit(limit)
        if offset:
            query = query.offset(offset)
        result = await session.execute(query)
        return result.scalars().all()

    async def create(self,session: AsyncSession,data: Dict[str, Any], return_columns: Optional[List[str]] = None) -> T:
        entity = self.entity_type(**data)
        session.add(entity)
        await session.commit()
        if return_columns:
            return await self.get(filters={'id': entity.id}, columns=return_columns)
        await session.refresh(entity)
        return entity

    async def update(self,session: AsyncSession, filters: Dict[str, Any], data: Dict[str, Any], return_columns: Optional[List[str]] = None) -> Optional[T]:
        query = update(self.entity_type).where(
            *[getattr(self.entity_type, key) == value for key, value in filters.items()]
        ).values(**data)
        await session.execute(query)
        await session.commit()
        if return_columns:
            return await self.get(filters=filters, columns=return_columns)
        return None

    async def delete(self,session: AsyncSession, filters: Dict[str, Any], return_deleted: bool = False) -> Optional[T]:
        entity = await self.get(filters=filters) if return_deleted else None
        query = delete(self.entity_type).where(
            *[getattr(self.entity_type, key) == value for key, value in filters.items()]
        )
        await session.execute(query)
        await session.commit()
        return entity if return_deleted else None

    def _parse_field_operator(self, key: str) -> Tuple[str, Callable]:
        if '__' in key:
            field, op_name = key.split('__', 1)
            op = {
                'eq': operator.eq,
                'ne': operator.ne,
                'lt': operator.lt,
                'gt': operator.gt,
                'le': operator.le,
                'ge': operator.ge,
                
            }.get(op_name, operator.eq)
            return field, op
        return key, operator.eq
