from collections.abc import AsyncGenerator, Callable
from contextlib import _AsyncGeneratorContextManager, asynccontextmanager
from typing import Any

import anyio
import fastapi
import redis.asyncio as redis

from arq import create_pool
from arq.connections import RedisSettings

from fastapi import APIRouter, Depends, FastAPI
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

from api.dependencies import get_current_superuser
from middleware.client_cache_middleware import ClientCacheMiddleware
from middleware.error_middleware import AppErrorHandlerMiddleware, DBErrorHandlerMiddleware, InternalServerErrorHandlerMiddleware, ValidationErrorHandlerMiddleware

from core.config import (
    AppSettings,
    CORSMiddlewareSettings,
    ClientSideCacheSettings,
    BaseSettings,
    EnvironmentOption,
    EnvironmentSettings,
    RedisCacheSettings,
    RedisQueueSettings,
    RedisRateLimiterSettings,
    settings,
)

from core.db.database import Base, async_engine as engine
from core.utils import cache, queue, rate_limit 
# from models import user,post,rate_limit,tier


from logging import getLogger
logger = getLogger(__name__)

# -------------- database --------------
async def create_tables() -> None:
    logger.info(f'Creating tables')
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# -------------- cache --------------
async def create_redis_cache_pool() -> None:
    logger.info(f'Creating redis cache pool with url: {settings.REDIS_CACHE_URL}')
    cache.pool = redis.ConnectionPool.from_url(settings.REDIS_CACHE_URL)
    cache.client = redis.Redis.from_pool(cache.pool)  # type: ignore


async def close_redis_cache_pool() -> None:
    logger.info(f'Closing redis cache pool')
    await cache.client.aclose()  # type: ignore


# -------------- queue --------------
async def create_redis_queue_pool() -> None:
    logger.info(f'Creating redis queue pool: {settings.REDIS_QUEUE_HOST}:{settings.REDIS_QUEUE_PORT}')
    queue.pool = await create_pool(RedisSettings(host=settings.REDIS_QUEUE_HOST, port=settings.REDIS_QUEUE_PORT))


async def close_redis_queue_pool() -> None:
    logger.info(f'Closing redis queue pool')
    await queue.pool.aclose()  # type: ignore


# -------------- rate limit --------------
async def create_redis_rate_limit_pool() -> None:
    logger.info(f'Creating redis rate limit pool with url: {settings.REDIS_RATE_LIMIT_URL}')
    rate_limit.pool = redis.ConnectionPool.from_url(settings.REDIS_RATE_LIMIT_URL)
    rate_limit.client = redis.Redis.from_pool(rate_limit.pool)  # type: ignore


async def close_redis_rate_limit_pool() -> None:
    logger.info(f'Closing redis rate limit pool')
    await rate_limit.client.aclose()  # type: ignore


# -------------- application --------------
async def set_threadpool_tokens(number_of_tokens: int = 100) -> None:
    limiter = anyio.to_thread.current_default_thread_limiter()
    limiter.total_tokens = number_of_tokens


def lifespan_factory(
    settings: (
        BaseSettings
        | AppSettings
        | CORSMiddlewareSettings
        | ClientSideCacheSettings
        | RedisCacheSettings
        | RedisQueueSettings
        | RedisRateLimiterSettings
        | EnvironmentSettings
    ),
    create_tables_on_start: bool = True,
) -> Callable[[FastAPI], _AsyncGeneratorContextManager[Any]]:
    """Factory to create a lifespan async context manager for a FastAPI app."""

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator:
        await set_threadpool_tokens()

        if isinstance(settings, BaseSettings) and create_tables_on_start:
            await create_tables()

        if isinstance(settings, RedisCacheSettings):
            await create_redis_cache_pool()

        if isinstance(settings, RedisQueueSettings):
            await create_redis_queue_pool()

        if isinstance(settings, RedisRateLimiterSettings):
            await create_redis_rate_limit_pool()

        yield

        if isinstance(settings, RedisCacheSettings):
            await close_redis_cache_pool()

        if isinstance(settings, RedisQueueSettings):
            await close_redis_queue_pool()

        if isinstance(settings, RedisRateLimiterSettings):
            await close_redis_rate_limit_pool()

    return lifespan


