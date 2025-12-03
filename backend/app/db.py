from app.config import Settings
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI


TORTOISE_ORM = {
    "connections": {"default": Settings.DATABASE_URL},
    "apps": {
        "models": {
            "models": [
                "app.models",
                "aerich.models",
            ],
            "default_connection": "default",
        },
    },
}


def init_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=True,
        add_exception_handlers=True,
    )
