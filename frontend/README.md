
# 🌐 Real-Time Transcription — Frontend
**Next.js (App Router v16) + Material UI + WebSocket Streaming UI**

This is the frontend for the Real-Time Microphone Transcription system. Built using modern Next.js App Router and MUI dark theme.

---

## ✨ Features
- Browser microphone recording
- Streams raw PCM audio to backend WebSocket
- Displays:
  - Live partial transcription
  - Final transcription
- Session history viewer
- Responsive dark-themed UI with Material UI

---

## 🛠 Installation

### 1️⃣ Install dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Create environment file

```
NEXT_PUBLIC_BACKEND_WS_URL=ws://localhost:8000/ws/transcribe
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

### 3️⃣ Run development server
```bash
npm run dev
```

Open:
👉 http://localhost:3000

---

## 📁 Project Structure
```
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

## 🎙️ How Audio Streaming Works
- Browser captures microphone via MediaStream
- Converts audio → PCM 16kHz mono
- Sends binary frames to backend WebSocket
- Displays partial + final text in real time

---

## 🌐 API Usage

### **WebSocket**
Connect to:
```
ws://localhost:8000/ws/transcribe
```

Receive messages like:
```json
{ "type": "partial", "text": "hel" }
```

Or final:
```json
{ "type": "final", "text": "hello world" }
```

### **REST API**
Fetch previous sessions:
```ts
fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/sessions`)
```

---

## 🎨 UI (Material UI + Dark Mode)
Frontend uses:
- MUI components
- App Router layouts
- Responsive grid
- Live transcript panel
- Session history viewer

---

## 🐳 Docker (If Needed)
Frontend runs in docker-compose via root-level `docker-compose.yml`.

Start:
```bash
docker-compose up --build
```

Frontend → http://localhost:3000

---

## 🚀 Future Enhancements
- Audio waveform visualization
- Improved mobile layout
- Session tagging & filtering
- Export transcript (PDF, TXT)