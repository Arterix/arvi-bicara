'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles, User, Bot, CheckCircle } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
  onReplayAudio?: (text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onReplayAudio }) => {
  const isArvi = message.role === 'arvi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-start gap-3 w-full max-w-2xl my-2.5 ${
        isArvi ? 'flex-row' : 'flex-row-reverse self-end ml-auto'
      }`}
    >
      {/* Role Avatar Icon */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${
          isArvi
            ? 'bg-gradient-to-tr from-indigo-500 to-sky-400 text-white'
            : 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white'
        }`}
      >
        {isArvi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble Content */}
      <div
        className={`flex flex-col gap-1.5 p-4 rounded-2xl shadow-md border max-w-[85%] ${
          isArvi
            ? 'bg-white/95 border-indigo-100 text-slate-800 rounded-tl-xs'
            : 'bg-gradient-to-br from-indigo-600 to-blue-600 border-indigo-500 text-white rounded-tr-xs'
        }`}
      >
        {/* Header with audio replay button */}
        <div className="flex items-center justify-between gap-2 border-b pb-1 border-slate-100/30">
          <span
            className={`text-xs font-black uppercase tracking-wider ${
              isArvi ? 'text-indigo-600' : 'text-indigo-100'
            }`}
          >
            {isArvi ? 'Arvi (AI Partner)' : 'Kamu (Student)'}
          </span>
          {isArvi && onReplayAudio && (
            <button
              onClick={() => onReplayAudio(message.textEn)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Dengarkan Suara Arvi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* English Text */}
        <p className="text-base font-bold leading-relaxed">{message.textEn}</p>

        {/* Indonesian Translation / Subtitle */}
        {message.textId && (
          <p
            className={`text-xs italic leading-normal ${
              isArvi ? 'text-slate-500' : 'text-indigo-100'
            }`}
          >
            &ldquo;{message.textId}&rdquo;
          </p>
        )}

        {/* Gentle Correction / Tip */}
        {message.correction && (
          <div className="mt-1 flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{message.correction}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
