from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import Settings
from app.db import init_db
from app.routers import sessions, websocket
from vosk import Model
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_path = Settings.VOSK_MODEL_PATH
    if not os.path.isdir(model_path):
        raise RuntimeError(f"Vosk model not found at {model_path}. Please download it.")
    app.state.vosk_model = Model(model_path)
    yield


app = FastAPI(title=Settings.APP_NAME, lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db(app)
app.include_router(sessions.router)
app.include_router(websocket.router)
