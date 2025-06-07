from datetime import UTC, datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db.database import Base
from ..core.db.models import TimestampMixin


class Tier(Base, TimestampMixin):
    __tablename__ = "tier"
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)

   