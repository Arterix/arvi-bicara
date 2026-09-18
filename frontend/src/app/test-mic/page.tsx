'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic, Square, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBackendTranscription } from '@/hooks/useBackendTranscription';

export default function TestMicPage() {
  const [transcript, setTranscript] = useState('');
  const { isRecording, isTranscribing, interimText, error, startRecording, stopRecording } = useBackendTranscription();

  const handleStop = async () => {
    const text = await stopRecording();
    setTranscript(text);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke ARVI
      </Link>
      <div className="bg-white rounded-3xl shadow-xl border-2 border-indigo-100 p-8">
        <h1 className="text-3xl font-black text-slate-800">Backend Speech-to-Text Test</h1>
        <p className="mt-2 text-sm text-slate-500">
          Audio direkam di browser lalu ditranskripsi oleh faster-whisper lokal di FastAPI. Tidak memakai Web Speech API atau access key.
        </p>

        <div className="mt-8 flex flex-col items-center gap-5">
          <button
            onClick={isRecording ? handleStop : startRecording}
            disabled={isTranscribing}
            className={`w-28 h-28 rounded-full text-white flex flex-col items-center justify-center gap-2 shadow-xl ${
              isRecording ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:opacity-50`}
          >
            {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            <span className="text-xs font-black">{isRecording ? 'STOP' : 'START'}</span>
          </button>
          <p className="text-sm font-bold text-slate-600">
            {isRecording ? 'Bicara sekarang, lalu tekan STOP.' : isTranscribing ? 'Whisper sedang memproses audio...' : 'Tekan START untuk merekam.'}
          </p>
        </div>

        {interimText && <div className="mt-6 p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold">{interimText}</div>}
        {error && <div className="mt-6 p-4 rounded-2xl bg-rose-50 text-rose-700 flex gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}

        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 min-h-28">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
            {transcript ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Mic className="w-4 h-4" />}
            Hasil Transkripsi
          </div>
          <p className="mt-3 text-xl font-bold text-slate-800">{transcript || 'Belum ada hasil.'}</p>
        </div>
      </div>
    </div>
  );
}
