from enum import Enum
from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Integer, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin
from .chat_session import ChatSession

if TYPE_CHECKING:
    from .document import Document
    from .message_document import MessageDocument


class Role(str, Enum):
    user = "user"
    bot = "bot"


class ChatMessage(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "chat_message"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    
    # Required fields
    content: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(SQLEnum(Role), nullable=False)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False)
    model_name: Mapped[str] = mapped_column(String(50), nullable=False)
    token_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Foreign keys
    chat_session_id: Mapped[int] = mapped_column(ForeignKey("chat_session.id", ondelete="CASCADE"), index=True, init=False)
    
    # Relationships
    chat_session: Mapped[ChatSession] = relationship(back_populates="messages", init=False)
    document_links: Mapped[list["MessageDocument"]] = relationship(
        back_populates="message",
        cascade="all, delete-orphan",
        init=False
    )
    referenced_documents: Mapped[list["Document"]] = relationship(
        "Document",
        secondary="message_document",
        back_populates="referenced_in_messages",
        viewonly=True,
        init=False
    )
