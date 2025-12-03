from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    APP_NAME: str = "Realtime Transcription API"
    DATABASE_URL: str = "sqlite://transcriptions.db"
    VOSK_MODEL_PATH: str = "speech_to_text_models/vosk-model-small-en-us-0.15"
    SAMPLE_RATE: int = 16000
    model_config = SettingsConfigDict(env_file=".env")


Settings = Config()
