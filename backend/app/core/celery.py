from celery import Celery
from core.config import settings

celery = Celery(
    "async_task",
    broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0",
    backend=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/1",
    include="app.api.celery_task", 
)

celery.conf.update(

    task_serializer='json',
    accept_content=['json'], 
    result_serializer='json',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60, 
    task_soft_time_limit=60 * 60, 
)
celery.autodiscover_tasks()