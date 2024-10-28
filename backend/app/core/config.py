import secrets
import warnings
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    HttpUrl,
    computed_field,
    model_validator,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    CONTACT_NAME: str
    CONTACT_URL: str
    CONTACT_EMAIL: str

    LICENSE_NAME: str
    LICENSE_URL: str

    TERMS_OF_SERVICE: str

    @property
    def LICENSE_INFO(self):
        return {
            "name": self.LICENSE_NAME,
            "url": self.LICENSE_URL
        }

    @property
    def CONTACT(self):
        return {
            "name": self.CONTACT_NAME,
            "url": self.CONTACT_URL,
            "email": self.CONTACT_EMAIL
        }

    APP_NAME: str
    APP_VERSION: str = "1.0.0"
    DOMAIN: str = "localhost"
    DOMAIN_HOST: int = 8000
    DOMAIN_FRONTEND: str = "localhost"
    DOMAIN_HOST_FRONTEND: int = 3000
    ENVIRONMENT: Literal["local", "development", "production"] = "local"
    RELOAD: bool = True

    API_VERSION: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    # 60 seconds * 24 hours * 1 days = 1 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1
    # 60 seconds * 24 hours * 14 days = 14days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 14
    # 5 minutes
    VERIFY_CODE_EXPIRE_MINUTES: int = 60 * 5


    @model_validator(mode="after")
    def adjust_reload_based_on_env(self) -> Self:
        if self.ENVIRONMENT == "production":
            self.RELOAD = False
        return self
    

    @computed_field(return_type=str)  # type: ignore[prop-decorator]
    def server_host(self) -> str:
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}:{self.DOMAIN_HOST}"
        return f"https://{self.DOMAIN}:{self.DOMAIN_HOST}"
    
    @computed_field(return_type=str)  # type: ignore[prop-decorator]
    def frontend_host(self) -> str:
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN_FRONTEND}:{self.DOMAIN_HOST_FRONTEND}"
        return f"https://{self.DOMAIN_HOST_FRONTEND}:{self.DOMAIN_HOST_FRONTEND}"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []
    ALLOWED_HOSTS: Annotated[
        list[str] | str, BeforeValidator(parse_cors)
    ] = []

    DB_HOST: str
    DB_PORT: int = 5432
    DB_USER: str
    DB_PASSWORD: str = ""
    DB: str = ""
    DB_SCHEMA: str 

    @computed_field(return_type=str)  # type: ignore[prop-decorator]
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return MultiHostUrl.build(
            scheme=self.DB_SCHEMA,
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            path=self.DB,
        )

    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None

    REDIS_HOST: str
    REDIS_PORT: int = 6379

    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = None
    FRONTEND_LINK_LOGIN: HttpUrl = "http://localhost:3000/login"
    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.APP_NAME
        return self

    @computed_field(return_type=bool) # type: ignore[prop-decorator]
    def emails_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)
    
    GOOGLE_CLIENT_ID:str ="your_google_client_id"
    GOOGLE_CLIENT_SECRET:str ="your_google_client_secret"
    GITHUB_CLIENT_ID:str ="your_github_client_id"
    GITHUB_CLIENT_SECRET:str ="your_github_client_secret"

    def _check_default_secret(self, var_name: str, value: str, default_value: str | None) -> None:
        if value == default_value:
            message = (
                f'The value of {var_name} is set to the default: "{value}". '
                "Please change it to a secure value."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY, "123456")
        self._check_default_secret("DB_PASSWORD", self.DB_PASSWORD,"123456")
        self._check_default_secret("SMTP_PASSWORD", self.SMTP_PASSWORD, "123456")
        return self

settings = Settings()  
