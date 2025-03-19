from typing import Any, Callable
import logging
from arq.connections import ArqRedis, RedisSettings, create_pool
from arq.worker import Worker, Function
from datetime import datetime

from ..config import settings

logger = logging.getLogger(__name__)

class TaskStatus:
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class RedisQueue:
    """Lớp quản lý Redis queue sử dụng arq."""
    
    def __init__(self):
        self._pool: ArqRedis | None = None
        self._functions: dict[str, Function] = {}
        
    async def init(self) -> None:
        """Khởi tạo kết nối Redis pool."""
        if not self._pool:
            try:
                redis_settings = RedisSettings(
                    host=settings.REDIS_QUEUE_HOST,
                    port=settings.REDIS_QUEUE_PORT
                )
                self._pool = await create_pool(redis_settings)
                logger.info("Redis queue pool initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Redis queue pool: {str(e)}")
                raise
    
    async def close(self) -> None:
        """Đóng kết nối Redis pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("Redis queue pool closed")
    
    def register_function(self, func: Callable, name: str | None = None) -> None:
        """
        Đăng ký một hàm để xử lý trong worker.
        
        Args:
            func: Hàm cần đăng ký
            name: Tên của hàm (mặc định là tên hàm)
        """
        function_name = name or func.__name__
        self._functions[function_name] = Function(
            func,
            name=function_name,
            on_success=self._on_success,
            on_failure=self._on_failure
        )
        logger.info(f"Registered function: {function_name}")
    
    async def _on_success(self, job_id: str, result: Any) -> None:
        """Callback khi task hoàn thành thành công."""
        await self._update_job_status(job_id, TaskStatus.COMPLETED, result=result)
        logger.info(f"Job {job_id} completed successfully with result: {result}")
    
    async def _on_failure(self, job_id: str, error: Exception) -> None:
        """Callback khi task thất bại."""
        await self._update_job_status(job_id, TaskStatus.FAILED, error=str(error))
        logger.error(f"Job {job_id} failed with error: {error}")
    
    async def _update_job_status(
        self,
        job_id: str,
        status: str,
        result: Any = None,
        error: str | None = None
    ) -> None:
        """Cập nhật trạng thái của task."""
        if not self._pool:
            await self.init()
            
        status_data = {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if result is not None:
            status_data["result"] = result
        if error is not None:
            status_data["error"] = error
            
        await self._pool.set(f"task_status:{job_id}", str(status_data))
    
    async def enqueue(
        self,
        function_name: str,
        *args: Any,
        _queue_name: str = "default",
        **kwargs: Any
    ) -> str:
        """
        Thêm một task vào queue.
        
        Args:
            function_name: Tên hàm đã đăng ký
            *args: Tham số vị trí cho hàm
            _queue_name: Tên của queue (mặc định là "default")
            **kwargs: Tham số từ khóa cho hàm
            
        Returns:
            str: Job ID của task
        """
        if not self._pool:
            await self.init()
            
        try:
            job = await self._pool.enqueue_job(
                function_name,
                *args,
                _queue_name=_queue_name,
                **kwargs
            )
            
            # Khởi tạo trạng thái task
            await self._update_job_status(job.job_id, TaskStatus.PENDING)
            
            logger.info(f"Enqueued job {job.job_id} for function {function_name}")
            return job.job_id
        except Exception as e:
            logger.error(f"Failed to enqueue job for {function_name}: {str(e)}")
            raise
    
    async def get_job_status(self, job_id: str) -> dict[str, Any]:
        """
        Lấy trạng thái của một task.
        
        Args:
            job_id: ID của task
            
        Returns:
            dict: Thông tin trạng thái của task
        """
        if not self._pool:
            await self.init()
            
        try:
            status_data = await self._pool.get(f"task_status:{job_id}")
            if status_data:
                return eval(status_data)  # Convert string to dict
            return {"status": "unknown"}
        except Exception as e:
            logger.error(f"Failed to get status for job {job_id}: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def get_worker(self, queue_name: str = "default") -> Worker:
        """
        Tạo worker để xử lý các task trong queue.
        
        Args:
            queue_name: Tên của queue cần xử lý
            
        Returns:
            Worker: Worker instance
        """
        redis_settings = RedisSettings(
            host=settings.REDIS_QUEUE_HOST,
            port=settings.REDIS_QUEUE_PORT
        )
        
        return Worker(
            functions=list(self._functions.values()),
            redis_settings=redis_settings,
            queue_name=queue_name
        )


# Singleton instance
redis_queue = RedisQueue()
