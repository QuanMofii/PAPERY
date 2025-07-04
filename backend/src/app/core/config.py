import os
from enum import Enum

from pydantic_settings import BaseSettings
from starlette.config import Config

import json
from typing import List, Union
from pydantic import field_validator

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, "..", "..", ".env")
config = Config(env_path)


class AppSettings(BaseSettings):
    APP_NAME: str = config("APP_NAME", default="FastAPI app")
    APP_DESCRIPTION: str | None = config("APP_DESCRIPTION", default=None)
    APP_VERSION: str | None = config("APP_VERSION", default=None)
    LICENSE_NAME: str | None = config("LICENSE", default=None)
    TERMS_OF_SERVICE: str | None = config("TERMS_OF_SERVICE", default=None)
    CONTACT_NAME: str | None = config("CONTACT_NAME", default=None)
    CONTACT_EMAIL: str | None = config("CONTACT_EMAIL", default=None)


class CryptSettings(BaseSettings):
    SECRET_KEY: str = config("SECRET_KEY")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = config("REFRESH_TOKEN_EXPIRE_DAYS", default=7)
    RESET_PASSWORD_EXPIRE_MINUTES: int = config("RESET_PASSWORD_EXPIRE_MINUTES", default=8)
    VERIFY_ACCOUNT_EXPIRE_MINUTES: int = config("VERIFY_ACCOUNT_EXPIRE_MINUTES", default=8)

class DatabaseSettings(BaseSettings):
    pass


class SQLiteSettings(DatabaseSettings):
    SQLITE_URI: str = config("SQLITE_URI", default="./sql_app.db")
    SQLITE_SYNC_PREFIX: str = config("SQLITE_SYNC_PREFIX", default="sqlite:///")
    SQLITE_ASYNC_PREFIX: str = config("SQLITE_ASYNC_PREFIX", default="sqlite+aiosqlite:///")


class MySQLSettings(DatabaseSettings):
    MYSQL_USER: str = config("MYSQL_USER", default="username")
    MYSQL_PASSWORD: str = config("MYSQL_PASSWORD", default="password")
    MYSQL_SERVER: str = config("MYSQL_SERVER", default="localhost")
    MYSQL_PORT: int = config("MYSQL_PORT", default=5432)
    MYSQL_DB: str = config("MYSQL_DB", default="dbname")
    MYSQL_URI: str = f"{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_SERVER}:{MYSQL_PORT}/{MYSQL_DB}"
    MYSQL_SYNC_PREFIX: str = config("MYSQL_SYNC_PREFIX", default="mysql://")
    MYSQL_ASYNC_PREFIX: str = config("MYSQL_ASYNC_PREFIX", default="mysql+aiomysql://")
    MYSQL_URL: str | None = config("MYSQL_URL", default=None)


class PostgresSettings(DatabaseSettings):
    POSTGRES_USER: str = config("POSTGRES_USER", default="postgres")
    POSTGRES_PASSWORD: str = config("POSTGRES_PASSWORD", default="postgres")
    POSTGRES_SERVER: str = config("POSTGRES_SERVER", default="localhost")
    POSTGRES_PORT: int = config("POSTGRES_PORT", default=5432)
    POSTGRES_DB: str = config("POSTGRES_DB", default="postgres")
    POSTGRES_SYNC_PREFIX: str = config("POSTGRES_SYNC_PREFIX", default="postgresql://")
    POSTGRES_ASYNC_PREFIX: str = config("POSTGRES_ASYNC_PREFIX", default="postgresql+asyncpg://")
    POSTGRES_URI: str = f"{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    POSTGRES_URL: str | None = config("POSTGRES_URL", default=None)


class FirstUserSettings(BaseSettings):
    ADMIN_EMAIL: str = config("ADMIN_EMAIL", default="admin@admin.com")
    ADMIN_USERNAME: str = config("ADMIN_USERNAME", default="admin")
    ADMIN_PASSWORD: str = config("ADMIN_PASSWORD", default="!Ch4ng3Th1sP4ssW0rd!")
    ADMIN_AUTH_TYPE: str = config("ADMIN_AUTH_TYPE", default="local")


class TestSettings(BaseSettings):
    ...


class RedisCacheSettings(BaseSettings):
    REDIS_CACHE_HOST: str = config("REDIS_CACHE_HOST", default="localhost")
    REDIS_CACHE_PORT: int = config("REDIS_CACHE_PORT", default=6379)
    REDIS_CACHE_URL: str = f"redis://{REDIS_CACHE_HOST}:{REDIS_CACHE_PORT}"


