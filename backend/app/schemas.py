from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator
from app.models import TranscriptionSession

TranscriptionSessionOut = pydantic_model_creator(
    TranscriptionSession, name="TranscriptionSessionOut"
)
