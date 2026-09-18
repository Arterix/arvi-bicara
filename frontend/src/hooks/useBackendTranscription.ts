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

  const startRecording = useCallback(async () => {
    setError(null);
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
    setInterimText('Listening...');
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return '';

    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
      recorder.stop();
    });
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    setIsRecording(false);
    setInterimText('');
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('file', blob, 'arvi-recording.webm');
      const response = await fetch(`${API_BASE_URL}/api/transcribe?language=en`, {
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
  }, []);

  const cancelRecording = useCallback(() => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setInterimText('');
  }, []);

  return { isRecording, isTranscribing, interimText, error, startRecording, stopRecording, cancelRecording };
}