# -------------- application --------------
def create_application(
    router: APIRouter,
    settings: (
        BaseSettings
        | AppSettings
        | CORSMiddlewareSettings
        | ClientSideCacheSettings
        | RedisCacheSettings
        | RedisQueueSettings
        | RedisRateLimiterSettings
        | EnvironmentSettings
    ),
    create_tables_on_start: bool = True,
    **kwargs: Any,
) -> FastAPI:
    """Creates and configures a FastAPI application based on the provided settings.

    This function initializes a FastAPI application and configures it with various settings
    and handlers based on the type of the `settings` object provided.

    Parameters
    ----------
    router : APIRouter
        The APIRouter object containing the routes to be included in the FastAPI application.

    settings
        An instance representing the settings for configuring the FastAPI application.
        It determines the configuration applied:

        - AppSettings: Configures basic app metadata like name, description, contact, and license info.
        - DatabaseSettings: Adds event handlers for initializing database tables during startup.
        - RedisCacheSettings: Sets up event handlers for creating and closing a Redis cache pool.
        - ClientSideCacheSettings: Integrates middleware for client-side caching.
        - RedisQueueSettings: Sets up event handlers for creating and closing a Redis queue pool.
        - RedisRateLimiterSettings: Sets up event handlers for creating and closing a Redis rate limiter pool.
        - EnvironmentSettings: Conditionally sets documentation URLs and integrates custom routes for API documentation
          based on the environment type.

    create_tables_on_start : bool
        A flag to indicate whether to create database tables on application startup.
        Defaults to True.

    **kwargs
        Additional keyword arguments passed directly to the FastAPI constructor.

    Returns
    -------
    FastAPI
        A fully configured FastAPI application instance.

    The function configures the FastAPI application with different features and behaviors
    based on the provided settings. It includes setting up database connections, Redis pools
    for caching, queue, and rate limiting, client-side caching, and customizing the API documentation
    based on the environment settings.
    """
    # --- before creating application ---

    lifespan = lifespan_factory(settings, create_tables_on_start=create_tables_on_start)
    

    application = FastAPI(title=settings.APP_NAME,
                            description=settings.APP_DESCRIPTION,
                            contact={"name": settings.CONTACT_NAME, "email": settings.CONTACT_EMAIL},
                            license_info={"name": settings.LICENSE_NAME},
                            terms_of_service=settings.TERMS_OF_SERVICE,
                            lifespan=lifespan,
                           **kwargs)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS, 
        allow_credentials=True, 
        allow_methods=["*"],  
        allow_headers=["*"],  
    )
    application.include_router(router)

    if isinstance(settings, ClientSideCacheSettings):
        application.add_middleware(ClientCacheMiddleware, max_age=settings.CLIENT_CACHE_MAX_AGE)
    if isinstance(settings, AppErrorHandlerMiddleware):
         application.add_middleware(ValidationErrorHandlerMiddleware)
    if isinstance(settings, DBErrorHandlerMiddleware):
        application.add_middleware(DBErrorHandlerMiddleware)
    if isinstance(settings, InternalServerErrorHandlerMiddleware):
        application.add_middleware(InternalServerErrorHandlerMiddleware)

    if isinstance(settings, EnvironmentSettings):
        if settings.ENVIRONMENT != EnvironmentOption.PRODUCTION:
            docs_router = APIRouter()
            if settings.ENVIRONMENT != EnvironmentOption.LOCAL:
                docs_router = APIRouter(dependencies=[Depends(get_current_superuser)])

            @docs_router.get("/docs", include_in_schema=False)
            async def get_swagger_documentation() -> fastapi.responses.HTMLResponse:
                return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")

            @docs_router.get("/redoc", include_in_schema=False)
            async def get_redoc_documentation() -> fastapi.responses.HTMLResponse:
                return get_redoc_html(openapi_url="/openapi.json", title="docs")

            @docs_router.get("/openapi.json", include_in_schema=False)
            async def openapi() -> dict[str, Any]:
                out: dict = get_openapi(title=application.title, version=application.version, routes=application.routes)
                return out

            application.include_router(docs_router)
        logger.info(f'Environment: {settings.ENVIRONMENT}')
        return application
