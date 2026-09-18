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
  lang = 'en-US',
}: UseSpeechRecognitionOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const isStartedRef = useRef<boolean>(false);
  const restartTimerRef = useRef<any>(null);

  const {
    setIsListening,
    setEmotion,
  } = useAppStore();

  // Request microphone permission explicitly via user action
  const requestMicPermission = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setPermissionStatus('granted');
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('[useSpeechRecognition] Mic permission denied:', err);
      setPermissionStatus('denied');
      return false;
    }
  }, []);

  // Initialize Speech Recognition once
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
      isStartedRef.current = true;
      setIsListening(true);
      setEmotion('listening');
      setPermissionStatus('granted');
    };

    recognition.onresult = (event: any) => {
      // Don't capture when Arvi is actively speaking audio to prevent loopback
      if (useAppStore.getState().isSpeaking) return;

      let currentInterim = '';
      let finalTrans = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTrans += item[0].transcript;
        } else {
          currentInterim += item[0].transcript;
        }
      }

      if (currentInterim) {
        setInterimTranscript(currentInterim);
        const interimLower = currentInterim.toLowerCase();
        // Wake-word triggers
        if (
          interimLower.includes('hi arvi') ||
          interimLower.includes('hello arvi') ||
          interimLower.includes('hey arvi') ||
          interimLower.includes('halo arvi') ||
          interimLower.includes('arvi') ||
          interimLower.includes('arbi')
        ) {
          if (onWakeWord) onWakeWord();
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

        if (hasWakeWord && onWakeWord) {
          onWakeWord();
        }

        if (onResult) {
          onResult(cleanFinal);
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setPermissionStatus('denied');
        setIsListening(false);
        isStartedRef.current = false;
        setEmotion('happy');
      } else if (event.error === 'no-speech') {
        // Normal silence timeout; handled by onend auto-restart
      } else {
        console.warn('[SpeechRecognition] Status info:', event.error);
      }
    };

    recognition.onend = () => {
      isStartedRef.current = false;
      setIsListening(false);

      // Auto-restart if wake-word is active and not manually stopped
      const shouldKeepAlive = useAppStore.getState().isWakeWordActive && !isManuallyStoppedRef.current;
      if (shouldKeepAlive) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          try {
            if (!useAppStore.getState().isSpeaking && !isStartedRef.current) {
              recognition.start();
            }
          } catch (e) {
            // Already active or starting
          }
        }, 300);
      } else {
        setEmotion('happy');
      }
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      clearTimeout(restartTimerRef.current);
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [lang, onResult, onWakeWord, setIsListening, setEmotion]);

  const startListening = useCallback(async () => {
    isManuallyStoppedRef.current = false;
    const granted = await requestMicPermission();
    if (!granted && permissionStatus === 'denied') return;

    if (recognitionRef.current && !isStartedRef.current) {
      try {
        setTranscript('');
        setInterimTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        // May already be started
      }
    }
  }, [requestMicPermission, permissionStatus]);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current && isStartedRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening: isStartedRef.current,
    permissionStatus,
    transcript,
    interimTranscript,
    requestMicPermission,
    startListening,
    stopListening,
    resetTranscript,
  };
}
