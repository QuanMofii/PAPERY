from typing import Optional, Any
import logging
import redis.asyncio as redis_async
import asyncio
from ..config import settings
from ..logger import logging as app_logging

logger = logging.getLogger(__name__)

class Redis:
    """Centralized Redis management class for the entire application."""
    
    _instance: Optional["Redis"] = None
    _client: Optional[redis_async.Redis] = None
    _pool: Optional[redis_async.ConnectionPool] = None
    _is_available: bool = False
    _max_retries: int = 5
    _retry_delay: float = 1.0
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    async def init(self) -> None:
        """Initialize Redis client and connection pool with retry mechanism."""
        if self._client:
            return
            
        for attempt in range(self._max_retries):
            try:
                self._pool = redis_async.ConnectionPool.from_url(
                    settings.REDIS_CACHE_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
                self._client = redis_async.Redis(connection_pool=self._pool)
                await self._client.ping()
                self._is_available = True
                logger.info("Redis connection initialized successfully")
                return
            except Exception as e:
                logger.warning(f"Redis retry {attempt + 1}/{self._max_retries}: {e}")
                if attempt < self._max_retries - 1:
                    await asyncio.sleep(self._retry_delay)
                else:
                    self._is_available = False
                    logger.error("All Redis connection attempts failed - Redis will be unavailable")
                    # Don't raise exception to prevent server crash
    
    async def close(self) -> None:
        """Close Redis connection."""
        if self._client:
            try:
                await self._client.close()
                self._client = None
                if self._pool:
                    await self._pool.disconnect()
                    self._pool = None
                self._is_available = False
                logger.info("Redis connection closed successfully")
            except Exception as e:
                logger.error(f"Error closing Redis connection: {e}")
    
    async def health_check(self) -> bool:
        """Check Redis connection health."""
        if not self._client:
            await self.init()
        if not self._client:
            return False
            
        try:
            await self._client.ping()
            self._is_available = True
            return True
        except Exception as e:
            self._is_available = False
            logger.error(f"Redis health check failed: {e}")
            return False
    
    def is_available(self) -> bool:
        """Check if Redis is available."""
        return self._is_available
    
    def get_client(self) -> Optional[redis_async.Redis]:
        """Get Redis client instance."""
        return self._client if self._is_available else None
    
    async def _ensure_connection(self) -> bool:
        """Ensure Redis connection is available."""
        if not self._is_available:
            await self.init()
        return self._is_available
    
    async def set(self, key: str, value: Any, expire: int | None = None) -> bool:
        """Set value in Redis."""
        if not await self._ensure_connection():
            return False
            
        try:
            if self._client:
                await self._client.set(key, value, ex=expire)
                return True
            return False
        except Exception as e:
            self._is_available = False
            logger.error(f"Error setting key {key}: {e}")
            return False
    
    async def get(self, key: str, delete: bool = False) -> Any:
        """Get value from Redis."""
        if not await self._ensure_connection():
            return None
            
        try:
            if self._client:
                if delete:
                    return await self._client.getdel(key)
                return await self._client.get(key)
            return None
        except Exception as e:
            logger.error(f"Error getting key {key}: {e}")
            return None
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        if not await self._ensure_connection():
            return False
            
        try:
            if self._client:
                await self._client.delete(key)
                return True
            return False
        except Exception as e:
            self._is_available = False
            logger.error(f"Error deleting key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis."""
        if not await self._ensure_connection():
            return False
            
        try:
            if self._client:
                return bool(await self._client.exists(key))
            return False
        except Exception as e:
            logger.error(f"Error checking existence of key {key}: {e}")
            return False

# Singleton instance
redis = Redis()
