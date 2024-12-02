import uuid as uuid_pkg
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, text,String
from sqlalchemy.orm import mapped_column
from sqlalchemy.ext.declarative import declared_attr
from core.config import settings
# from sqlalchemy.dialects.postgresql import UUID

class UUIDBase:
        @declared_attr
        def uuid(cls):
            return mapped_column(
                String(36),
                primary_key=True,
                unique=True,
                default=lambda: str(uuid_pkg.uuid4()),
                init=False  
            )
       
        # @declared_attr
        # def uuid(cls):
        #     return mapped_column(
        #      UUID, 
        #      primary_key=True, 
        #      default=uuid_pkg.uuid4, 
        #      server_default=text("gen_random_uuid()"), 
        #      init=False  
        # )
class TimestampMixin:
    @declared_attr
    def created_at(cls):
        return mapped_column(DateTime, default=lambda: datetime.now(UTC), server_default=text("current_timestamp(0)"))

    @declared_attr
    def updated_at(cls):
        return mapped_column(
            DateTime,
            nullable=True,
            default=None,
            onupdate=lambda: datetime.now(UTC),
            server_default=text("current_timestamp(0)")
        )
class SoftDeleteMixin:
    @declared_attr
    def deleted_at(cls):
        return mapped_column(DateTime, nullable=True, default=None)

    @declared_attr
    def is_deleted(cls):
        return mapped_column(Boolean, default=False)