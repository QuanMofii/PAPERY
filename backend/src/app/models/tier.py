from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from core.db.database import Base
from core.db.models import TimestampMixin, SoftDeleteMixin

class Tier(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tier"

    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)


