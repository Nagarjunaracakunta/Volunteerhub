from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./volunteerhub.db"
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    APP_NAME: str = "VolunteerHub"
    # Set this to your exact Vercel URL, e.g. https://volunteerhub.vercel.app
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
