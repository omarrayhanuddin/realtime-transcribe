# 🎤 Real-Time Microphone Transcription — Backend
**FastAPI + WebSockets + Tortoise ORM + Vosk (CPU-only) + uv**

This backend powers a real-time speech-to-text system using Vosk for offline transcription and FastAPI WebSockets for streaming audio.

---

## 🚀 Features
- Real-time audio streaming using **WebSockets**
- Offline transcription using **Vosk Small Model** (bundled by default)
- **Tortoise ORM** async database layer
- **SQLite** by default, Postgres-ready
- Session storage: transcript, duration, word count, timestamps
- Minimal backend tests
- Dockerized

---

## 📁 Project Structure
```
backend/
├── app/
│   ├── routers/
│   │   ├── sessions.py
│   │   ├── websocket.py
│   ├── config.py
│   ├── db.py
│   ├── helpers.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│
├── speech_to_text_models/
│   └── vosk-model-small-en-us-0.15/
│
├── migrations/
├── tests/
│
├── .env
├── .env.example
├── pyproject.toml
├── uv.lock
├── Dockerfile
└── .dockerignore
```

---

## 🗣️ Vosk Model Included (No Download Required)
The backend ships with the **Vosk Small English Model**:

```
backend/speech_to_text_models/vosk-model-small-en-us-0.15/
```

Environment variable:
```
VOSK_MODEL_PATH=speech_to_text_models/vosk-model-small-en-us-0.15
```

---

## 🛠 Installation (uv + FastAPI)

### 1️⃣ Install uv  
Mac/Linux:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Windows:
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2️⃣ Install dependencies
```bash
cd backend
uv sync
```

### 3️⃣ Run server
```bash
uv run uvicorn app.main:app --reload --port 8000
```

### 4️⃣ Run tests
```bash
uv run pytest -q
```

---

## ⚙️ Environment Variables
Create `.env` inside `backend/`:

```
DATABASE_URL=sqlite://transcriptions.db
VOSK_MODEL_PATH=speech_to_text_models/vosk-model-small-en-us-0.15
SAMPLE_RATE=16000
```

---

## 🔌 WebSocket API — `/ws/transcribe`
Send binary PCM audio (16-bit, 16 kHz mono).

**Partial message:**
```json
{ "type": "partial", "text": "hello wo" }
```

**Final message:**
```json
{
  "type": "final",
  "text": "hello world",
  "word_count": 2,
  "duration_seconds": 1.25,
  "session_id": 3
}
```

---

## 📡 REST Endpoints
### List sessions
```bash
curl http://localhost:8000/sessions
```

### Get session by ID
```bash
curl http://localhost:8000/sessions/1
```

---

## 🗄 Database Schema (Tortoise ORM)
```python
class TranscriptionSession(Model):
    id = IntField(pk=True)
    created_at = DatetimeField(auto_now_add=True)
    duration_seconds = FloatField(default=0.0)
    word_count = IntField(default=0)
    transcript_text = TextField()
    model_name = CharField(max_length=255, default="vosk-small-en-us-0.15")
    language = CharField(max_length=10, default="en")
```

---

## 🐳 Docker
From project root:
```bash
docker-compose up --build
```

Backend → http://localhost:8000  

---

## ⚠️ Limitations
- PCM audio only  
- No authentication  
- Vosk small model has limited accuracy  
- HTTPS required for mic access in production  

---

## 🚀 Future Work
- Whisper.cpp backend  
- User authentication  
- Session pagination  
- Real-time audio level visualization  

---