class ClientSideCacheSettings(BaseSettings):
    CLIENT_CACHE_MAX_AGE: int = config("CLIENT_CACHE_MAX_AGE", default=60)


class RedisQueueSettings(BaseSettings):
    REDIS_QUEUE_HOST: str = config("REDIS_QUEUE_HOST", default="localhost")
    REDIS_QUEUE_PORT: int = config("REDIS_QUEUE_PORT", default=6379)


class RedisRateLimiterSettings(BaseSettings):
    REDIS_RATE_LIMIT_HOST: str = config("REDIS_RATE_LIMIT_HOST", default="localhost")
    REDIS_RATE_LIMIT_PORT: int = config("REDIS_RATE_LIMIT_PORT", default=6379)
    REDIS_RATE_LIMIT_URL: str = f"redis://{REDIS_RATE_LIMIT_HOST}:{REDIS_RATE_LIMIT_PORT}"


class DefaultRateLimitSettings(BaseSettings):
    DEFAULT_RATE_LIMIT_LIMIT: int = config("DEFAULT_RATE_LIMIT_LIMIT", default=10)
    DEFAULT_RATE_LIMIT_PERIOD: int = config("DEFAULT_RATE_LIMIT_PERIOD", default=3600)


class EmailSettings(BaseSettings):
    EMAILS_FROM_EMAIL: str = config("EMAILS_FROM_EMAIL", default="noreply@example.com")
    EMAILS_FROM_NAME: str = config("EMAILS_FROM_NAME", default="Project Name")
    FRONTEND_LINK_ACCOUNT_ACTIVATION: str = config("FRONTEND_LINK_ACCOUNT_ACTIVATION", default="http://localhost:3000/auth/activation")
    FRONTEND_LINK_CHANGE_PASSWORD: str = config("FRONTEND_LINK_CHANGE_PASSWORD", default="http://localhost:3000/auth/recovery/changepassword")
    SMTP_HOST: str = config("SMTP_HOST", default="smtp.gmail.com")
    SMTP_PORT: int = config("SMTP_PORT", cast=int, default=587)
    SMTP_USER: str = config("SMTP_USER", default="")
    SMTP_PASSWORD: str = config("SMTP_PASSWORD", default="")
    SMTP_TLS: bool = config("SMTP_TLS", cast=bool, default=False)
    SMTP_SSL: bool = config("SMTP_SSL", cast=bool, default=True)
    emails_enabled: bool = True if SMTP_USER and SMTP_PASSWORD else False


class EnvironmentOption(Enum):
    LOCAL = "local"
    STAGING = "staging"
    PRODUCTION = "production"


class EnvironmentSettings(BaseSettings):
    ENVIRONMENT: EnvironmentOption = config("ENVIRONMENT", cast=EnvironmentOption, default="local")  # type: ignore


class CorsSettings(BaseSettings):
    CORS_ORIGINS: list[str] = config("CORS_ORIGINS", default=["http://localhost:3000"])
    CORS_METHODS: list[str] = config("CORS_METHODS", default=["*"])
    CORS_HEADERS: list[str] = config("CORS_HEADERS", default=["*"])
    CORS_CREDENTIALS: bool = config("CORS_CREDENTIALS", cast=bool, default=True)

    @field_validator("CORS_ORIGINS", "CORS_METHODS", "CORS_HEADERS", mode="before")
    @classmethod
    def parse_list(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            # Fallback: CSV string "a,b"
            return [i.strip() for i in v.split(",")]
        raise ValueError("Invalid value for CORS field, must be list or JSON string.")


class MinioSettings(BaseSettings):
    MINIO_ENDPOINT: str = config("MINIO_ENDPOINT", default="localhost:9000")
    MINIO_ACCESS_KEY: str = config("MINIO_ACCESS_KEY", default="minioadmin")
    MINIO_SECRET_KEY: str = config("MINIO_SECRET_KEY", default="minioadmin")
    MINIO_BUCKET_NAME: str = config("MINIO_BUCKET_NAME", default="papery-files")
    MINIO_SECURE: bool = config("MINIO_SECURE", cast=bool, default=False)


class Settings(
    AppSettings,
    PostgresSettings,
    CryptSettings,
    FirstUserSettings,
    TestSettings,
    RedisCacheSettings,
    ClientSideCacheSettings,
    RedisQueueSettings,
    RedisRateLimiterSettings,
    DefaultRateLimitSettings,
    EmailSettings,
    EnvironmentSettings,
    CorsSettings,
    MinioSettings,
):
    pass


settings = Settings()
