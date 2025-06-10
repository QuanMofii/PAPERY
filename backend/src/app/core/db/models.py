import uuid as uuid_pkg
from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, text
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped, mapped_column

class UUIDMixin:
    uuid: Mapped[uuid_pkg.UUID] = mapped_column(
        default_factory=uuid_pkg.uuid4,
        server_default=text("gen_random_uuid()"),
        primary_key=True,
          init=False 
    )

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime,  default=datetime.now(UTC), server_default=text("current_timestamp(0)"),  init=False )
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, onupdate=datetime.now(UTC), server_default=text("current_timestamp(0)"),  init=False )
class SoftDeleteMixin:
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=True, init=False )
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, init=False )
