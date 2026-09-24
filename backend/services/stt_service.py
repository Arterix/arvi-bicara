import asyncio
import io
import os
from concurrent.futures import ThreadPoolExecutor

_model = None
_model_lock = asyncio.Lock()
_executor = ThreadPoolExecutor(max_workers=1)

async def _get_model():
    global _model
    if _model is None:
        async with _model_lock:
            if _model is None:
                from faster_whisper import WhisperModel
                model_size = os.getenv('WHISPER_MODEL', 'tiny.en')
                compute_type = os.getenv('WHISPER_COMPUTE_TYPE', 'int8')
                _model = await asyncio.get_running_loop().run_in_executor(
                    _executor,
                    lambda: WhisperModel(model_size, device='cpu', compute_type=compute_type),
                )
    return _model

async def transcribe_audio(audio_bytes: bytes, language: str = None) -> dict:
    if not audio_bytes:
        return {'text': '', 'language': language or 'en', 'segments': []}

    model = await _get_model()
    model_size = os.getenv('WHISPER_MODEL', 'tiny.en')
    transcribe_lang = 'en' if model_size.endswith('.en') else language

    def run_transcription():
        try:
            segments, info = model.transcribe(
                io.BytesIO(audio_bytes),
                language=transcribe_lang,
                beam_size=1,
                vad_filter=True,
                condition_on_previous_text=False,
            )
            collected = list(segments)
            text = ' '.join(segment.text.strip() for segment in collected).strip()
            return {
                'text': text,
                'language': info.language if info else (transcribe_lang or 'en'),
                'segments': [
                    {'start': segment.start, 'end': segment.end, 'text': segment.text.strip()}
                    for segment in collected
                ],
            }
        except Exception as e:
            print(f"[STTService] Transcription exception: {e}")
            return {'text': '', 'language': transcribe_lang or 'en', 'segments': [], 'error': str(e)}

    return await asyncio.get_running_loop().run_in_executor(_executor, run_transcription)
