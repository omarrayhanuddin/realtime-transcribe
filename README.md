# Real-Time Microphone Transcription
**FastAPI (backend) + Tortoise ORM + Next.js (App Router v16 frontend) + Vosk (CPU-only)**

A complete real-time microphone transcription system built with:
- **FastAPI** backend (WebSocket + REST)
- **Tortoise ORM** for database
- **Material UI** dark-themed **Next.js App Router (v16)** frontend
- **Vosk** CPU-only speech recognition
- **uv** Python package manager
- **Docker** & docker-compose

---

## 🚀 Features
- 🎤 **Browser microphone capture** with real-time streaming
- 🔌 **WebSocket audio → FastAPI → Vosk** pipeline
- ✍️ **Live partial transcription** + final text
- 🗃 **Session storage** (Tortoise ORM)
- 🧾 Session metadata: timestamp, duration, word count, transcript, model
- 💽 SQLite by default (Postgres-ready)
- 🧪 Minimal backend tests
- 🐳 Dockerized

---

# 🏗 Architecture Overview
```
Browser Mic → PCM Audio → WebSocket → FastAPI
            ↘ partial + final transcripts ↙
         Tortoise ORM → SQLite → /sessions API
Frontend (Next.js) ← REST + WebSocket updates
```

---

# 📁 Repo Structure
```
realtime-transcription/
backend/
│
├── app/
│   ├── routers/
│   │   ├── sessions.py         # REST endpoints
│   │   ├── websocket.py        # WebSocket streaming endpoint
│   │   └── __init__.py
│   ├── config.py               # Environment + settings
│   ├── db.py                   # Tortoise ORM init + connect
│   ├── helpers.py              # Vosk helpers
│   ├── main.py                 # FastAPI app factory + router include
│   ├── models.py               # Tortoise ORM models
│   ├── schemas.py              # Pydantic schemas
│   └── __init__.py
│
├── speech_to_text_models/      # Vosk CPU model folder
│   └── vosk-model-small-en-us-0.15/
│
├── migrations/                 # Tortoise ORM migrations
├── tests/                      # pytest tests
│
├── .env                        # Backend env variables
├── .env.example
├── pyproject.toml              # uv project
├── uv.lock
├── Dockerfile
└── .dockerignore
frontend/
├── app/
│   ├── page.tsx
│   ├── components/
│   │   ├── MicRecorder.tsx
│   │   ├── TranscriptDisplay.tsx
│   │   └── SessionList.tsx
│   └── styles/
│
├── public/
├── package.json
└── .env

```

---

# 📦 Backend Setup (FastAPI + Tortoise ORM + uv)

## 1️⃣ Install **uv**
* #### Official installation page → https://docs.astral.sh/uv/getting-started/installation/

### Direct commands:

####  macOS / Linux
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

####  Windows (PowerShell)
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

## 2️⃣ Install backend dependencies
### Go to backend folder:
```bash
cd backend
```



### Install dependencies:
```bash
uv sync
```

### Run backend:
```bash
uv run uvicorn app.main:app --reload --port 8000
```

### Run tests:
```bash
uv run pytest -q
```

---


## 🎙️ Vosk Model (Bundled by Default — No Download Required)
This project **already includes** the **Vosk Small English Model (`vosk-model-small-en-us-0.15`)** inside the repository so users **do not need to download anything manually**.


The model is stored at:
```
backend/speech_to_text_models/vosk-model-small-en-us-0.15/
```


### Why bundle the model?
- ✔ No external download steps
- ✔ Works **offline by default**
- ✔ Faster onboarding for users and assessors
- ✔ Docker builds are self‑contained


The backend automatically loads the model using:
```
VOSK_MODEL_PATH=speech_to_text_models/vosk-model-small-en-us-0.15
```


If you'd like to use a different Vosk model, simply replace the folder and update the env variable.


---

## 4️⃣ Environment Variables (`backend/.env`)
```
DATABASE_URL=sqlite://transcriptions.db
VOSK_MODEL_PATH=speech_to_text_models/vosk-model-small-en-us-0.15
SAMPLE_RATE=16000
```

---


---

# 🌐 Frontend Setup (Next.js 16 + Material UI)

```bash
cd frontend
npm install
```

Create environment file:
```
NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000/ws/transcribe
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```

Open browser:  
http://localhost:3000

---

# 🐳 Docker Compose
From root:
```bash
docker-compose up --build
```
Backend → http://localhost:8000  
Frontend → http://localhost:3000

---

# 📡 API Documentation

## 🔊 WebSocket — `/ws/transcribe`
Send **binary PCM (16-bit, 16 kHz mono)**.

### Partial message
```json
{ "type": "partial", "text": "hello wo" }
```

### Final message
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

## 📁 REST Endpoints
### `GET /sessions`
List sessions.
```bash
curl http://localhost:8000/sessions
```

### `GET /sessions/{id}`
Get session by ID.
```bash
curl http://localhost:8000/sessions/1
```

---

# 🗄 Database Schema (Tortoise ORM)
`models.py`:
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

SQLite auto-generates the table on startup if `generate_schemas=True`.

---

# 🧪 Tests
Run with uv:
```bash
cd backend
uv run pytest -q
```

Includes sample tests:
- Empty sessions list
- Insert + fetch session

---

# 💡 Design Choices
- Tortoise ORM for async-first DB layer (matching FastAPI async model)
- Vosk for local CPU-only inference
- Next.js App Router + MUI for modern UX
- WebSocket for real-time streaming
- uv for reproducible and fast Python env management

---

# ⚠️ Limitations
- PCM audio only
- No authentication
- Accuracy limited by Vosk small model
- Browser must run on HTTPS for mic on production

---

# 🚀 Future Enhancements
- Whisper.cpp backend option
- User accounts + session filtering
- Pagination for `/sessions`
- Mobile-friendly MUI gestures
- Real-time UI charts (volume, WPM)

---

