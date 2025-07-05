from typing import Optional, Any
import logging
import redis.asyncio as redis_async
from ..config import settings
from ..logger import logging as app_logging

logger = logging.getLogger(__name__)

class Redis:
    """Lớp quản lý Redis tập trung cho toàn bộ ứng dụng."""
    
    _instance: Optional["Redis"] = None
    _client: Optional[redis_async.Redis] = None
    _pool: Optional[redis_async.ConnectionPool] = None
    _is_available: bool = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    async def init(self) -> None:
        """Khởi tạo Redis client và connection pool."""
        if not self._client:
            try:
                self._pool = redis_async.ConnectionPool.from_url(
                    settings.REDIS_CACHE_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
                self._client = redis_async.Redis(connection_pool=self._pool)
                # Test connection
                await self._client.ping()
                self._is_available = True
                logger.info("Redis connection initialized successfully")
            except Exception as e:
                self._is_available = False
                logger.error(f"Failed to initialize Redis connection: {e}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Redis."""
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
                error_msg = str(e).replace("Error ", "")
                logger.error(f"Error closing Redis connection: {error_msg}")
    
    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis."""
        try:
            if not self._client:
                await self.init()
            if not self._client:
                raise RuntimeError("Redis client is not initialized")
            is_healthy = await self._client.ping()
            self._is_available = is_healthy
            return is_healthy
        except Exception as e:
            self._is_available = False
    
            logger.error(f"Redis health check failed - {e}")
            return False
    
    def is_available(self) -> bool:
        """Kiểm tra xem Redis có khả dụng không."""
        return self._is_available
    
    def get_client(self) -> Optional[redis_async.Redis]:
        """Lấy Redis client instance."""
        if not self._client or not self._is_available:
            logger.warning("Redis client is not available")
            return None
        return self._client
    
    async def set(self, key: str, value: Any, expire: int | None = None) -> bool:
        """Lưu giá trị vào Redis."""
        if not self._is_available:
            logger.warning(f"Cannot set key {key}: Redis is not available")
            return False
            
        try:
            if not self._client:
                await self.init()
            if not self._client:
                raise RuntimeError("Redis client is not initialized")
            await self._client.set(key, value, ex=expire)
            logger.debug(f"Set key {key} in Redis")
            return True
        except Exception as e:
            self._is_available = False
            logger.error(f"Error setting key {key} - {e}")
            return False
    
    async def get(self, key: str, delete: bool = False) -> Any:
        """Lấy giá trị từ Redis."""
        if not self._is_available:
            logger.warning(f"Cannot get key {key}: Redis is not available")
            return None
            
        try:
            if not self._client:
                await self.init()
            if not self._client:
                raise RuntimeError("Redis client is not initialized")
            if delete:
                value = await self._client.getdel(key)
            else:
                value = await self._client.get(key)
            return value
        except Exception as e:
            logger.error(f"Error getting key {key} - {e}")
            return None
    
    async def delete(self, key: str) -> bool:
        """Xóa key khỏi Redis."""
        if not self._is_available:
            logger.warning(f"Cannot delete key {key}: Redis is not available")
            return False
            
        try:
            if not self._client:
                await self.init()
            if not self._client:
                raise RuntimeError("Redis client is not initialized")
            await self._client.delete(key)
            logger.debug(f"Deleted key {key} from Redis")
            return True
        except Exception as e:
            self._is_available = False
       
            logger.error(f"Error deleting key {key} - {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Kiểm tra key có tồn tại trong Redis không."""
        if not self._is_available:
            logger.warning(f"Cannot check existence of key {key}: Redis is not available")
            return False
            
        try:
            if not self._client:
                await self.init()
            if not self._client:
                raise RuntimeError("Redis client is not initialized")
            return bool(await self._client.exists(key))
        except Exception as e:
            logger.error(f"Error checking existence of key {key} - {e}")
            return False

# Singleton instance
redis = Redis()
