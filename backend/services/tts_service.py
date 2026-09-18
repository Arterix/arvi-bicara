import io
import asyncio
from pathlib import Path
import soundfile as sf
import edge_tts

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
KOKORO_MODEL_PATH = MODELS_DIR / "kokoro-v1.0.int8.onnx"
KOKORO_VOICES_PATH = MODELS_DIR / "voices-v1.0.bin"

_kokoro_instance = None

def get_kokoro():
    global _kokoro_instance
    if _kokoro_instance is None:
        if KOKORO_MODEL_PATH.exists() and KOKORO_VOICES_PATH.exists():
            try:
                from kokoro_onnx import Kokoro
                _kokoro_instance = Kokoro(str(KOKORO_MODEL_PATH), str(KOKORO_VOICES_PATH))
            except Exception as e:
                print(f"[TTSService] Kokoro load error: {e}")
                _kokoro_instance = None
    return _kokoro_instance

class TTSService:
    @staticmethod
    async def synthesize(text: str, voice: str = "en-US-AnaNeural", speed: float = 1.0) -> tuple[bytes, str]:
        """
        Synthesize text using Fast Edge Neural TTS (<300ms, zero local CPU burden)
        with Kokoro ONNX support when explicitly requested.
        Returns: (audio_bytes, media_type)
        """
        clean_text = text.strip()
        if not clean_text:
            return b"", "audio/mpeg"

        # 1. If explicit Kokoro voice requested (e.g. 'af_heart' or 'af_bella')
        if voice.startswith("af_") or voice.startswith("kokoro"):
            kokoro = get_kokoro()
            if kokoro is not None:
                try:
                    kokoro_voice = "af_heart" if "heart" in voice else "af_bella"
                    loop = asyncio.get_event_loop()
                    def _run_kokoro():
                        samples, sample_rate = kokoro.create(clean_text, voice=kokoro_voice, speed=speed, lang="en-us")
                        buf = io.BytesIO()
                        sf.write(buf, samples, sample_rate, format='WAV')
                        return buf.getvalue()

                    audio_bytes = await loop.run_in_executor(None, _run_kokoro)
                    return audio_bytes, "audio/wav"
                except Exception as e:
                    print(f"[TTSService] Kokoro failed: {e}. Using Edge Neural TTS...")

        # 2. Fast Edge Neural TTS (Natural, zero CPU freeze, <300ms response)
        try:
            # Child-friendly natural voice: en-US-AnaNeural or en-US-AriaNeural
            edge_voice = "en-US-AnaNeural"
            if "id" in voice or any(w in clean_text.lower() for w in ["halo", "selamat", "kamu", "bisa", "mari", "coba", "bagus"]):
                # If bilingual sentence, Ana handles both English and accent nicely, or Gadis for pure Indonesian
                edge_voice = "en-US-AnaNeural"

            communicate = edge_tts.Communicate(clean_text, edge_voice)
            audio_stream = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_stream.write(chunk["data"])
            return audio_stream.getvalue(), "audio/mpeg"
        except Exception as e:
            print(f"[TTSService] Edge TTS error: {e}")
            return b"", "audio/mpeg"
