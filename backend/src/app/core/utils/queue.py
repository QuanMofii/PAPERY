from typing import Any, Callable, Optional
import logging
from datetime import datetime
from celery import Celery
from celery.result import AsyncResult

from ..config import settings
from .redis import redis_manager

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
        
    async def init(self) -> None:
        """Khởi tạo Celery app."""
        if not self._celery:
            try:
                self._celery = Celery(
                    'tasks',
                    broker=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/0',
                    backend=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/1'
                )
                logger.info("Celery app initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Celery app: {str(e)}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Celery."""
        if self._celery:
            self._celery.control.shutdown()
            self._celery = None
            logger.info("Celery app closed")
    
    def register_function(self, func: Callable, name: str | None = None) -> None:
        """
        Đăng ký một hàm để xử lý trong worker.
        
        Args:
            func: Hàm cần đăng ký
            name: Tên của hàm (mặc định là tên hàm)
        """
        if not self._celery:
            raise Exception("Celery app not initialized")
            
        function_name = name or func.__name__
        self._celery.task(name=function_name)(func)
        logger.info(f"Registered function: {function_name}")
    
    async def enqueue(
        self,
        function_name: str,
        *args: Any,
        queue_name: str = "default",
        **kwargs: Any
    ) -> str:
        """
        Thêm một task vào queue.
        
        Args:
            function_name: Tên hàm đã đăng ký
            *args: Tham số vị trí cho hàm
            queue_name: Tên của queue (mặc định là "default")
            **kwargs: Tham số từ khóa cho hàm
            
        Returns:
            str: Task ID
        """
        if not self._celery:
            await self.init()
            
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
            logger.error(f"Failed to enqueue task for {function_name}: {str(e)}")
            raise
    
    async def get_task_status(self, task_id: str) -> dict[str, Any]:
        """
        Lấy trạng thái của một task.
        
        Args:
            task_id: ID của task
            
        Returns:
            dict: Thông tin trạng thái của task
        """
        if not self._celery:
            await self.init()
            
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
            logger.error(f"Failed to get status for task {task_id}: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def health_check(self) -> bool:
        """Kiểm tra kết nối Redis và Celery."""
        try:
            if not self._celery:
                await self.init()
            return self._celery.control.inspect().ping() is not None
        except Exception as e:
            logger.error(f"Celery health check failed: {str(e)}")
            return False


# Singleton instance
redis_queue = RedisQueue()
