'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioVisualizer(isActive: boolean) {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastLevelRef = useRef<number>(0);

  const startVisualizer = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

      // Avoid creating multiple context instances
      if (audioContextRef.current && audioContextRef.current.state === 'running') return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = (timestamp: number) => {
        if (!analyserRef.current) return;

        // Throttle updates to ~20 FPS (every 50ms) to eliminate React re-render lag
        if (timestamp - lastUpdateTimeRef.current >= 50) {
          lastUpdateTimeRef.current = timestamp;
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const normalized = Math.min(100, Math.round((average / 128) * 100));

          // Only trigger state update if level changed noticeably
          if (Math.abs(normalized - lastLevelRef.current) >= 3) {
            lastLevelRef.current = normalized;
            setAudioLevel(normalized);
          }
        }

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    } catch (err) {
      console.warn('[useAudioVisualizer] Mic visualizer access paused:', err);
    }
  }, []);

  const stopVisualizer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (e) {}
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
      streamRef.current = null;
    }
    lastLevelRef.current = 0;
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    if (isActive) {
      startVisualizer();
    } else {
      stopVisualizer();
    }
    return () => {
      stopVisualizer();
    };
  }, [isActive, startVisualizer, stopVisualizer]);

  return { audioLevel };
}
