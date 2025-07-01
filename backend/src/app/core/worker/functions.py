import asyncio
import logging
from typing import Any

from celery import Task
from ..utils.redis import redis

logger = logging.getLogger(__name__)

# -------- background tasks --------
async def sample_background_task(name: str) -> str:
    """Task mẫu để test background worker."""
    await asyncio.sleep(5)
    return f"Task {name} is complete!"

# -------- base functions --------
async def startup() -> None:
    """Khởi tạo worker."""
    logger.info("Worker Started")
    await redis.init()

async def shutdown() -> None:
    """Đóng worker."""
    logger.info("Worker end")
    await redis.close()

# -------- task decorators --------
def create_task(func: Any) -> Task:
    """Decorator để tạo Celery task."""
    from .celery_app import celery_app # type: ignore
    
    @celery_app.task(name=func.__name__)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        return asyncio.run(func(*args, **kwargs))
    
    return wrapper # type: ignore
