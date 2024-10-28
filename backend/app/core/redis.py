import redis.asyncio as redis
from core.config import settings

class RedisClient:
    _instance = None
    @staticmethod
    async def get_instance():
        """Start async Redis"""
        if RedisClient._instance is None:
            RedisClient._instance = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=0,
                decode_responses=True,  
                max_connections=10,     
            )
        return RedisClient._instance

async def get_redis_client():
    
    if RedisClient._instance is None: 
        return await RedisClient.get_instance()
    return RedisClient._instance
