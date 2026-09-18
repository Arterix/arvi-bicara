from fastapi import APIRouter, File, UploadFile, HTTPException
from services.stt_service import transcribe_audio

router = APIRouter(prefix='/api/transcribe', tags=['Speech-to-Text'])

@router.post('')
async def transcribe(file: UploadFile = File(...), language: str = 'en'):
    if not file.content_type or not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail='Please upload an audio file.')
    audio_bytes = await file.read()
    if len(audio_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail='Audio file is too large.')
    try:
        return await transcribe_audio(audio_bytes, language=language)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Transcription failed: {exc}') from exc
