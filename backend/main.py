from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import evaluate, chat, tts, curriculum, transcribe
import uvicorn

app = FastAPI(
    title="BiCARA ARVI Backend API",
    description="Offline-first AI Language Assistant Backend for BiCARA (Arvi)",
    version="1.0.0"
)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(curriculum.router)
app.include_router(evaluate.router)
app.include_router(chat.router)
app.include_router(tts.router)
app.include_router(transcribe.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "BiCARA (Arvi) AI Backend",
        "version": "1.0.0",
        "modes": ["Mode Guru (Co-Teacher)", "Mode Siswa (Kuis Interaktif)", "Mode Percakapan Bebas (Jarvis)"]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
