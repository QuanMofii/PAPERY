from datetime import datetime
from typing import Any, Optional
import json
import logging
import redis.asyncio as redis
from ..config import settings

from ..logger import logging as app_logging

logger = logging.getLogger(__name__)


class RedisStorage:
    """Lớp quản lý Redis storage."""
    
    def __init__(self):
        self._client: Optional[redis.Redis] = None
        
    async def init(self) -> None:
        """Khởi tạo Redis client."""
        if not self._client:
            try:
                self._client = await redis.from_url(
                    f"redis://{settings.REDIS_CACHE_HOST}:{settings.REDIS_CACHE_PORT}",
                    encoding="utf-8",
                    decode_responses=True
                )
                # Test connection
                await self._client.ping()
                logger.info("Redis storage initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Redis storage: {str(e)}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Redis."""
        if self._client:
            await self._client.close()
            self._client = None
            logger.info("Redis storage connection closed")
    
    async def _ensure_connection(self) -> None:
        """Đảm bảo Redis client đã được khởi tạo."""
        if not self._client:
            await self.init()
    
    async def set(self, key: str, value: str, expire: int | None = None) -> bool:
        """
        Lưu giá trị vào Redis.
        
        Args:
            key: Khóa
            value: Giá trị
            expire: Thời gian hết hạn (giây)
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        try:
            await self._ensure_connection()
            await self._client.set(key, value, ex=expire)
            logger.info(f"Successfully set key {key} in Redis")
            return True
        except Exception as e:
            logger.error(f"Error setting key {key}: {str(e)}")
            return False
    
    async def get(self, key: str, delete: bool = False) -> Any:
        """
        Lấy giá trị từ Redis.
        
        Args:
            key: Khóa
            delete: Có xóa key sau khi lấy không
            
        Returns:
            Any: Giá trị hoặc None nếu không tồn tại
        """
        try:
            await self._ensure_connection()
            if delete:
                value = await self._client.getdel(key)
            else:
                value = await self._client.get(key)
            return value
        except Exception as e:
            logger.error(f"Error getting key {key}: {str(e)}")
            return None
    
    async def delete(self, key: str) -> bool:
        """
        Xóa key khỏi Redis.
        
        Args:
            key: Khóa cần xóa
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        try:
            await self._ensure_connection()
            await self._client.delete(key)
            logger.info(f"Successfully deleted key {key} from Redis")
            return True
        except Exception as e:
            logger.error(f"Error deleting key {key}: {str(e)}")
            return False

    async def exists(self, key: str) -> bool:
        """Check if a key exists in Redis.
        
        Args:
            key: Key to check
            
        Returns:
            bool: True if key exists
        """
        try:
            await self._ensure_connection()
            return bool(await self._client.exists(key))
        except Exception as e:
            logger.error(f"Error checking existence of key {key}: {str(e)}")
            return False

    async def set_with_timestamp(
        self, 
        key: str, 
        value: Any, 
        expire: Optional[int] = None
    ) -> bool:
        """Set a value with timestamp information.
        
        Args:
            key: Key to store under
            value: Value to store
            expire: Optional expiration in seconds
            
        Returns:
            bool: True if successful
        """
        data = {
            "value": value,
            "timestamp": datetime.utcnow().isoformat()
        }
        return await self.set(key, data, expire)

    async def get_many(self, pattern: str) -> dict[str, Any]:
        """Get multiple values by pattern.
        
        Args:
            pattern: Pattern to match keys (e.g. "user:*")
            
        Returns:
            dict: Dictionary of matched key-value pairs
        """
        try:
            await self._ensure_connection()
            keys = []
            cursor = 0
            while True:
                cursor, batch = await self._client.scan(cursor, match=pattern, count=100)
                keys.extend(batch)
                if cursor == 0:
                    break

            result = {}
            for key in keys:
                value = await self.get(key)
                if value is not None:
                    result[key] = value
            return result
        except Exception as e:
            logger.error(f"Error getting keys by pattern {pattern}: {str(e)}")
            return {}

    async def delete_many(self, pattern: str) -> int:
        """Delete multiple keys by pattern.
        
        Args:
            pattern: Pattern to match keys to delete
            
        Returns:
            int: Number of keys deleted
        """
        try:
            await self._ensure_connection()
            keys = []
            cursor = 0
            while True:
                cursor, batch = await self._client.scan(cursor, match=pattern, count=100)
                keys.extend(batch)
                if cursor == 0:
                    break

            if keys:
                return await self._client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Error deleting keys by pattern {pattern}: {str(e)}")
            return 0


# Singleton instance
redis_storage = RedisStorage() 