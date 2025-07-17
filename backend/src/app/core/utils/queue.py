from typing import Any, Callable, Optional
import logging
from datetime import datetime
from celery import Celery
from celery.result import AsyncResult

from ..config import settings
from ..db.redis import redis

logger = logging.getLogger(__name__)

class TaskStatus:
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class RedisQueue:
    """Lớp quản lý Redis queue sử dụng Celery."""
    
    def __init__(self):
        self._celery: Optional[Celery] = None
        self._is_available: bool = False
        
    async def init(self) -> None:
        """Khởi tạo Celery app."""
        if not self._celery:
            try:
                if not redis.is_available():
                    logger.warning("Redis is not available, queue initialization skipped")
                    return

                self._celery = Celery(
                    'tasks',
                    broker=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/0',
                    backend=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/1'
                )
                self._is_available = True
                logger.info("Celery app initialized successfully")
            except Exception as e:
                self._is_available = False
                error_msg = str(e).replace("Error ", "")
                logger.error(f"Failed to initialize Celery app: {error_msg}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Celery."""
        if self._celery:
            try:
                self._celery.control.shutdown()
                self._celery = None
                self._is_available = False
                logger.info("Celery app closed successfully")
            except Exception as e:
                error_msg = str(e).replace("Error ", "")
                logger.error(f"Error closing Celery app: {error_msg}")
    
    def is_available(self) -> bool:
        """Kiểm tra xem queue có khả dụng không."""
        return self._is_available and redis.is_available()
    
    def register_function(self, func: Callable, name: str | None = None) -> None:
        """
        Đăng ký một hàm để xử lý trong worker.
        Hỗ trợ cả sync function và async function (coroutine).
        Args:
            func: Hàm cần đăng ký (có thể là async hoặc sync)
            name: Tên của hàm (mặc định là tên hàm)
        """
        if not self._is_available:
            logger.warning("Queue is not available, function registration skipped")
            return
        if not self._celery:
            raise Exception("Celery app not initialized")
        function_name = name or func.__name__
        # Nếu là async function, wrap lại để celery gọi được
        import inspect
        if inspect.iscoroutinefunction(func):
            import asyncio
            def sync_wrapper(*args, **kwargs):
                return asyncio.run(func(*args, **kwargs))
            self._celery.task(name=function_name)(sync_wrapper)
        else:
            self._celery.task(name=function_name)(func)
        logger.info(f"Registered function: {function_name}")
    
    async def enqueue(
        self,
        function_name: str,
        *args: Any,
        queue_name: str = "default",
        **kwargs: Any
    ) -> Optional[str]:
        """
        Thêm một task vào queue. Hỗ trợ cả async và sync function.
        Nếu function là async, sẽ tự động chạy đúng kiểu.
        Returns:
            Optional[str]: Task ID hoặc None nếu queue không khả dụng
        """
        if not self._is_available:
            logger.warning("Queue is not available, task enqueuing skipped")
            return None
        if not self._celery:
            await self.init()
            if not self._is_available or not self._celery:
                return None
        try:
            task = self._celery.send_task(
                function_name,
                args=args,
                kwargs=kwargs,
                queue=queue_name
            )
            logger.info(f"Enqueued task {task.id} for function {function_name}")
            return task.id
        except Exception as e:
            self._is_available = False
            error_msg = str(e).replace("Error ", "")
            logger.error(f"Failed to enqueue task for {function_name}: {error_msg}")
            return None
    
    async def get_task_status(self, task_id: str) -> dict[str, Any]:
        """
        Lấy trạng thái của một task.
        
        Args:
            task_id: ID của task
            
        Returns:
            dict: Thông tin trạng thái của task
        """
        if not self._is_available:
            logger.warning("Queue is not available, task status check skipped")
            return {"status": "unavailable", "error": "Queue is not available"}
            
        if not self._celery:
            await self.init()
            if not self._is_available or not self._celery:
                return {"status": "unavailable", "error": "Queue is not available"}
            
        try:
            result = AsyncResult(task_id, app=self._celery)
            status_data = {
                "status": result.status,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if result.successful():
                status_data["result"] = result.result
            elif result.failed():
                status_data["error"] = str(result.result)
                
            return status_data
        except Exception as e:
            self._is_available = False
            error_msg = str(e).replace("Error ", "")
            logger.error(f"Failed to get status for task {task_id}: {error_msg}")
            return {"status": "error", "error": error_msg}
    
    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis và Celery."""
        try:
            if not self._celery:
                await self.init()
            if not self._is_available or not self._celery:
                return False
            return self._celery.control.inspect().ping() is not None
        except Exception as e:
            self._is_available = False
            error_msg = str(e).replace("Error ", "")
            logger.error(f"Celery health check failed: {error_msg}")
            return False


# Singleton instance
redis_queue = RedisQueue()
