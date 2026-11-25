from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    app_name: str = "Relay60 API"
    app_version: str = "1.0.0"
    database_url: str = "sqlite+aiosqlite:///./relay60.db"
    auto_create_schema: bool = True
    cors_allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    admin_api_key: str = Field(default="dev-relay60-admin-key-change-me-2026", min_length=16)
    ip_hash_salt: str = Field(default="relay60-local-ip-salt-2026", min_length=12)
    rate_limit_leads_per_min: int = 5
    rate_limit_simulations_per_min: int = 15
    email_webhook_url: str = ""
    email_webhook_auth_token: str = ""
    sms_webhook_url: str = ""
    sms_webhook_auth_token: str = ""
    crm_webhook_url: str = ""
    crm_webhook_auth_token: str = ""
    founder_alert_webhook_url: str = ""
    webhook_timeout_seconds: float = 6.0

    @property
    def async_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+asyncpg://" + url[len("postgres://") :]
        if url.startswith("postgresql://"):
            return "postgresql+asyncpg://" + url[len("postgresql://") :]
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        return [part.strip() for part in self.cors_allowed_origins.split(",") if part.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
