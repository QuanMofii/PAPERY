import uuid as uuid_pkg
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String(30))
    username: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    tier_id: Mapped[int | None] = mapped_column(ForeignKey("tier.id"), index=True, default=None, init=False)
    

    last_login: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    profile_image_url: Mapped[str] = mapped_column(String, default="https://profileimageurl.com")
    is_superuser: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
