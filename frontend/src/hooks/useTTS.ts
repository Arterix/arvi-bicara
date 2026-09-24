'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const safetyTimerRef = useRef<any>(null);
  const { setIsSpeaking, setEmotion } = useAppStore();

  const resetSpeakingState = useCallback(() => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setIsPlaying(false);
    setIsSpeaking(false);
    setEmotion('happy');
  }, [setIsSpeaking, setEmotion]);

  const speakText = useCallback(
    async (
      text: string,
      options: { voice?: string; speed?: number; lang?: string } = {}
    ) => {
      const { voice = 'af_heart', speed = 1.0, lang = 'en-US' } = options;

      if (!text || typeof window === 'undefined') return;

      // Stop any existing speech / audio
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

      setIsPlaying(true);
      setIsSpeaking(true);
      setEmotion('speaking');

      // Safety watchdog timer (max 6s or based on text length)
      const maxDuration = Math.max(3500, Math.min(10000, text.split(' ').length * 600));
      safetyTimerRef.current = setTimeout(() => {
        resetSpeakingState();
      }, maxDuration);

      // 1. Primary: High-fidelity Kokoro / Neural TTS via Backend with fast 1.5s timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(`${API_BASE_URL}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice, speed }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            resetSpeakingState();
            URL.revokeObjectURL(url);
          };

          audio.onerror = () => {
            speakWithBrowserSynthesis(text, lang);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        // Fast fallback to instant browser speech synthesis
      }

      // 2. Secondary fallback: Web Speech API synthesis
      speakWithBrowserSynthesis(text, lang);
    },
    [setIsSpeaking, setEmotion, resetSpeakingState]
  );

  const speakWithBrowserSynthesis = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) {
      resetSpeakingState();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) utterance.voice = enVoice;

    utterance.onend = () => {
      resetSpeakingState();
    };

    utterance.onerror = () => {
      resetSpeakingState();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      resetSpeakingState();
    }
  }, [resetSpeakingState]);

  return {
    isPlaying,
    speakText,
    stopSpeaking,
  };
}
