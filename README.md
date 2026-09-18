# BiCARA (Arvi)

BiCARA is an offline-first AI English speaking partner for Indonesian PAUD/TK and elementary-school students. Arvi combines curriculum vocabulary, pronunciation practice, bilingual conversation, teacher vocabulary support, local speech transcription, and neural text-to-speech.

## Features

- Unified Jarvis-style interface with animated Arvi avatar.
- Curriculum knowledge bank across fruits, animals, colors, numbers, family, school, routines, and greetings.
- Local pronunciation scoring using Levenshtein, Jaro-Winkler, Metaphone, and Soundex.
- Browser recording sent to local FastAPI speech-to-text using faster-whisper `tiny.en` INT8.
- Natural Edge Neural TTS by default, with optional local Kokoro TTS.
- Offline rule-based conversational fallback when Omniroute is not configured.
- Microphone diagnosis page at `/test-mic`.

## Requirements

- Windows with PowerShell.
- Python 3.12+.
- Node.js 24+ and npm.
- Working microphone and speaker.
- Internet only for initial package/model downloads and optional Edge TTS/Omniroute use.

## First-time setup

From the `ARVI` directory, open PowerShell and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
```

The setup script creates `backend/venv`, installs Python dependencies, installs frontend dependencies, creates ignored local environment files, and downloads the Kokoro model files. The faster-whisper model downloads automatically the first time `/api/transcribe` is used.

## Run locally

```powershell
.\run.bat
```

This opens separate terminal windows for:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Microphone/STT test: http://localhost:3000/test-mic

Click **START** on the microphone test page, speak, and click **STOP**. The audio is uploaded to local faster-whisper and the resulting transcript is displayed.

## Configuration

Copying is handled by `setup.ps1`:

- `backend/.env` comes from `backend/.env.example`.
- `frontend/.env.local` comes from `frontend/.env.example`.

To enable Omniroute, put your own key in `backend/.env`:

```env
OMNIROUTE_API_KEY=your_key_here
```

Never commit `.env` or `.env.local` files.
