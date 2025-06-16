from datetime import UTC, datetime
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from ...core.logger import logging
from ...schemas.rate_limit import sanitize_path
from .redis import redis_manager

logger = logging.getLogger(__name__)


class RateLimiter:
    _instance: Optional["RateLimiter"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis."""
        return await redis_manager.health_check()

    async def is_rate_limited(self, db: AsyncSession, user_id: int, path: str, limit: int, period: int) -> bool:
        client = redis_manager.get_client()
        current_timestamp = int(datetime.now(UTC).timestamp())
        window_start = current_timestamp - (current_timestamp % period)

        sanitized_path = sanitize_path(path)
        key = f"ratelimit:{user_id}:{sanitized_path}:{window_start}"

        try:
            current_count = await client.incr(key)
            if current_count == 1:
                await client.expire(key, period)

            if current_count > limit:
                return True

        except Exception as e:
            logger.exception(f"Error checking rate limit for user {user_id} on path {path}: {e}")
            raise e

        return False

# Singleton instance
rate_limiter = RateLimiter()
