from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .base import Base

class Item(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(225), index=True)
    description = Column(String(225), index=False)
    owner_id = Column(Integer, ForeignKey("user.id",ondelete="CASCADE"))
    owner = relationship("User", back_populates="item", passive_deletes=True)