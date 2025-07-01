from enum import Enum
from sqlalchemy import Integer, ForeignKey, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from ..core.db.database import Base
from ..core.db.models import TimestampMixin, SoftDeleteMixin
import uuid

class ResourceType(str, Enum):
    PROJECT = "project"
    CHAT_SESSION = "chat_session"
    CHAT_MESSAGE = "chat_message"
    DOCUMENT = "document"

class PermissionType(str, Enum):
    OWNER = "owner"
    COLLABORATOR = "collaborator"
    VIEWER = "viewer"

class AccessControl(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "access_control"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True,nullable=False, unique=True, init=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    resource_uuid: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=False, index=True)
    resource_type: Mapped[ResourceType] = mapped_column(SQLEnum(ResourceType, native_enum=True), nullable=False, index=True)
    permission: Mapped[PermissionType] = mapped_column(SQLEnum(PermissionType, native_enum=True), nullable=False, index=True, default=PermissionType.OWNER)
