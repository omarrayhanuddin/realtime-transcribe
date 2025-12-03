import pytest
from app.models import TranscriptionSession


# 1. Test GET /sessions/ (List All)
@pytest.mark.asyncio
async def test_get_all_sessions(client):
    """
    Test that we can retrieve a list of sessions.
    """
    s1 = await TranscriptionSession.create(
        transcript_text="First Session", duration_seconds=10.0
    )
    s2 = await TranscriptionSession.create(
        transcript_text="Second Session", duration_seconds=20.0
    )

    response = await client.get("/sessions/")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["id"] == s2.id
    assert data[1]["id"] == s1.id
    assert data[0]["transcript_text"] == "Second Session"


# 2. Test Pagination (Limit/Offset)
@pytest.mark.asyncio
async def test_get_sessions_pagination(client):
    """
    Test that limit and offset query parameters work.
    """
    for i in range(1, 5):
        await TranscriptionSession.create(transcript_text=f"Session {i}")
    response = await client.get("/sessions/?limit=2&offset=2")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["transcript_text"] == "Session 2"
    assert data[1]["transcript_text"] == "Session 1"


# 3. Test GET /sessions/{id} (Success)
@pytest.mark.asyncio
async def test_get_single_session(client):
    """
    Test retrieving a specific session by ID.
    """
    obj = await TranscriptionSession.create(
        transcript_text="Specific Content", model_name="whisper-large"
    )

    response = await client.get(f"/sessions/{obj.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == obj.id
    assert data["transcript_text"] == "Specific Content"
    assert data["model_name"] == "whisper-large"


# 4. Test GET /sessions/{id} (Not Found)
@pytest.mark.asyncio
async def test_get_session_not_found(client):
    """
    Test that requesting a non-existent ID returns 404.
    """
    response = await client.get("/sessions/999999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "TranscriptionSession with id 999999 not found"
