from typing import Any, Dict
import datetime
from sqlalchemy import inspect, MetaData, Column, DateTime
from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
           return cls.__name__.lower()
    metadata = MetaData()
    @declared_attr
    def created_at(cls):
        return Column(DateTime, default=datetime.datetime.now, nullable=False)

    @declared_attr
    def last_updated(cls):
        return Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    def dict(self) -> Dict[str, Any]:
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}