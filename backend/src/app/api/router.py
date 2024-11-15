from fastapi import APIRouter

from api.v1 import login, logout, posts, rate_limits, tasks, tiers, users

router = APIRouter(prefix="/api")
router.include_router(login.router, tags=["login"])
router.include_router(logout.router, tags=["logout"])
router.include_router(users.router, tags=["users"])
router.include_router(posts.router, tags=["posts"])
router.include_router(tasks.router, tags=["tasks"])
router.include_router(tiers.router, tags=["tiers"])
router.include_router(rate_limits.router, tags=["rate_limits"])
