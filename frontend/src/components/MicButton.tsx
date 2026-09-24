'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface MicButtonProps {
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  onStartListening,
  onStopListening,
  disabled = false,
}) => {
  const { isListening, isSpeaking, setIsSpeaking, setEmotion } = useAppStore();

  const handleToggle = () => {
    if (disabled) return;
    
    // If Arvi is currently speaking, clicking interrupts speech immediately
    if (isSpeaking) {
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setEmotion('listening');
      onStartListening();
      return;
    }

    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Animated Ripple Waves when listening */}
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
              className="absolute w-24 h-24 rounded-full bg-emerald-400"
            />
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: 'easeOut' }}
              className="absolute w-24 h-24 rounded-full bg-teal-300"
            />
          </>
        )}

        {/* Main Push to Talk Button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={handleToggle}
          disabled={disabled}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border-4 border-white cursor-pointer ${
            disabled
              ? 'bg-slate-300 cursor-not-allowed opacity-60'
              : isListening
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-300'
              : isSpeaking
              ? 'bg-gradient-to-tr from-sky-500 to-indigo-500 text-white hover:brightness-110'
              : 'bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 text-white hover:shadow-indigo-300'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-8 h-8 animate-bounce" />
          ) : isListening ? (
            <Mic className="w-8 h-8 animate-pulse text-white" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      {/* Button Helper Text */}
      <span className="text-xs font-bold text-slate-600 px-3 py-1 rounded-full bg-white/80 shadow-xs border border-slate-100 select-none">
        {isSpeaking
          ? 'Arvi sedang berbicara... (Klik untuk menyela)'
          : isListening
          ? 'Mendengarkan... (Klik untuk selesai)'
          : 'Klik untuk Bicara dengan Arvi 🎙️'}
      </span>
    </div>
  );
};
