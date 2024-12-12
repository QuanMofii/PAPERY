from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from core.db.database import Base
from core.db.models import TimestampMixin, SoftDeleteMixin


class TokenBlacklist(Base,TimestampMixin, SoftDeleteMixin):
    __tablename__ = "token_blacklist"

    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    token: Mapped[str] = mapped_column(String(512), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
