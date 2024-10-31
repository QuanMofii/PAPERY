from typing import Type, List, Optional, Any, Dict, TypeVar, Generic, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete, func, or_, and_, asc, desc
from sqlalchemy.sql.expression import Select
from sqlalchemy.orm import selectinload, joinedload
from pydantic import BaseModel
from enum import Enum
from dataclasses import dataclass

T = TypeVar('T', bound=BaseModel)
Entity = TypeVar('Entity')

class QueryOperator(str, Enum):
    EQ = "eq"  # Equal (default)
    NEQ = "neq"  # Not Equal
    GT = "gt"  # Greater Than
    LT = "lt"  # Less Than
    GTE = "gte"  # Greater Than or Equal
    LTE = "lte"  # Less Than or Equal
    LIKE = "like"  # LIKE
    ILIKE = "ilike"  # Case-insensitive LIKE
    IN = "in"  # IN
    NOT_IN = "not_in"  # NOT IN
    BETWEEN = "between"  # BETWEEN
    IS_NULL = "is_null"  # IS NULL
    IS_NOT_NULL = "is_not_null"  # IS NOT NULL

@dataclass
class QueryConfig:
    # Filtering: {"age": 18} or {"age": {"gte": 18}} or {"status": {"in": ["active", "pending"]}}
    filters: Optional[Dict[str, Any]] = None  # AND conditions
    or_filters: Optional[Dict[str, Any]] = None  # OR conditions
    
    # Sorting: {"desc": ["created_at", "id"]} or {"asc": "name"} or {"asc": ["name"], "desc": ["age"]}
    sort: Optional[Dict[str, Union[str, List[str]]]] = None
    
    # Joins: {"users": "User.id == Post.user_id"}
    joins: Optional[Dict[str, str]] = None
    
    # Fields to load: ["posts.comments", "profile"] or "profile"
    fields: Optional[Union[List[str], str]] = None
    
    # Group by: ["status", "role"]
    group_by: Optional[Union[List[str], str]] = None
    
    # Having: Same format as filters
    having: Optional[Dict[str, Any]] = None
    
    limit: Optional[int] = 100
    offset: Optional[int] = 0
    return_data: bool = True
    load_relations: bool = False

    def __post_init__(self):
        # Convert single string to list where needed
        if isinstance(self.fields, str):
            self.fields = [self.fields]
        if isinstance(self.group_by, str):
            self.group_by = [self.group_by]
        
        # Normalize sort config
        if self.sort:
            normalized_sort = {}
            for direction, fields in self.sort.items():
                if isinstance(fields, str):
                    normalized_sort[direction] = [fields]
                else:
                    normalized_sort[direction] = fields
            self.sort = normalized_sort

