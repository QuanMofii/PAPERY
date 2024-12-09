import logging
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

# from core.exceptions.http_exceptions import (
#     BadRequestException,
#     NotFoundException,
#     ForbiddenException,
#     UnauthorizedException,
#     UnprocessableEntityException,
#     DuplicateValueException,
#     RateLimitException,
# )

logger = logging.getLogger("app-logger")


class AppErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware để log tất cả các lỗi liên quan đến input/output của API"""
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.error(f"Unhandled Exception: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error"}
            )


class ValidationErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware để log lỗi validation (RequestValidationError)"""
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except RequestValidationError as exc:
            logger.warning(f"Validation Error: {exc}", exc_info=True)
            return JSONResponse(
                status_code=422,
                content={"detail": exc.errors()}
            )


class DBErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware để log các lỗi liên quan đến Database (SQLAlchemy, Redis, etc.)"""
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except SQLAlchemyError as exc:
            logger.error(f"Database Error: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Database Error"}
            )


class InternalServerErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware để log lỗi hệ thống không mong muốn (Exception)"""
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.critical(f"Unhandled Internal Error: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error"}
            )
