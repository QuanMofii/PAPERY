from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from .chat_message import ChatMessage
    from .document import Document


class MessageDocument(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "message_document"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    
    # Required fields
    relevance_score: Mapped[float] = mapped_column(nullable=False)
    context: Mapped[str] = mapped_column(Text, nullable=False)
    message_id: Mapped[int] = mapped_column(ForeignKey("chat_message.id", ondelete="CASCADE"), index=True, init=False)
    document_id: Mapped[int] = mapped_column(ForeignKey("document.id", ondelete="CASCADE"), index=True, init=False)
    
    # Optional fields with defaults
    page_number: Mapped[int] = mapped_column(nullable=True)
    section: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # Relationships
    message: Mapped["ChatMessage"] = relationship(back_populates="document_links", init=False)
    document: Mapped["Document"] = relationship(back_populates="message_links", init=False)
