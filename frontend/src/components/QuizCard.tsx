'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { CurriculumItem, EvaluationResult } from '@/types';

interface QuizCardProps {
  item: CurriculumItem;
  topicName: string;
  evaluationResult: EvaluationResult | null;
  onPlayAudio: (word: string) => void;
  onNextItem: () => void;
  onResetEvaluation: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  item,
  topicName,
  evaluationResult,
  onPlayAudio,
  onNextItem,
  onResetEvaluation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl bg-white rounded-3xl shadow-xl border-4 border-indigo-100 overflow-hidden"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-4 text-white flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          Topic: {topicName}
        </span>
        <button
          onClick={() => onPlayAudio(item.word)}
          className="flex items-center gap-1.5 bg-white text-indigo-900 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <span>Dengar Arvi</span>
        </button>
      </div>

      {/* Main Flashcard Body */}
      <div className="p-6 flex flex-col items-center text-center">
        {/* Large Emoji / Visual Icon */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-7xl my-2 select-none filter drop-shadow-md"
        >
          {item.emoji}
        </motion.div>

        {/* English Word */}
        <h2 className="text-4xl font-black text-slate-800 tracking-tight mt-1">
          {item.word}
        </h2>

        {/* IPA Phonetic & Indonesian Meaning */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md font-bold">
            {item.phonetic}
          </span>
          <span className="text-sm font-bold text-slate-500">
            • {item.meaning_id}
          </span>
        </div>

        {/* Spelling Breakdown */}
        <div className="mt-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <span className="text-xs font-black tracking-widest text-slate-600 uppercase">
            Spelling: {item.spelling}
          </span>
        </div>

        {/* Pronunciation Tip for Kids */}
        {item.tips && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl mt-3 max-w-md font-medium">
            💡 <strong>Tips:</strong> {item.tips}
          </p>
        )}

        {/* Live Evaluation Result Overlay */}
        <AnimatePresence>
          {evaluationResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`w-full mt-5 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                evaluationResult.accuracy_percent >= 80
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : evaluationResult.accuracy_percent >= 50
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {/* Score Header */}
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
                <span className="font-black text-lg text-indigo-700 bg-white px-3 py-0.5 rounded-full shadow-xs border">
                  {evaluationResult.accuracy_percent}% Akurasi
                </span>
              </div>

              {/* Feedback text */}
              <p className="text-sm font-bold text-center mt-1">
                {evaluationResult.feedback}
              </p>

              {/* Action buttons inside result */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={onResetEvaluation}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors text-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Ucapan</span>
                </button>
                {evaluationResult.accuracy_percent >= 60 && (
                  <button
                    onClick={onNextItem}
                    className="flex items-center gap-1 text-xs font-black px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600 transition-colors"
                  >
                    <span>Kata Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Footer: Example sentence */}
      <div className="bg-slate-50 border-t border-slate-100 p-4 text-left">
        <p className="text-xs font-bold text-indigo-900">
          Contoh Kalimat: <span className="font-semibold italic text-slate-700">&ldquo;{item.example_en}&rdquo;</span>
        </p>
        <p className="text-xs text-slate-500 italic mt-0.5">
          &ldquo;{item.example_id}&rdquo;
        </p>
      </div>
    </motion.div>
  );
};
