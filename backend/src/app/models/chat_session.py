from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin
from .project import Project

if TYPE_CHECKING:
    from .chat_message import ChatMessage


class ChatSession(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "chat_session"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    
    # Required fields
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey("project.id", ondelete="CASCADE"), index=True, init=False)
    
    # Optional fields with defaults
    description: Mapped[str] = mapped_column(Text, nullable=True)
    settings: Mapped[dict] = mapped_column(Text, nullable=True)
    
    # Relationships
    project: Mapped[Project] = relationship(back_populates="chat_sessions", init=False)
    messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="chat_session",
        cascade="all, delete-orphan",
        init=False
    )
