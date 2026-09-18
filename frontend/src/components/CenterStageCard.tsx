'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, Sparkles, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';
import { CurriculumItem, EvaluationResult } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface CenterStageCardProps {
  item: CurriculumItem;
  topicName?: string;
  evaluationResult: EvaluationResult | null;
  onPlayAudio: (word: string) => void;
  onClose: () => void;
  onResetEvaluation: () => void;
}

export const CenterStageCard: React.FC<CenterStageCardProps> = ({
  item,
  topicName = 'Vocabulary',
  evaluationResult,
  onPlayAudio,
  onClose,
  onResetEvaluation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-indigo-100 overflow-hidden relative z-20"
    >
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            {topicName}
          </span>
          <button
            onClick={() => onPlayAudio(item.word)}
            className="flex items-center gap-1.5 bg-white text-indigo-900 px-3 py-1 rounded-full font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kokoro Voice</span>
          </button>
        </div>

        {/* Close Button - returns ARVI back to center */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-white"
          title="Tutup & Kembalikan Arvi ke Tengah"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Visual Display */}
      <div className="p-6 flex flex-col items-center text-center">
        {/* Big Emoji / Visual Asset */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-8xl my-3 select-none filter drop-shadow-lg cursor-pointer"
          onClick={() => onPlayAudio(item.word)}
          title="Klik untuk dengar suara"
        >
          {item.emoji}
        </motion.div>

        {/* English Word */}
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          {item.word}
        </h2>

        {/* IPA Phonetic & Indonesian Meaning */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-mono text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-lg font-bold border border-indigo-100">
            {item.phonetic}
          </span>
          <span className="text-base font-bold text-slate-600">
            • {item.meaning_id}
          </span>
        </div>

        {/* Spelling Breakdown */}
        <div className="mt-3.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <span className="text-xs font-black tracking-widest text-slate-700 uppercase">
            Spelling: {item.spelling}
          </span>
        </div>

        {/* Pronunciation Tip */}
        {item.tips && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl mt-3.5 max-w-md font-medium leading-relaxed">
            💡 <strong>Tips Pelafalan:</strong> {item.tips}
          </p>
        )}

        {/* Live Evaluation Result Overlay */}
        <AnimatePresence>
          {evaluationResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`w-full mt-4 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                evaluationResult.accuracy_percent >= 80
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : evaluationResult.accuracy_percent >= 50
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between w-full border-b pb-2 border-slate-200/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      evaluationResult.accuracy_percent >= 80
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  />
                  <span className="font-black text-sm uppercase">
                    Hasil: {evaluationResult.grade}
                  </span>
                </div>
                <span className="font-black text-base text-indigo-700 bg-white px-3 py-0.5 rounded-full shadow-xs border">
                  {evaluationResult.accuracy_percent}% Akurasi
                </span>
              </div>

              <p className="text-sm font-bold text-center mt-1">
                {evaluationResult.feedback}
              </p>

              <button
                onClick={onResetEvaluation}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Latihan Lagi</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Example Sentence Footer */}
      <div className="bg-slate-50 border-t border-slate-100 p-4 text-left">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-indigo-950">
            Contoh: <span className="font-semibold italic text-slate-800">&ldquo;{item.example_en}&rdquo;</span>
          </p>
          <button
            onClick={() => onPlayAudio(item.example_en)}
            className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
            title="Dengarkan Contoh Kalimat"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 italic mt-0.5">
          &ldquo;{item.example_id}&rdquo;
        </p>
      </div>
    </motion.div>
  );
};
