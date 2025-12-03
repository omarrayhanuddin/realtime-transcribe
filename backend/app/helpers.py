from vosk import Model
from fastapi import WebSocket


def get_vosk_model_from_app(app) -> Model:
    return app.state.vosk_model


def get_vosk_model_ws(websocket: WebSocket):
    return get_vosk_model_from_app(websocket.app)
