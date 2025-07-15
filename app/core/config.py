from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    OPENAI_API_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SMTP_USER: str
    SMTP_PASS: str

    class Config:
        env_file = ".env"

settings = Settings()
