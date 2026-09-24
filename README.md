# 🤖 BiCARA (Arvi) — Offline-First AI English Speaking Partner

<p align="center">
  <img src="https://img.shields.io/badge/Project-BiCARA_(Arvi)-065A82?style=for-the-badge&logo=robotframework&logoColor=white" alt="BiCARA Logo" />
  <img src="https://img.shields.io/badge/Category-Smart_Village_Technology-00A896?style=for-the-badge&logo=homeassistant&logoColor=white" alt="Category" />
  <img src="https://img.shields.io/badge/APHACTON-2026-1C7293?style=for-the-badge" alt="Hackathon" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js_14-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/STT-faster--whisper_INT8-blue?style=flat-square&logo=openai" alt="Faster Whisper" />
  <img src="https://img.shields.io/badge/TTS-Edge_Neural_%2B_Kokoro_ONNX-orange?style=flat-square" alt="TTS" />
  <img src="https://img.shields.io/badge/Architecture-Offline--First_Hybrid-success?style=flat-square" alt="Offline First" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

<p align="center">
  <strong>BiCARA (Bimbingan Cerdas Anak Berbahasa)</strong> adalah platform pembelajaran pelafalan bahasa Inggris interaktif berbasis kecerdasan buatan (*AI Speaking Partner*) dengan pendekatan <em>offline-first</em> yang dirancang khusus untuk mendampingi guru dan siswa di sekolah pedesaan serta sub-urban.
</p>

---

