from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.routing import APIRoute

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

import redis.asyncio as redis
from redis.asyncio.connection import ConnectionPool

import logging

from api.router import api_router
from core.config import settings
from core.redis import get_redis_client

from utils.logger import logger
from middlewares.error_handlers import  register_error_handlers
from middlewares.middle_ware import register_middleware


description = """
This is a REST API Ultimate example.

This REST API is able to:
- Authentication & Authorization
- Restful API 
- Responsitory & Domain
- Caching Redis
- MiddleWares
    """
 
def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

@asynccontextmanager
async def lifespan(_: FastAPI):
    redis_client = await get_redis_client()
    FastAPICache.init(RedisBackend(redis_client), prefix="fastapi-cache")
    yield


def create_application() -> FastAPI:
    application = FastAPI(title=settings.APP_NAME,
                        generate_unique_id_function=custom_generate_unique_id,
                        description=description,
                        version=settings.APP_VERSION,
                        license_info=settings.LICENSE_INFO,
                        contact= settings.CONTACT,
                        terms_of_service=settings.TERMS_OF_SERVICE,
                        openapi_url=f"{settings.API_VERSION}/openapi.json",
                        docs_url=f"{settings.API_VERSION}/docs",
                        redoc_url=f"{settings.API_VERSION}/redoc",
                        lifespan=lifespan,
                        )
    register_middleware(application)
    register_error_handlers(application)
    
    # application.add_event_handler("startup", create_redis_pool)
    # application.add_event_handler("shutdown", close_redis_pool)

    application.include_router(api_router , prefix= settings.API_VERSION)

    return application

app = create_application()

if __name__ == "__main__":
    import uvicorn
    logger.info("Environment: " + settings.ENVIRONMENT) 
    logger.info("Starting server...")
    logger.info(f"Server run at: {settings.server_host}")
    uvicorn.run("main:app", host=settings.DOMAIN, port=settings.DOMAIN_HOST, reload=settings.RELOAD)


