from celery import Celery
from ..config import settings
from .functions import sample_background_task, startup, shutdown
import asyncio

# -------- Celery settings --------
celery_app = Celery(
    'tasks',
    broker=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/0',
    backend=f'redis://{settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}/1'
)

# Cấu hình Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour
    worker_max_tasks_per_child=1000,
    worker_max_memory_per_child=200000  # 200MB
)

# Đăng ký các task
celery_app.task(name='sample_background_task')(sample_background_task)

# Event handlers
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    """Cấu hình các task định kỳ."""
    pass

@celery_app.on_after_finalize.connect
def setup_startup(sender, **kwargs):
    """Khởi tạo worker."""
    asyncio.run(startup())

@celery_app.on_after_finalize.connect
def setup_shutdown(sender, **kwargs):
    """Đóng worker."""
    asyncio.run(shutdown())
