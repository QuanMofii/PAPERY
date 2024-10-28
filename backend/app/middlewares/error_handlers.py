from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, InvalidRequestError, OperationalError, ProgrammingError
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
from utils.errors.base import AppError
from utils.logger import logger
import logging

logger = logging.getLogger('api_calls')

async def app_error_handler(request: Request, exc: AppError):
    """
    Handle custom application-level errors derived from AppError.
    Logs the error at the warning level and returns a JSON response with the appropriate HTTP status code.
    """
    message = exc.get_message()
    error_type = exc.__class__.__name__
    logger.warning(f"App error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Status: {exc.code} - Message: {message}")

    return JSONResponse(
        status_code=exc.code,
        content={
            "message": message,
            "error_type": exc.__class__.__name__
        }
    )

async def validation_error_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors or input-related exceptions (e.g., invalid data format).
    Logs the error at the warning level and returns a 400 Bad Request response.
    """
    error_types = [error['type'] for error in exc.errors()]
    logger.warning(f"Validation error: {error_types} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {exc.errors()}")
    return JSONResponse(
        status_code=400,
        content={"message": "Invalid request", "details": exc.__class__.__name__}
    )

async def db_error_handler(request: Request, exc: SQLAlchemyError):
    """
    Handle all SQLAlchemy-related errors.
    Logs the error with different levels depending on the type of database error, and returns an appropriate JSON response with the HTTP status code.
    """
    error_type = exc.__class__.__name__
    if isinstance(exc, IntegrityError):
        logger.error(f"Database Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {str(exc)}")
        return JSONResponse(
            status_code=409,
            content={"message": "Database integrity error occurred", "details": exc.__class__.__name__}
        )

    elif isinstance(exc, InvalidRequestError):
        logger.warning(f"Database Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=400,
            content={"message": "Invalid request to the database", "details": exc.__class__.__name__}
        )

    elif isinstance(exc, OperationalError):
        logger.critical(f"Database Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"message": "Operational error occurred in the database", "details": exc.__class__.__name__}
        )

    elif isinstance(exc, ProgrammingError):
        logger.error(f"Database Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"message": "Programming error in the database", "details": exc.__class__.__name__}
        )

    else:
        logger.error(f"Database Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Message: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"message": "A general database error occurred", "details": exc.__class__.__name__}
        )

async def internal_server_error_handler(request: Request, exc: Exception):
    """
    Handle all unexpected exceptions not caught by other error handlers.
    Logs the error at the error level and returns a 500 Internal Server Error response.
    """
    error_type = exc.__class__.__name__
    logger.error(f"Internal Server Error: {error_type} - From: {request.client.host}:{request.client.port} - To: {request.url} - Status: {500} - Message: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Ops! Something went wrong. Please try again later.", "details": exc.__class__.__name__}
    )

def register_error_handlers(app: FastAPI):
    """
    Register all custom error handlers for FastAPI.
    This includes handlers for validation errors, application-specific errors, database errors, and general exceptions.
    """
    app.add_exception_handler(RequestValidationError, validation_error_handler) 
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(SQLAlchemyError, db_error_handler)
    app.add_exception_handler(Exception, internal_server_error_handler)
