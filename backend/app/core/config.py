from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "WhatsApp AI SaaS"
    database_url: str = "sqlite:///./whatsapp_saas.db"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    whatsapp_verify_token: str = "verify-me"

    cors_origins: str = "*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
