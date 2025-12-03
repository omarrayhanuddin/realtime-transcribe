from typing import List
from fastapi import APIRouter, HTTPException, status
from app.models import TranscriptionSession
from app.schemas import TranscriptionSessionOut

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/", response_model=List[TranscriptionSessionOut])
async def get_all_sessions(limit: int = 100, offset: int = 0):
    sessions = (
        await TranscriptionSession.all().limit(limit).offset(offset).order_by("-id")
    )
    return sessions


@router.get("/{session_id}", response_model=TranscriptionSessionOut)
async def get_session(session_id: int):
    session = await TranscriptionSession.get_or_none(id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"TranscriptionSession with id {session_id} not found",
        )
    return session
