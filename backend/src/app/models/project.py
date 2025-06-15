from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin
from .user import User

if TYPE_CHECKING:
    from .chat_session import ChatSession
    from .document import Document


class Project(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "project"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    
    # Required fields
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True, init=False)
    
    # Optional fields with defaults
    settings: Mapped[dict] = mapped_column(Text, nullable=True)
    
    # Relationships
    user: Mapped[User] = relationship(back_populates="projects", init=False)
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        init=False
    )
    documents: Mapped[list["Document"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        init=False
    )
