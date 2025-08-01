from fastapi import APIRouter

from .rate_limits import router as rate_limits_router
from .tasks import router as tasks_router
from .tiers import router as tiers_router
from .users import router as users_router
from .auth import router as auth_router
from .projects import router as projects_router
from .chat_sessions import router as chat_sessions_router
from .documents import router as documents_router
# from .chat_message import router as chat_message_router

router = APIRouter(prefix="/v1")
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(projects_router)
router.include_router(chat_sessions_router)
# router.include_router(chat_message_router)
router.include_router(documents_router)
router.include_router(tasks_router)
router.include_router(tiers_router)
router.include_router(rate_limits_router)
