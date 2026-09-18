'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Heart, Bot, Mic } from 'lucide-react';

interface ArviAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  audioLevel?: number;
  onClick?: () => void;
}

export const ArviAvatar: React.FC<ArviAvatarProps> = ({ size = 'lg', audioLevel = 0, onClick }) => {
  const { emotion, isSpeaking, isListening, isWakeWordActive } = useAppStore();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  }[size];

  // Dynamic scale pulse based on mic audio level or speaking
  const pulseScale = isListening
    ? 1 + (audioLevel / 100) * 0.35
    : isSpeaking
    ? [1, 1.08, 1, 1.04, 1]
    : [1, 1.03, 1];

  // Glow color depending on emotion
  const glowColor =
    emotion === 'cheering'
      ? 'from-amber-400 via-yellow-300 to-orange-400'
      : emotion === 'listening'
      ? 'from-emerald-400 via-teal-300 to-cyan-400'
      : emotion === 'speaking'
      ? 'from-sky-400 via-indigo-400 to-purple-400'
      : emotion === 'thinking'
      ? 'from-purple-400 via-pink-300 to-rose-400'
      : 'from-blue-400 via-cyan-300 to-indigo-400';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background ambient glow ring */}
      <motion.div
        animate={{
          scale: pulseScale,
          rotate: isSpeaking ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: isSpeaking ? 0.8 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute rounded-full bg-gradient-to-tr ${glowColor} opacity-60 blur-xl ${sizeClasses}`}
      />

      {/* Main Avatar Bubble */}
      <motion.div
        animate={{
          scale: pulseScale,
          y: isSpeaking ? [0, -6, 0] : [0, -3, 0],
        }}
        transition={{
          duration: isSpeaking ? 0.6 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeClasses} rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-teal-400 p-1.5 shadow-2xl flex items-center justify-center border-4 border-white`}
      >
        {/* Face Inner Sphere */}
        <div className="w-full h-full rounded-full bg-slate-900/90 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
          {/* Robot face highlights */}
          <div className="absolute top-2 left-4 w-6 h-3 rounded-full bg-white/30 -rotate-45 blur-xs" />

          {/* Eyes Container */}
          <div className="flex items-center justify-center gap-4 mb-1">
            {/* Left Eye */}
            <motion.div
              animate={{
                scaleY: emotion === 'thinking' ? [1, 0.2, 1] : emotion === 'cheering' ? 1.3 : 1,
              }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
              className="w-3.5 h-5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] relative"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-0.5" />
            </motion.div>

            {/* Right Eye */}
            <motion.div
              animate={{
                scaleY: emotion === 'thinking' ? [1, 0.2, 1] : emotion === 'cheering' ? 1.3 : 1,
              }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
              className="w-3.5 h-5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9] relative"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-0.5" />
            </motion.div>
          </div>

          {/* Cheeks (Blush) */}
          <div className="flex items-center justify-between w-16 px-1 mb-1">
            <div className="w-2.5 h-1.5 rounded-full bg-pink-400/70 blur-xs" />
            <div className="w-2.5 h-1.5 rounded-full bg-pink-400/70 blur-xs" />
          </div>

          {/* Mouth */}
          <motion.div
            animate={{
              height: isSpeaking ? [4, 12, 6, 14, 4] : emotion === 'cheering' ? 10 : 4,
              width: isSpeaking ? [12, 16, 10, 14, 12] : 14,
              borderRadius: isSpeaking ? '8px' : '4px',
            }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="bg-cyan-200 rounded-full shadow-[0_0_8px_#a5f3fc]"
          />
        </div>

        {/* Status Mini-Badge */}
        <div className="absolute -bottom-1 -right-1 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
          {emotion === 'cheering' && <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-spin" />}
          {emotion === 'listening' && <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />}
          {emotion === 'speaking' && <Bot className="w-4 h-4 text-sky-500 animate-bounce" />}
          {emotion === 'happy' && <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
          {emotion === 'thinking' && <Sparkles className="w-4 h-4 text-purple-500" />}
        </div>
      </motion.div>

      {/* Name Label with Wake-Word status */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-3 bg-white/95 backdrop-blur-sm px-4 py-1 rounded-full shadow-md border border-indigo-100 flex items-center gap-1.5"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isListening ? 'bg-emerald-500 animate-ping' : isWakeWordActive ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'
          }`}
        />
        <span className="text-xs font-black tracking-wider text-indigo-950 uppercase">ARVI JARVIS</span>
      </motion.div>
    </div>
  );
};
