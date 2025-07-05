from datetime import UTC, datetime
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from ...core.logger import logging
from ...schemas.rate_limit import sanitize_path
from .redis import redis

logger = logging.getLogger(__name__)


class RateLimiter:
    _instance: Optional["RateLimiter"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis."""
        return await redis.health_check()

    async def is_rate_limited(self, db: AsyncSession, user_id: int, path: str, limit: int, period: int) -> bool:
        """Kiểm tra rate limit cho user."""
        if not redis.is_available():
            logger.warning("Redis is not available, rate limiting is disabled")
            return False

        client = redis.get_client()
        if not client:
            logger.warning("Redis client is not available, rate limiting is disabled")
            return False

        current_timestamp = int(datetime.now(UTC).timestamp())
        window_start = current_timestamp - (current_timestamp % period)

        sanitized_path = sanitize_path(path)
        key = f"ratelimit:{user_id}:{sanitized_path}:{window_start}"

        try:
            current_count = await client.incr(key)
            if current_count == 1:
                await client.expire(key, period)

            if current_count > limit:
                logger.info(f"Rate limit exceeded for user {user_id} on path {path}")
                return True

        except Exception as e:
            error_msg = str(e).replace("Error ", "")
            logger.error(f"Error checking rate limit for user {user_id} on path {path}: {error_msg}")
            # Trong trường hợp lỗi, cho phép request đi qua
            return False

        return False

# Singleton instance
rate_limiter = RateLimiter()
