# 🤖 BiCARA (Arvi) — Application Subsystem

> **Repositori Inti Aplikasi BiCARA (Arvi)**  
> Platform *Offline-First AI English Speaking Partner* untuk Sekolah Pedesaan & Sub-Urban (APHACTON 2026 - Smart Village Technology).

---

## ⚡ Quick Start

### 1. Instalasi Otomatis (Windows PowerShell)
```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
```

### 2. Menjalankan Aplikasi
```powershell
.\run.bat
```

* 🌐 **Frontend:** [http://localhost:3000](http://localhost:3000)
* 🎙️ **Microphone Diagnosis:** [http://localhost:3000/test-mic](http://localhost:3000/test-mic)
* 📡 **FastAPI Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏗️ Komponen Teknis

* **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons, Canvas Audio Visualizer.
* **Backend:** FastAPI (Python), faster-whisper `tiny.en` INT8 quantization, Edge Neural TTS, Kokoro ONNX offline synthesis.
* **Linguistic Engine:** Multi-algorithm scoring (Levenshtein 40%, Jaro-Winkler 30%, Metaphone 30%, Soundex bonus).
* **Curriculum Data:** 8 topik terstruktur (~70 kosakata) di `backend/data/curriculum.json`.

---

Untuk dokumentasi arsitektur lengkap, formula fonetik, use case diagram, dan hasil pengujian prototipe, silakan buka berkas utama di:  
👉 **[Root README.md](../../README.md)**
