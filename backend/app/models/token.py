from sqlalchemy import Boolean,Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base import Base

class Token(Base):
    id = Column(Integer, primary_key=True, index=True)
    refresh_token=Column(String(225), index=True)
    exp = Column(DateTime, nullable=False)
    used_token = Column(Boolean, nullable=False, default=False)
    user_id = Column(Integer, ForeignKey("user.id",ondelete="CASCADE"))
    owner = relationship("User", back_populates="token", passive_deletes=True) 



