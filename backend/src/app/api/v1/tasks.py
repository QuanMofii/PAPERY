from typing import Any

from fastapi import APIRouter, Depends

from ...api.dependencies import rate_limiter_dependency
from ...core.utils.queue import redis_queue
from ...schemas import Job

router = APIRouter(tags=["tasks"])


@router.post("/tasks", response_model=Job, status_code=201, dependencies=[Depends(rate_limiter_dependency)])
async def create_task(message: str) -> dict[str, str]:
    """Create a new background task.

    Parameters
    ----------
    message: str
        The message or data to be processed by the task.

    Returns
    -------
    dict[str, str]
        A dictionary containing the ID of the created task.
    """
    task_id = await redis_queue.enqueue("sample_background_task", message)
    if task_id is None:
        raise Exception("Failed to create task - queue is not available")
    return {"id": task_id}


@router.get("/tasks/{task_id}")
async def get_task(task_id: str) -> dict[str, Any]:
    """Get information about a specific background task.

    Parameters
    ----------
    task_id: str
        The ID of the task.

    Returns
    -------
    dict[str, Any]
        A dictionary containing information about the task.
    """
    task_info = await redis_queue.get_task_status(task_id)
    return task_info
