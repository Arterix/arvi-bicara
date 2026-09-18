'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Mic, MicOff, Star } from 'lucide-react';
import { GradeSelector } from './GradeSelector';
import { ScoreBoard } from './ScoreBoard';
import { useAppStore } from '@/store/useAppStore';

export const Navbar: React.FC = () => {
  const { isWakeWordActive, setIsWakeWordActive } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black bg-gradient-to-r from-indigo-700 via-sky-600 to-teal-500 bg-clip-text text-transparent">
                BiCARA
              </span>
              <span className="text-[11px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                JARVIS AI
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Kokoro Neural TTS • Offline-First
            </span>
          </div>
        </Link>

        {/* Center: Wake Word Auto-Listen Switch & Test Mic Link */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWakeWordActive(!isWakeWordActive)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all border ${
              isWakeWordActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Klik untuk mengaktifkan/menonaktifkan panggilan 'Hi Arvi'"
          >
            {isWakeWordActive ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Panggilan &ldquo;Hi Arvi&rdquo;: AKTIF</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Panggilan &ldquo;Hi Arvi&rdquo;: NONAKTIF</span>
              </>
            )}
          </button>

          <Link
            href="/test-mic"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 transition-colors shadow-xs"
            title="Buka Halaman Tes Microphone"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tes Mic 🎙️</span>
          </Link>
        </div>

        {/* Right Tools: Grade Selector & Stars */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <GradeSelector />
          </div>
          <ScoreBoard />
        </div>
      </div>
    </header>
  );
};
