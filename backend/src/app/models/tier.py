from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column,relationship

if TYPE_CHECKING:
   from .user import User


from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin


class Tier(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tier"
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    users: Mapped[list["User"]] = relationship(back_populates="tier", init=False)