from collections.abc import AsyncGenerator, Callable
from contextlib import _AsyncGeneratorContextManager, asynccontextmanager
from typing import Any

import anyio
import fastapi
from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from ..api.dependencies import get_current_superuser
from ..api import router as api_router
from ..middleware.client_cache_middleware import ClientCacheMiddleware
from ..models import *
from .config import (
    AppSettings,
    ClientSideCacheSettings,
    DatabaseSettings,
    EnvironmentOption,
    EnvironmentSettings,
    RedisCacheSettings,
    RedisQueueSettings,
    RedisRateLimiterSettings,
    settings,
)

from .db.database import Base
from .db.database import async_engine as engine
from .utils.redis import redis
from .logger import logging

logger = logging.getLogger(__name__)

# -------------- database --------------
async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# -------------- redis --------------
async def init_redis() -> bool:
    """Khởi tạo Redis connection."""
    try:
        await redis.init()
        logger.info("Redis connection initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Redis - {e}")
        # Không raise exception để ứng dụng vẫn có thể chạy
        return False

async def close_redis() -> None:
    """Đóng kết nối Redis."""
    try:
        await redis.close()
        logger.info("Redis connection closed successfully")
    except Exception as e:
        logger.error(f"Error closing Redis connection - {e}")

async def check_redis_health() -> bool:
    """Kiểm tra sức khỏe của Redis."""
    try:
        return await redis.health_check()
    except Exception as e:
        logger.error(f"Redis health check failed - {e}")
        return False

# -------------- application --------------
def lifespan_factory(
    settings: (
        DatabaseSettings
        | RedisCacheSettings
        | AppSettings
        | ClientSideCacheSettings
        | RedisQueueSettings
        | RedisRateLimiterSettings
        | EnvironmentSettings
    ),
    create_tables_on_start: bool = True,
) -> Callable[[FastAPI], _AsyncGeneratorContextManager[Any]]:
    """Factory to create a lifespan async context manager for a FastAPI app."""

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator:
        from asyncio import Event

        initialization_complete = Event()
        app.state.initialization_complete = initialization_complete

        try:
            if isinstance(settings, (RedisCacheSettings, RedisQueueSettings, RedisRateLimiterSettings)):
                redis_initialized = await init_redis()
                if not redis_initialized:
                    logger.warning("Redis initialization failed, some features may be limited")
                else:
                    if not await check_redis_health():
                        logger.warning("Redis health check failed, some features may be limited")

            initialization_complete.set()
            yield

        finally:
            if isinstance(settings, (RedisCacheSettings, RedisQueueSettings, RedisRateLimiterSettings)):
                await close_redis()

    return lifespan

# -------------- application --------------
def create_application(
    router: APIRouter,
    settings: (
        DatabaseSettings
        | RedisCacheSettings
        | AppSettings
        | ClientSideCacheSettings
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

    # Get app settings from the settings object
    app_name = getattr(settings, 'APP_NAME', 'PAPERY API')
    app_description = getattr(settings, 'APP_DESCRIPTION', 'PAPERY API Documentation')
    contact_name = getattr(settings, 'CONTACT_NAME', 'PAPERY Team')
    contact_email = getattr(settings, 'CONTACT_EMAIL', 'contact@papery.com')
    license_name = getattr(settings, 'LICENSE_NAME', 'MIT')
    terms_of_service = getattr(settings, 'TERMS_OF_SERVICE', 'https://papery.com/terms')
    
    # Get CORS settings
    cors_origins = getattr(settings, 'CORS_ORIGINS', ['*'])
    cors_credentials = getattr(settings, 'CORS_CREDENTIALS', True)
    cors_methods = getattr(settings, 'CORS_METHODS', ['*'])
    cors_headers = getattr(settings, 'CORS_HEADERS', ['*'])

    application = FastAPI(
        title=app_name,
        description=app_description,
        contact={"name": contact_name, "email": contact_email},
        license_info={"name": license_name},
        terms_of_service=terms_of_service,
        lifespan=lifespan,
        **kwargs
    )
    
    # Add CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=cors_credentials,
        allow_methods=cors_methods,
        allow_headers=cors_headers,
    )

    application.include_router(router)

    if isinstance(settings, ClientSideCacheSettings):
        application.add_middleware(ClientCacheMiddleware, max_age=settings.CLIENT_CACHE_MAX_AGE)

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

    return application
