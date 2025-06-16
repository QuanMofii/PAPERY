from typing import Optional, Any
import logging
import redis.asyncio as redis
from ..config import settings
from ..logger import logging as app_logging

logger = logging.getLogger(__name__)

class RedisManager:
    """Lớp quản lý Redis tập trung cho toàn bộ ứng dụng."""
    
    _instance: Optional["RedisManager"] = None
    _client: Optional[redis.Redis] = None
    _pool: Optional[redis.ConnectionPool] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    async def init(self) -> None:
        """Khởi tạo Redis client và connection pool."""
        if not self._client:
            try:
                self._pool = redis.ConnectionPool.from_url(
                    settings.REDIS_CACHE_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
                self._client = redis.Redis(connection_pool=self._pool)
                # Test connection
                await self._client.ping()
                logger.debug("Redis connection initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Redis connection: {str(e)}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Redis."""
        if self._client:
            await self._client.close()
            self._client = None
            if self._pool:
                await self._pool.disconnect()
                self._pool = None
            logger.debug("Redis connection closed")
    
    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis."""
        try:
            if not self._client:
                await self.init()
            return await self._client.ping()
        except Exception as e:
            logger.error(f"Redis health check failed: {str(e)}")
            return False
    
    def get_client(self) -> redis.Redis:
        """Lấy Redis client instance."""
        if not self._client:
            raise Exception("Redis client is not initialized")
        return self._client
    
    async def set(self, key: str, value: Any, expire: int | None = None) -> bool:
        """Lưu giá trị vào Redis."""
        try:
            if not self._client:
                await self.init()
            await self._client.set(key, value, ex=expire)
            logger.debug(f"Set key {key} in Redis")
            return True
        except Exception as e:
            logger.error(f"Error setting key {key}: {str(e)}")
            return False
    
    async def get(self, key: str, delete: bool = False) -> Any:
        """Lấy giá trị từ Redis."""
        try:
            if not self._client:
                await self.init()
            if delete:
                value = await self._client.getdel(key)
            else:
                value = await self._client.get(key)
            return value
        except Exception as e:
            logger.error(f"Error getting key {key}: {str(e)}")
            return None
    
    async def delete(self, key: str) -> bool:
        """Xóa key khỏi Redis."""
        try:
            if not self._client:
                await self.init()
            await self._client.delete(key)
            logger.debug(f"Deleted key {key} from Redis")
            return True
        except Exception as e:
            logger.error(f"Error deleting key {key}: {str(e)}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Kiểm tra key có tồn tại trong Redis không."""
        try:
            if not self._client:
                await self.init()
            return bool(await self._client.exists(key))
        except Exception as e:
            logger.error(f"Error checking existence of key {key}: {str(e)}")
            return False

# Singleton instance
redis_manager = RedisManager()