## 📌 Daftar Isi
1. [Latar Belakang & Masalah](#-latar-belakang--masalah)
2. [Mitra Studi Kasus (EGIS Kartasura)](#-mitra-studi-kasus-egis-kartasura)
3. [Solusi & Fitur Unggulan](#-solusi--fitur-unggulan)
4. [Arsitektur Sistem (Hybrid Offline-First)](#-arsitektur-sistem-hybrid-offline-first)
5. [Multi-Algorithm Phonetic Engine](#-multi-algorithm-phonetic-engine)
6. [Modul Kurikulum Trilingual](#-modul-kurikulum-trilingual)
7. [Tech Stack](#-tech-stack)
8. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
9. [Panduan Instalasi & Pengoperasian](#-panduan-instalasi--pengoperasian)
10. [Dokumentasi API](#-dokumentasi-api)
11. [Hasil Pengujian Prototipe](#-hasil-pengujian-prototipe)
12. [Roadmap Masa Depan](#-roadmap-masa-depan)
13. [Tim Pengembang](#-tim-pengembang)

---

## 🌍 Latar Belakang & Masalah

Di berbagai institusi pendidikan dasar di wilayah sub-urban dan pedesaan, terdapat **dua jurang kritis (*two critical gaps*)** dalam pembelajaran bahasa asing:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DUA JURANG KRITIS                             │
├────────────────────────────────────┬────────────────────────────────────┤
│   1. Kesenjangan Pelafalan Baku   │  2. Keterbatasan Jaringan Internet │
│                                    │                                    │
│ • Mayoritas staf pengajar bukan    │ • Koneksi internet sering          │
│   lulusan murni bahasa asing.      │   fluktuatif / putus-nyambung.     │
│ • Kesulitan menjaga konsistensi    │ • Biaya kuota data bandwidth tinggi│
│   notasi fonetik standar (IPA).    │   membebani operasional sekolah.   │
│ • Risiko fosilisasi pelafalan      │ • Aplikasi EdTech cloud komersial  │
│   keliru pada periode usia emas.   │   tidak andal untuk harian kelas.  │
└────────────────────────────────────┴────────────────────────────────────┘
```

**BiCARA** hadir untuk menjembatani kesenjangan tersebut melalui asisten AI lokal bernama **Arvi** yang mampu menjalankan pengenalan ucapan (*Speech-to-Text*), analisis fonetik (*Phonetic Scoring*), dan sintesis suara (*Text-to-Speech*) secara **100% mandiri di laptop sekolah tanpa wajib internet**.

---

## 🏫 Mitra Studi Kasus (EGIS Kartasura)

Pengembangan BiCARA berakar pada analisis kebutuhan lapangan bersama mitra pendidikan lokal:

* **Nama Mitra:** *Essentials Global Islamic School* (EGIS)
* **Lokasi:** Jl. Veteran, Dusun I, Singopuran, Kec. Kartasura, Kabupaten Sukoharjo, Jawa Tengah
* **Naungan:** Yayasan Pilar Peradaban (Visi: *"Global Mindset, Rooted in Islamic Values"*)
* **Jenjang Sasaran:** *Early Years* (PAUD/TK) & *Primary School* (SD Kelas 1–6)
* **Kebutuhan Nyata:** Asisten kelas digital yang dapat membantu guru memvalidasi fonetik kata bahasa Inggris dan membimbing latihan siswa secara interaktif tanpa kendala koneksi internet.

---

## ✨ Solusi & Fitur Unggulan

BiCARA mengintegrasikan konsep **Dual-Persona** dalam satu antarmuka terpadu (*Unified Single-Page Application*):

```
                       ┌──────────────────────┐
                       │   BiCARA (Arvi AI)   │
                       │   Unified Interface  │
                       └──────────┬───────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     👨🏫 MODE CO-TEACHER        │       │        🎒 MODE SISWA            │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ • Validasi Notasi Fonetik (IPA) │       │ • Flashcard Kosakata Bergambar  │
│ • Pemenggalan Suku Kata (Spell) │       │ • Latihan Rekam Suara Langsung  │
│ • Audio Referensi Native        │       │ • Evaluasi & Skor Instan        │
│ • Panduan Kalimat Kontekstual   │       │ • Gamifikasi Bintang & Apresiasi│
└─────────────────────────────────┘       └─────────────────────────────────┘
```

### 🌟 Fitur Utama:
1. **Animated Reactive Arvi Avatar:** Visualizer dinamis berbasis HTML5 Canvas yang berdenyut mengikuti ritme audio suara.
2. **Center-Stage Vocabulary Flashcard:** Kartu interaktif yang menampilkan kata, gambar ilustrasi emoji, arti bahasa Indonesia, ejaan, serta tips artikulasi lidah.
3. **Adaptive Grade Selector:** Penyesuaian materi ke dalam 3 kelompok usia:
   * *PAUD / Early Years (4–6 tahun)*
   * *SD Kelas Rendah (6–9 tahun)*
   * *SD Kelas Tinggi (9–12 tahun)*
4. **Hands-Free Wake Word ("Hi Arvi"):** Deteksi kata pemicu otomatis agar guru/siswa dapat berinteraksi tanpa harus selalu mengklik tombol.
5. **Halaman Diagnostik Mikrofon (`/test-mic`):** Alat uji sensitivitas audio browser sebelum kelas dimulai.

---

## 🏗️ Arsitektur Sistem (Hybrid Offline-First)

BiCARA mengutamakan pemrosesan lokal (*on-device execution*) untuk seluruh fungsi esensial pembelajaran:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      LAPTOP / PERANGKAT SEKOLAH                        │
 │                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │                  Frontend (Next.js 14 / React)                   │  │
 │  │    • Jarvis-Style UI        • Reactive Canvas Visualizer         │  │
 │  │    • Web Audio Recorder     • Grade & Topic Switcher             │  │
 │  └──────────────────────────────────┬───────────────────────────────┘  │
 │                                     │ HTTP / REST API (Port 8000)      │
 │  ┌──────────────────────────────────▼───────────────────────────────┐  │
 │  │                  Backend Core (FastAPI / Python)                 │  │
 │  │                                                                  │  │
 │  │  ┌─────────────────────────┐      ┌───────────────────────────┐  │  │
 │  │  │ faster-whisper (Tiny.en)│      │  Multi-Algorithm Scorer   │  │  │
 │  │  │  • INT8 CPU Quantization│      │   • Levenshtein (40%)     │  │  │
 │  │  │  • Latensi < 800ms      │      │   • Jaro-Winkler (30%)    │  │  │
 │  │  └─────────────────────────┘      │   • Double Metaphone (30%)│  │  │
 │  │                                   │   • Soundex (Bonus Aksen) │  │  │
 │  │  ┌─────────────────────────┐      └───────────────────────────┘  │  │
 │  │  │   Hybrid Speech Engine  │                                     │  │
 │  │  │  • Edge Neural TTS      │      ┌───────────────────────────┐  │  │
 │  │  │  • Kokoro ONNX (Offline)│      │ 8-Topic Curriculum Bank   │  │  │
 │  │  └─────────────────────────┘      │ • ~70 Structured Vocabs   │  │  │
 │  │                                   └───────────────────────────┘  │  │
 │  └──────────────────────────────────┬───────────────────────────────┘  │
 └─────────────────────────────────────┼──────────────────────────────────┘
                                       │ (Opsional: Hanya jika online)
                                       ▼
                     ┌──────────────────────────────────┐
                     │     Cloud Fallback Gateway       │
                     │  • Omniroute API (GPT-4o-mini)   │
                     │  • Obrolan bebas di luar silabus │
                     │  • Fallback aman jika offline    │
                     └──────────────────────────────────┘
```

---

## 🧠 Multi-Algorithm Phonetic Engine

Untuk memberikan evaluasi yang adil terhadap pelafalan anak Indonesia tanpa menghukum logat/aksen kedaerahan, sistem menggunakan kombinasi 4 algoritma komputasi linguistik:

$$\text{Final Score} = (0.40 \times \text{Levenshtein}) + (0.30 \times \text{Jaro-Winkler}) + (0.30 \times \text{Metaphone}) + \text{Bonus Soundex}$$

### Bobot Algoritma:
| Algoritma | Bobot | Fokus Penilaian |
|---|:---:|---|
| **Levenshtein Distance** | **40%** | Rasio kesamaan jumlah karakter dan operasi edit huruf dasar. |
| **Jaro-Winkler Similarity** | **30%** | Kesesuaian awalan kata (*prefix match*) dan toleransi transposisi pendek. |
| **Double Metaphone** | **30%** | Kesesuaian representasi bunyi fonetik ucapan bahasa Inggris. |
| **Soundex Clustering** | **Bonus** | Pengelompokan bunyi konsonan serupa untuk toleransi dialek lokal. |

### Skema Respons Bintang:
* ⭐⭐⭐⭐⭐ **Skor $\ge$ 85% :** *Excellent / Native-like Pronunciation*
* ⭐⭐ **Skor 65% – 84% :** *Good / Clear Pronunciation (Diterima)*
* 💪 **Skor < 65% :** *Keep Trying / Motivasi Ceria (Latihan Ulang)*

---

## 📚 Modul Kurikulum Trilingual

BiCARA memuat **8 modul topik kurikulum harian** (~70 kosakata dasar) yang dirancang sesuai tingkatan usia:

1. 🍎 **Fruits (Buah-buahan):** *Apple, Banana, Orange, Mango, Watermelon, Papaya, Grape, Pineapple, Strawberry, Melon.*
2. 🦁 **Animals (Hewan):** *Cat, Dog, Bird, Fish, Elephant, Lion, Monkey, Duck, Cow, Rabbit.*
3. 🎨 **Colors (Warna):** *Red, Blue, Green, Yellow, Orange, Purple, Pink, Black, White, Brown.*
4. 🔢 **Numbers (Angka 1–10):** *One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.*
5. 👨👩👧 **Family (Keluarga):** *Father, Mother, Brother, Sister, Baby, Grandfather, Grandmother.*
6. 🎒 **School Objects (Benda Sekolah):** *Book, Pencil, Eraser, Bag, Ruler, Chair, Table, Classroom.*
7. 🏃 **Actions / Routines (Kata Kerja):** *Walk, Run, Jump, Read, Write, Eat, Drink, Sleep, Wash, Play.*
8. 👋 **Greetings (Sapaan Sehari-hari):** *Hello, Good Morning, Good Afternoon, Good Night, Goodbye, Thank You, How Are You, Nice to Meet You.*

---

## 💻 Tech Stack

| Domain | Teknologi | Keterangan |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Antarmuka reaktif berbasis React & TypeScript |
| **Styling & Icons** | **Tailwind CSS + Lucide Icons** | Desain responsif bergaya Jarvis modern |
| **Audio Processing** | **Web Audio API + MediaRecorder** | Perekaman audio PCM/WAV langsung dari browser |
| **Backend Framework** | **FastAPI (Python 3.11+)** | REST API asinkron berkinerja tinggi |
| **Local Speech-to-Text** | **faster-whisper (`tiny.en` INT8)** | Transkripsi lokal ringan di CPU (tanpa GPU) |
| **Text-to-Speech** | **Edge-TTS / Kokoro ONNX** | Sintesis suara natural bilingual hybrid |
| **NLP & Scoring** | **Jellyfish + Custom Rule Engine** | Algoritma Levenshtein, Jaro-Winkler, Metaphone |
| **Optional LLM** | **Omniroute API (GPT-4o-mini)** | Cloud fallback percakapan bebas |

---

## 📂 Struktur Direktori Proyek

```text
.
├── setup.ps1                 # Skrip instalasi otomatis Windows PowerShell
├── run.bat                   # Skrip eksekusi satu-klik (Frontend + Backend)
├── README.md                 # Dokumentasi Lengkap Proyek
├── backend/
│   ├── main.py               # Entry point FastAPI server
│   ├── requirements.txt      # Dependensi Python backend
│   ├── .env.example          # Template konfigurasi environment
│   ├── data/
│   │   └── curriculum.json   # Knowledge bank 8 topik & kosakata
│   └── services/
│       ├── stt_service.py    # faster-whisper speech-to-text service
│       ├── scoring_service.py# Multi-algorithm phonetic scoring
│       ├── tts_service.py    # Hybrid Edge/Kokoro speech synthesis
│       ├── chat_service.py   # Rule-based & LLM fallback engine
│       └── conversation.py   # State & context management
└── frontend/
    ├── package.json          # Dependensi Next.js / Node
    ├── .env.example          # Template konfigurasi environment frontend
    ├── app/
    │   ├── layout.tsx        # Root layout Next.js
    │   ├── page.tsx          # Main Jarvis Unified Interface
    │   └── test-mic/         # Diagnostik mikrofon browser
    └── components/
        ├── ArviAvatar.tsx    # Visualizer audio reaktif
        ├── CenterCard.tsx    # Flashcard visual & fonetik IPA
        └── TopicSelector.tsx # Pemilih 8 topik kurikulum
```

---

## 🚀 Panduan Instalasi & Pengoperasian

### Prasyarat Sistem:
* **Sistem Operasi:** Windows 10/11 (64-bit)
* **Python:** Versi 3.11 atau 3.12
* **Node.js:** Versi 18+ (disarankan Node.js 20/24 LTS)
* **Perangkat Keras:** Laptop/PC dengan RAM minimal 4 GB, mikrofon, dan speaker.

---

### Cara 1: Setup & Eksekusi Otomatis (Direkomendasikan)

Buka terminal **PowerShell** di folder proyek ini:

```powershell
# 1. Jalankan skrip setup otomatis
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1

# 2. Jalankan aplikasi (membuka server Frontend & Backend)
.\run.bat
```

Aplikasi akan otomatis berjalan di URL:
* 🌐 **Frontend App:** [http://localhost:3000](http://localhost:3000)
* 🎙️ **Microphone Diagnosis:** [http://localhost:3000/test-mic](http://localhost:3000/test-mic)
* 📡 **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Cara 2: Setup Manual

#### 1. Setup Backend:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Setup Frontend:
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 📡 Dokumentasi API

FastAPI menyediakan dokumentasi interaktif Swagger UI di `http://localhost:8000/docs`.

### Endpoint Utama:

#### 1. Transkripsi Suara (Speech-to-Text)
* **Endpoint:** `POST /api/transcribe`
* **Content-Type:** `multipart/form-data`
* **Request:** Berkas audio `file` (format WAV/WebM)
* **Response:**
```json
{
  "text": "apple",
  "language": "en",
  "duration": 1.25
}
```

#### 2. Evaluasi Pelafalan (Phonetic Scoring)
* **Endpoint:** `POST /api/score`
* **Content-Type:** `application/json`
* **Request:**
```json
{
  "target_word": "apple",
  "spoken_text": "apel"
}
```
* **Response:**
```json
{
  "score": 78.5,
  "stars": 2,
  "feedback": "Great try! Clear pronunciation.",
  "is_pass": true,
  "details": {
    "levenshtein": 80.0,
    "jaro_winkler": 88.0,
    "metaphone_match": true,
    "soundex_match": true
  }
}
```

#### 3. Sintesis Suara (Text-to-Speech)
* **Endpoint:** `POST /api/tts`
* **Request:** `{"text": "Apple", "voice": "en-US-AnaNeural"}`
* **Response:** File stream audio MP3/WAV.

---

## 🧪 Hasil Pengujian Prototipe

Pengujian unit internal terhadap komponen inti sistem membuktikan keandalan eksekusi lokal:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HASIL UJI UNIT SCORING ENGINE                        │
├───────────────────┬───────────────────────────┬──────────────┬─────────┤
│ Uji Kasus         │ Masukan Kata              │ Hasil Skor   │ Status  │
├───────────────────┼───────────────────────────┼──────────────┼─────────┤
│ Exact Match       │ 'Apple' vs 'Apple'        │ 100.0% (5⭐) │ PASSED  │
│ Near Match (Lokal)│ 'apel' vs 'Apple'         │  78.5% (2⭐) │ PASSED  │
│ Phonetic Match    │ 'elefan' vs 'Elephant'    │  72.0% (2⭐) │ PASSED  │
│ Total Mismatch    │ 'watermelon' vs 'Cat'     │  21.0% (0⭐) │ PASSED  │
└───────────────────┴───────────────────────────┴──────────────┴─────────┘
```

* **Latensi STT Lokal:** Rata-rata $\approx 600 - 800\text{ ms}$ pada CPU laptop standar (Intel i5 gen 8 / AMD Ryzen 3) tanpa akselerasi kartu grafis terpisah.
* **Diagnostik Audio:** Halaman `/test-mic` memverifikasi transmisi paket audio *browser-to-backend* berhasil 100% tanpa distorsi.

---

## 🗺️ Roadmap Masa Depan

1. **Fase 1 — Integrasi Kurikulum Bahasa Arab (Trilingual Full Support):**
   * Menambahkan silabus kosakata Bahasa Arab dasar dan notasi fonetik makhraj huruf untuk menyempurnakan kurikulum EGIS Kartasura.
2. **Fase 2 — Browser Noise Cancellation & VAD:**
   * Menerapkan filter penekan gema dan derau kelas langsung pada Web Audio API frontend agar tetap optimal di lingkungan kelas yang ramai.
3. **Fase 3 — Teacher Analytics Dashboard:**
   * Modul dasbor ringkasan kelas bagi guru untuk memantau grafik akumulasi bintang dan rekapitulasi kosakata yang paling sering salah diucapkan siswa.

---

## 👥 Tim Pengembang

**Tim BiCARA — Universitas Pignatelli Triputra Surakarta**

| Nama | NIM | Peran Utama |
|---|:---:|---|
| **M Ernest Javier** | `243016022` | *AI Engineering & Backend Architecture* |
| **Bening Radiktya** | `243016024` | *UI/UX Design & Speech Dataset Preparation* |
| **Armandhito Surya N** | `243016020` | *System & Curriculum Integration Analyst* |

*Diajukan untuk kompetisi nasional **APHACTON 2026** — Kategori **Smart Village Technology**.*

---

<p align="center">
  <sub>BiCARA (Arvi) © 2026 Universitas Pignatelli Triputra. Dikembangkan untuk kemajuan pendidikan anak bangsa.</sub>
</p>
