from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings

engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI))
SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)