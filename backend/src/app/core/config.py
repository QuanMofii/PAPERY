from enum import Enum
import os
import secrets

from pydantic_settings import BaseSettings, SettingsConfigDict
# from pydantic import model_validator

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, "..", "..", ".env")
class BaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=env_path, env_ignore_empty=True, extra="ignore"
    )
    
    ENVIRONMENT: str
    @property
    def env_file(self) -> str:
        env_files = {
            "local": ".env.local",
            "staging": ".env.staging",
            "production": ".env.production",
        }
        return env_files.get(self.ENVIRONMENT, ".env.local")

class AppSettings(BaseConfig):
    APP_NAME: str = "FastAPI app"
    APP_DESCRIPTION: str | None = None
    APP_VERSION: str | None = None
    LICENSE_NAME: str | None = None
    CONTACT_NAME: str | None = None
    CONTACT_EMAIL: str | None = None

    BACKEND_HOST: str = "localhost"
    BACKEND_PORT: int = 8000
    API_VERSION: str = "v1"
    RELOAD: bool = False

class CryptSettings(BaseConfig):
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7


class BaseSettings(BaseConfig):
    pass

class DatabaseType(str, Enum):
    POSTGRES = "postgres"
    MYSQL = "mysql"
    SQLITE = "sqlite"
class DatabaseSettings(BaseConfig):
    DATABASE_TYPE: DatabaseType = DatabaseType.POSTGRES
    DATABASE_USER: str | None = None
    DATABASE_PASSWORD: str | None = None
    DATABASE_SERVER: str = "localhost"
    DATABASE_PORT: int | None = None
    DATABASE_NAME: str | None = None
    SQLITE_DB: str = "./sql_app.db"

    POSTGRES_PREFIX: str = "postgresql+asyncpg://"
    MYSQL_PREFIX: str = "mysql+aiomysql://"
    SQLITE_PREFIX: str = "sqlite+aiosqlite:///"

    @property
    def database_url(self) -> str:
        if self.DATABASE_TYPE == DatabaseType.POSTGRES:
            return f"{self.POSTGRES_PREFIX}{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_SERVER}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        elif self.DATABASE_TYPE == DatabaseType.MYSQL:
            return f"{self.MYSQL_PREFIX}{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_SERVER}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        elif self.DATABASE_TYPE == DatabaseType.SQLITE:
            return f"{self.SQLITE_PREFIX}{self.SQLITE_DB}"
        raise ValueError("Unsupported DATABASE_TYPE")
class FirstUserSettings(BaseConfig):
    ADMIN_NAME: str = "admin"
    ADMIN_EMAIL: str = "admin@admin.com"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "!Ch4ng3Th1sP4ssW0rd!"


class TestSettings(BaseSettings):
    ...


class RedisCacheSettings(BaseConfig):
    REDIS_CACHE_HOST: str = "localhost"
    REDIS_CACHE_PORT: int = 6379
    REDIS_CACHE_URL: str = f"redis://{REDIS_CACHE_HOST}:{REDIS_CACHE_PORT}"


class ClientSideCacheSettings(BaseConfig):
    CLIENT_CACHE_MAX_AGE: int = 60


class RedisQueueSettings(BaseConfig):
    REDIS_QUEUE_HOST: str = "localhost"
    REDIS_QUEUE_PORT: int = 6379


class RedisRateLimiterSettings(BaseConfig):
    REDIS_RATE_LIMIT_HOST: str = "localhost"
    REDIS_RATE_LIMIT_PORT: int = 6379
    REDIS_RATE_LIMIT_URL: str = f"redis://{REDIS_RATE_LIMIT_HOST}:{REDIS_RATE_LIMIT_PORT}"


class DefaultRateLimitSettings(BaseConfig):
    DEFAULT_RATE_LIMIT_LIMIT: int = 10
    DEFAULT_RATE_LIMIT_PERIOD: int = 3600


class EnvironmentOption(str,Enum):
    LOCAL = "local"
    STAGING = "staging"
    PRODUCTION = "production"

class EnvironmentSettings(BaseConfig):
    ENVIRONMENT: EnvironmentOption = EnvironmentOption.LOCAL
   

class Settings(
    AppSettings,
    CryptSettings,
    DatabaseSettings,
    FirstUserSettings,
    RedisCacheSettings,
    RedisQueueSettings,
    RedisRateLimiterSettings,
    DefaultRateLimitSettings,
    ClientSideCacheSettings,
    EnvironmentSettings,
):
    pass

settings = Settings()
