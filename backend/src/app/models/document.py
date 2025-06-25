from enum import Enum
from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Integer, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db.database import Base
from ..core.db.models import UUIDMixin, TimestampMixin, SoftDeleteMixin
from .project import Project

if TYPE_CHECKING:
    from .chat_message import ChatMessage
    from .message_document import MessageDocument


class DocumentType(str, Enum):
    pdf = "pdf"
    docx = "docx"
    txt = "txt"
    markdown = "markdown"
    html = "html"
    json = "json"
    csv = "csv"
    excel = "excel"
    image = "image"
    audio = "audio"
    video = "video"
    other = "other"


class Document(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "document"
    
    # Primary key
    id: Mapped[int] = mapped_column("id", autoincrement=True, nullable=False, unique=True, primary_key=True, init=False)
    
    # Required fields
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(SQLEnum(DocumentType), nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey("project.id", ondelete="CASCADE"), index=True)
    
    # Optional fields with defaults
    description: Mapped[str] = mapped_column(Text, nullable=True)
    file_size: Mapped[int] = mapped_column(Integer, nullable=True)
    page_count: Mapped[int] = mapped_column(Integer, nullable=True)
    meta_info: Mapped[dict] = mapped_column(Text, nullable=True)
    
    # Relationships
    project: Mapped[Project] = relationship(back_populates="documents", init=False)
    message_links: Mapped[list["MessageDocument"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        init=False
    )
    referenced_in_messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage",
        secondary="message_document",
        back_populates="referenced_documents",
        viewonly=True,
        init=False
    )
