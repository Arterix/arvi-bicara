'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setIsSpeaking, setEmotion } = useAppStore();

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

      setIsPlaying(true);
      setIsSpeaking(true);
      setEmotion('speaking');

      // 1. Primary: High-fidelity Kokoro / Neural TTS via Backend
      try {
        const res = await fetch(`${API_BASE_URL}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice, speed }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            setIsPlaying(false);
            setIsSpeaking(false);
            setEmotion('happy');
            URL.revokeObjectURL(url);
          };

          audio.onerror = () => {
            // Secondary fallback: browser Web Speech synthesis
            speakWithBrowserSynthesis(text, lang);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('[useTTS] Backend Kokoro TTS failed, falling back to browser synthesis:', err);
      }

      // 2. Secondary fallback: Web Speech API synthesis
      speakWithBrowserSynthesis(text, lang);
    },
    [setIsSpeaking, setEmotion]
  );

  const speakWithBrowserSynthesis = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) {
      setIsPlaying(false);
      setIsSpeaking(false);
      setEmotion('happy');
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
      setIsPlaying(false);
      setIsSpeaking(false);
      setEmotion('happy');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsSpeaking(false);
      setEmotion('happy');
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
      setIsPlaying(false);
      setIsSpeaking(false);
      setEmotion('happy');
    }
  }, [setIsSpeaking, setEmotion]);

  return {
    isPlaying,
    speakText,
    stopSpeaking,
  };
}
