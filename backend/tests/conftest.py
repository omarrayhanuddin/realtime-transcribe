import pytest
from tortoise import Tortoise
from httpx import AsyncClient, ASGITransport
from app.main import app


# 1. Database Fixture (Scope: Function)
@pytest.fixture(scope="function", autouse=True)
async def test_db():
    """
    Sets up a clean database for every test case using explicit async calls.
    This avoids the 'event loop is already running' error.
    """
    # SETUP: Initialize DB and create tables
    await Tortoise.init(db_url="sqlite://:memory:", modules={"models": ["app.models"]})
    await Tortoise.generate_schemas()

    yield

    # TEARDOWN: Drop DB and close connections
    await Tortoise._drop_databases()


# 2. Async Client Fixture
@pytest.fixture(scope="function")
async def client():
    """
    Creates an async test client for the FastAPI app.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# 3. Event Loop Fixture
@pytest.fixture(scope="session")
def event_loop():
    import asyncio

    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()
