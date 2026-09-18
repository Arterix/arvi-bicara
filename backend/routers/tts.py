from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional
from services.tts_service import TTSService

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "af_heart"
    speed: Optional[float] = 1.0

@router.post("")
async def generate_speech(payload: TTSRequest):
    """
    Synthesize speech audio into high-fidelity WAV/MP3 using Kokoro TTS.
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    audio_bytes, media_type = await TTSService.synthesize(
        payload.text,
        voice=payload.voice or "af_heart",
        speed=payload.speed or 1.0
    )

    if not audio_bytes:
        raise HTTPException(status_code=500, detail="Failed to synthesize audio.")

    return Response(content=audio_bytes, media_type=media_type)
