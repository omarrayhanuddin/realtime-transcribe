import json, time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.helpers import get_vosk_model_ws
from app.config import Settings
from vosk import KaldiRecognizer
from app.models import TranscriptionSession


router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/transcribe")
async def websocket_transcribe(
    websocket: WebSocket, app_vosk_model=Depends(get_vosk_model_ws)
):
    # app_vosk_model = await get_vosk_model()
    await websocket.accept()
    await websocket.send_json(
        {"message": "Connection established. Start sending audio data."}
    )

    recognizer = KaldiRecognizer(app_vosk_model, Settings.SAMPLE_RATE)
    recognizer.SetWords(True)

    full_text: str = ""
    start_time = time.monotonic()

    try:
        while True:
            message = await websocket.receive()

            if "text" in message and message["text"] is not None:
                if message["text"] == "stop":
                    break
                # ignore other text messages
                continue

            audio_chunk = message.get("bytes", None)
            if audio_chunk is None:
                continue

            # Feed audio to recognizer
            if recognizer.AcceptWaveform(audio_chunk):
                result = json.loads(recognizer.Result())
                text_segment = result.get("text", "").strip()
                if text_segment:
                    if full_text:
                        full_text += " "
                    full_text += text_segment
                    await websocket.send_json({"type": "partial", "text": full_text})
            else:
                partial = (
                    json.loads(recognizer.PartialResult()).get("partial", "").strip()
                )
                if partial:
                    await websocket.send_json(
                        {"type": "partial", "text": f"{full_text} {partial}".strip()}
                    )

        # Finalize
        final_result = json.loads(recognizer.FinalResult())
        final_text = final_result.get("text", "").strip()
        if final_text:
            if full_text:
                full_text += " "
            full_text += final_text

        duration_seconds = time.monotonic() - start_time
        word_count = len(full_text.split()) if full_text else 0

        # Persist session
        db_session = await TranscriptionSession.create(
            duration_seconds=duration_seconds,
            word_count=word_count,
            transcript_text=full_text,
            model_name="vosk-model-small-en-us-0.15",
            language="en",
        )

        await websocket.send_json(
            {
                "type": "final",
                "text": full_text,
                "word_count": word_count,
                "duration_seconds": duration_seconds,
                "session_id": db_session.id,
            }
        )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()
