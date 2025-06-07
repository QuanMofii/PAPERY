from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db.database import Base
from ..core.db.models import TimestampMixin


class RateLimit(Base, TimestampMixin):
    __tablename__ = "rate_limit"

    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    tier_id: Mapped[int] = mapped_column(ForeignKey("tier.id"), index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    path: Mapped[str] = mapped_column(String, nullable=False)
    limit: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)

    