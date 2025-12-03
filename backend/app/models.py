from tortoise import fields
from tortoise.models import Model


class TranscriptionSession(Model):
    id = fields.IntField(primary_key=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    duration_seconds = fields.FloatField(default=0.0)
    transcript_text = fields.TextField(default="")
    word_count = fields.IntField(default=0)
    model_name = fields.CharField(max_length=100, default="vosk-small-en")
    language = fields.CharField(max_length=50, default="en-US")

    def __str__(self):
        return f"TranscriptionSession {self.id} - {self.language} - {self.model_name}"

    class Meta:
        table = "transcription_sessions"
