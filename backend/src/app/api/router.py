from fastapi import APIRouter

from api.v1 import login, logout, register,posts, rate_limits, tasks, tiers, users,utils
from core.config import settings
router = APIRouter(prefix=f"/api/v{settings.API_VERSION}")
router.include_router(login.router, tags=["login"])
router.include_router(logout.router, tags=["logout"])
router.include_router(register.router, tags=["register"])
router.include_router(users.router, tags=["users"])
router.include_router(posts.router, tags=["posts"])
router.include_router(tasks.router, tags=["tasks"])
router.include_router(tiers.router, tags=["tiers"])
router.include_router(rate_limits.router, tags=["rate_limits"])
router.include_router(utils.router, tags=["utils"])

