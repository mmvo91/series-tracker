import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = ""
    sqlalchemy_echo: bool = False

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    # API Keys
    omdb_api_key: Optional[str] = None
    youtube_api_key: Optional[str] = None

    # Pagination
    paginate_page_size: int = 12

    # CORS
    cors_origins: list = ["http://localhost:3000"]

    # Environment
    environment: str = "production"

    class Config:
        env_file = ".env"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Build database URL if not provided
        if not self.database_url:
            if self.environment == "development":
                username = os.getenv('SQLALCHEMY_USERNAME', '')
                password = os.getenv('SQLALCHEMY_PASSWORD', '')
                db_name = 'series'
                self.database_url = f'postgresql://{username}:{password}@localhost:5432/{db_name}'
            else:
                self.database_url = os.getenv('DATABASE_URL', '')
                # Fix for Heroku postgres:// to postgresql://
                if self.database_url.startswith('postgres://'):
                    self.database_url = self.database_url.replace('postgres://', 'postgresql://', 1)


# Create settings instance
settings = Settings(
    jwt_secret_key=os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production'),
    omdb_api_key=os.getenv('REACT_APP_OMDB_API_KEY'),
    youtube_api_key=os.getenv('YOUTUBE_API_KEY'),
    environment=os.getenv('ENVIRONMENT', os.getenv('FLASK_ENV', 'production'))
)
