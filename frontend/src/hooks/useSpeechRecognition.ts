'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onWakeWord?: () => void;
  lang?: string;
}

export function useSpeechRecognition({
  onResult,
  onWakeWord,
  lang = 'id-ID',
}: UseSpeechRecognitionOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const latestTranscriptRef = useRef<string>('');

  const {
    isListening, // Reactive global state
    setIsListening,
    setEmotion,
  } = useAppStore();

  const onResultRef = useRef(onResult);
  const onWakeWordRef = useRef(onWakeWord);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onWakeWordRef.current = onWakeWord;
  }, [onWakeWord]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setEmotion('listening');
      setPermissionStatus('granted');
    };

    recognition.onresult = (event: any) => {
      if (useAppStore.getState().isSpeaking) return;

      let currentInterim = '';
      let finalTrans = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTrans += item[0].transcript;
        } else {
          currentInterim += item[0].transcript;
        }
      }

      const combined = (finalTrans + ' ' + currentInterim).trim();
      latestTranscriptRef.current = combined;

      if (currentInterim) {
        setInterimTranscript(currentInterim);
        const interimLower = currentInterim.toLowerCase();
        if (
          interimLower.includes('hi arvi') ||
          interimLower.includes('hello arvi') ||
          interimLower.includes('hey arvi') ||
          interimLower.includes('halo arvi') ||
          interimLower.includes('arvi') ||
          interimLower.includes('arbi')
        ) {
          if (onWakeWordRef.current) onWakeWordRef.current();
        }
      }

      if (finalTrans) {
        const cleanFinal = finalTrans.trim();
        setTranscript(cleanFinal);
        setInterimTranscript('');

        const finalLower = cleanFinal.toLowerCase();
        const hasWakeWord =
          finalLower.includes('hi arvi') ||
          finalLower.includes('hello arvi') ||
          finalLower.includes('hey arvi') ||
          finalLower.includes('halo arvi') ||
          finalLower.includes('arvi') ||
          finalLower.includes('arbi');

        if (hasWakeWord && onWakeWordRef.current) {
          onWakeWordRef.current();
        }
        
        // DO NOT call onResult here, it causes double firing. Wait for stopListening.
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setPermissionStatus('denied');
      }
      setIsListening(false);
      setEmotion('happy');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [lang, setIsListening, setEmotion]);

  const startListening = useCallback(async () => {
    isManuallyStoppedRef.current = false;
    latestTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);
    setEmotion('listening');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Ignored if already started
      }
    }
  }, [setIsListening, setEmotion]);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }

    const captured = latestTranscriptRef.current.trim();
    if (captured && onResultRef.current) {
      onResultRef.current(captured);
    }
    latestTranscriptRef.current = '';
    return captured;
  }, [setIsListening]);

  const resetTranscript = useCallback(() => {
    latestTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening, // Now using global hook state
    permissionStatus,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
