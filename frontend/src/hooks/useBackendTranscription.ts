'use client';

import { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useBackendTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const { setIsListening, setEmotion } = useAppStore();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone not supported or permission denied in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.start(250);
      recorderRef.current = recorder;
      setIsRecording(true);
      setIsListening(true);
      setEmotion('listening');
      setInterimText('Mendengarkan suara...');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengakses mikrofon';
      console.error('[useBackendTranscription] Mic error:', err);
      setError(message);
      setIsListening(false);
      setEmotion('happy');
    }
  }, [setIsListening, setEmotion]);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) {
      setIsListening(false);
      setIsRecording(false);
      return '';
    }

    setIsListening(false);
    setIsRecording(false);
    setEmotion('thinking');

    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
      try {
        recorder.stop();
      } catch (e) {
        resolve(new Blob(chunksRef.current, { type: 'audio/webm' }));
      }
    });

    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    setInterimText('');
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('file', blob, 'arvi-recording.webm');
      const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Transcription failed (${response.status})`);
      const result = await response.json();
      return result.text || '';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transcription failed';
      setError(message);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [setIsListening, setEmotion]);

  const cancelRecording = useCallback(() => {
    try {
      recorderRef.current?.stop();
    } catch (e) {}
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setIsListening(false);
    setEmotion('happy');
    setInterimText('');
  }, [setIsListening, setEmotion]);

  return { isRecording, isTranscribing, interimText, error, startRecording, stopRecording, cancelRecording };
}
