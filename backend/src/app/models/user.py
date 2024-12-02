from sqlalchemy import  ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from core.db.database import Base
from core.db.models import TimestampMixin, UUIDBase, SoftDeleteMixin


class User(Base, TimestampMixin, SoftDeleteMixin, UUIDBase):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)

    name: Mapped[str] = mapped_column(String(30))
    username: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255)) 

    profile_image_url: Mapped[str] = mapped_column(String(2083), server_default="https://profileimageurl.com")
    is_superuser: Mapped[bool] = mapped_column(default=False)

    tier_id: Mapped[int | None] = mapped_column(ForeignKey("tier.id"), index=True, default=None, init=False)