class BaseRepository(Generic[T, Entity]):
    def __init__(self, session: AsyncSession, entity_type: Type[Entity], schema_type: Type[T]):
        self.session = session
        self.entity_type = entity_type
        self.schema_type = schema_type

    def _parse_filter_value(self, value: Any) -> tuple[QueryOperator, Any]:
        """Parse filter value to get operator and actual value"""
        if isinstance(value, dict) and len(value) == 1:
            operator = next(iter(value.keys()))
            if operator in QueryOperator.__members__:
                return QueryOperator(operator), value[operator]
        return QueryOperator.EQ, value

    def _apply_operator(self, column: Any, operator: QueryOperator, value: Any) -> Any:
        """Apply different SQL operators based on the operator type"""
        operator_map = {
            QueryOperator.EQ: lambda col, val: col == val,
            QueryOperator.NEQ: lambda col, val: col != val,
            QueryOperator.GT: lambda col, val: col > val,
            QueryOperator.LT: lambda col, val: col < val,
            QueryOperator.GTE: lambda col, val: col >= val,
            QueryOperator.LTE: lambda col, val: col <= val,
            QueryOperator.LIKE: lambda col, val: col.like(f"%{val}%"),
            QueryOperator.ILIKE: lambda col, val: col.ilike(f"%{val}%"),
            QueryOperator.IN: lambda col, val: col.in_(val),
            QueryOperator.NOT_IN: lambda col, val: ~col.in_(val),
            QueryOperator.BETWEEN: lambda col, val: col.between(*val),
            QueryOperator.IS_NULL: lambda col, val: col.is_(None),
            QueryOperator.IS_NOT_NULL: lambda col, val: col.isnot(None),
        }
        return operator_map[operator](column, value)

    def _build_query(self, base_query: Optional[Select] = None, config: Optional[QueryConfig] = None) -> Select:
        """Build query based on simplified QueryConfig"""
        if config is None:
            config = QueryConfig()

        query = base_query if base_query is not None else select(self.entity_type)

        # Apply joins
        if config.joins:
            for table, condition in config.joins.items():
                query = query.join(table, condition)

        # Apply AND filters
        if config.filters:
            and_conditions = []
            for field, value in config.filters.items():
                operator, actual_value = self._parse_filter_value(value)
                column = getattr(self.entity_type, field)
                and_conditions.append(self._apply_operator(column, operator, actual_value))
            if and_conditions:
                query = query.where(and_(*and_conditions))

        # Apply OR filters
        if config.or_filters:
            or_conditions = []
            for field, value in config.or_filters.items():
                operator, actual_value = self._parse_filter_value(value)
                column = getattr(self.entity_type, field)
                or_conditions.append(self._apply_operator(column, operator, actual_value))
            if or_conditions:
                query = query.where(or_(*or_conditions))

        # Apply sorting
        if config.sort:
            for direction, fields in config.sort.items():
                for field in fields:
                    column = getattr(self.entity_type, field)
                    query = query.order_by(desc(column) if direction == "desc" else asc(column))

        # Apply field loading
        if config.fields and config.load_relations:
            for field in config.fields:
                if "." in field:
                    query = query.options(joinedload(field))
                else:
                    query = query.options(selectinload(field))

        # Apply grouping
        if config.group_by:
            query = query.group_by(*[getattr(self.entity_type, field) for field in config.group_by])

        # Apply having
        if config.having:
            having_conditions = []
            for field, value in config.having.items():
                operator, actual_value = self._parse_filter_value(value)
                column = getattr(self.entity_type, field)
                having_conditions.append(self._apply_operator(column, operator, actual_value))
            if having_conditions:
                query = query.having(and_(*having_conditions))

        # Apply pagination
        if config.offset is not None:
            query = query.offset(config.offset)
        if config.limit is not None:
            query = query.limit(config.limit)

        return query

    async def execute_query(self, config: QueryConfig = None) -> Union[List[T], Optional[T], int, bool, None]:
        """Universal method for executing queries based on config"""
        if config is None:
            config = QueryConfig()

        # For count operations
        if not config.return_data:
            query = select(func.count()).select_from(self.entity_type)
            query = self._build_query(query, config)
            result = await self.session.execute(query)
            return result.scalar()

        # For data retrieval
        query = self._build_query(config=config)
        result = await self.session.execute(query)
        entities = result.scalars().all()

        if not entities:
            return None if config.limit == 1 else []

        schema_objects = [self.schema_type.model_validate(entity) for entity in entities]
        return schema_objects[0] if config.limit == 1 else schema_objects

    async def execute_operation(self, operation: str, config: QueryConfig, data: Optional[Dict[str, Any]] = None) -> Any:
        """Universal method for executing operations (create, update, delete)"""
        if operation == "create":
            entity = self.entity_type(**(data or {}))
            self.session.add(entity)
            await self.session.commit()
            await self.session.refresh(entity)
            return self.schema_type.model_validate(entity) if config.return_data else None

        elif operation == "update":
            query = update(self.entity_type)
            query = self._build_query(query, config)
            query = query.values(**(data or {}))
            await self.session.execute(query)
            await self.session.commit()
            return await self.execute_query(config) if config.return_data else None

        elif operation == "delete":
            if config.return_data:
                entities = await self.execute_query(config)
            query = delete(self.entity_type)
            query = self._build_query(query, config)
            await self.session.execute(query)
            await self.session.commit()
            return entities if config.return_data else None

    # Simplified public methods
    async def get(self, id: int, config: QueryConfig = None) -> Optional[T]:
        """Get by ID"""
        basic_config = QueryConfig(
            filters={"id": id},
            limit=1
        )
        return await self.execute_query(config or basic_config)

    async def get_all(self, config: QueryConfig = None) -> List[T]:
        """Get all with config"""
        return await self.execute_query(config or QueryConfig())

    async def create(self, data: Union[T, Dict[str, Any]], config: QueryConfig = None) -> Optional[T]:
        """Create entity"""
        data_dict = data.dict() if isinstance(data, BaseModel) else data
        return await self.execute_operation("create", config or QueryConfig(), data_dict)

    async def update(self, data: Dict[str, Any], config: QueryConfig = None) -> Optional[Union[T, List[T]]]:
        """Update entities matching config"""
        return await self.execute_operation("update", config or QueryConfig(), data)

    async def delete(self, config: QueryConfig = None) -> Optional[List[T]]:
        """Delete entities matching config"""
        return await self.execute_operation("delete", config or QueryConfig())

    async def count(self, config: QueryConfig = None) -> int:
        """Count entities matching config"""
        count_config = QueryConfig(return_data=False) if config is None else config
        count_config.return_data = False
        return await self.execute_query(count_config)

    async def exists(self, config: QueryConfig = None) -> bool:
        """Check if entities exist matching config"""
        count = await self.count(config)
        return count > 0

    async def upsert(self, data: Dict[str, Any], unique_fields: List[str], config: QueryConfig = None) -> Optional[T]:
        """Insert or update based on unique fields"""
        filters = {
            field: data[field] for field in unique_fields
        }
        exists_config = QueryConfig(filters=filters, limit=1)
        existing = await self.execute_query(exists_config)

        if existing:
            update_config = QueryConfig(filters=filters, limit=1)
            return await self.update(data, update_config)
        return await self.create(data, config)