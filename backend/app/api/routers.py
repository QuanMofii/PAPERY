from fastapi import APIRouter

from api.v1 import items, auth, users, verify

api_router = APIRouter()
api_router.include_router(auth.router, tags=["Auth"])
api_router.include_router(verify.router, tags=["Verify"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(items.router, tags=["Items"])