from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Boolean,Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin

from .tier import Tier

if TYPE_CHECKING:
    from .project import Project
 
class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"

class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "user"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    # Foreign keys
    tier_id: Mapped[int | None] = mapped_column(ForeignKey("tier.id", ondelete="SET NULL"), index=True)

    # Required fields
    username: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=True)
    
    auth_type: Mapped[AuthProvider] = mapped_column(
    SQLEnum(AuthProvider,native_enum=True),
    default=AuthProvider.LOCAL,
    nullable=False,
    index=True, 
)
    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    profile_image_url: Mapped[str | None] = mapped_column(String, nullable=True, default=None)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Relationships
    tier: Mapped[Tier] = relationship(back_populates="users", init=False)
    projects: Mapped[list["Project"]] = relationship(back_populates="user", cascade="all, delete-orphan", init=False)
