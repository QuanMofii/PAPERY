from sqlalchemy import  ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.db.database import Base
from core.db.models import TimestampMixin, UUIDBase, SoftDeleteMixin

class Post(Base, TimestampMixin, SoftDeleteMixin, UUIDBase):
    __tablename__ = "post"

    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    created_by_user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    text: Mapped[str] = mapped_column(Text) 
    media_url: Mapped[str | None] = mapped_column(String(2083), default=None)

