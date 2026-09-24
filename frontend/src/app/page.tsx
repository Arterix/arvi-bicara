'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ArviAvatar } from '@/components/ArviAvatar';
import { MicButton } from '@/components/MicButton';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { CenterStageCard } from '@/components/CenterStageCard';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useBackendTranscription } from '@/hooks/useBackendTranscription';
import { useTTS } from '@/hooks/useTTS';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { chatWithArviApi, evaluateSpeechApi } from '@/lib/api';
import { findCurriculumItem } from '@/lib/curriculumData';
import { Sparkles, Mic, Volume2, AlertCircle, Bot, Send, Zap, Radio } from 'lucide-react';

export default function JarvisUnifiedPage() {
  const {
    spatialState,
    activeItem,
    setActiveItem,
    activeTopicName,
    evaluationResult,
    setEvaluationResult,
    addStars,
    gradeLevel,
    setEmotion,
    isListening,
    isSpeaking,
    chatMessages,
    addChatMessage,
    isWakeWordActive,
  } = useAppStore();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const lastProcessedRef = React.useRef<{ text: string; timestamp: number }>({ text: '', timestamp: 0 });
  const [liveSubtitle, setLiveSubtitle] = useState<{ en: string; id: string }>({
    en: "Hi! I am Arvi, your English speaking partner. Say 'Hi Arvi' or click below!",
    id: "Halo! Aku Arvi, teman belajarmu. Panggil 'Hi Arvi' atau klik di bawah!",
  });

  const { speakText } = useTTS();
  const { audioLevel } = useAudioVisualizer(isListening);

  // Command handler for voice and text input
  const processUserInput = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isProcessing) return;

    // Deduplication check (prevents double firing within 1.2s)
    const now = Date.now();
    if (lastProcessedRef.current.text === cleanText && now - lastProcessedRef.current.timestamp < 1200) {
      return;
    }
    lastProcessedRef.current = { text: cleanText, timestamp: now };

    const textLower = cleanText.toLowerCase();

    // Check if user says close / selesai
    if (textLower === 'selesai' || textLower === 'tutup' || textLower === 'close' || textLower === 'back') {
      setActiveItem(null);
      setLiveSubtitle({
        en: "I'm back in the center! What would you like to learn next?",
        id: "Aku kembali ke tengah! Mau belajar apa lagi?",
      });
      speakText("I am back in the center! What would you like to do next?");
      return;
    }

    // Check if user is asking a conversational question or greeting
    const isConversationalIntent =
      textLower.includes('siapa') ||
      textLower.includes('apa kabar') ||
      textLower.includes('bisa apa') ||
      textLower.includes('how are you') ||
      textLower.includes('who are you') ||
      textLower.includes('hello') ||
      textLower.includes('halo') ||
      textLower.includes('hai') ||
      textLower.includes('terima kasih') ||
      textLower.includes('thank you') ||
      textLower.includes('kamu suka') ||
      textLower.includes('what is your') ||
      textLower.includes('ceritakan');

    // Check if user is asking to show or switch to a curriculum item (e.g. "show apple", "tampilkan gajah")
    const matched = findCurriculumItem(cleanText);
    const isShowIntent =
      textLower.includes('show') ||
      textLower.includes('tampilkan') ||
      textLower.includes('tunjukkan') ||
      textLower.includes('gambar') ||
      textLower.includes('lihat') ||
      textLower.includes('picture') ||
      textLower.includes('what is') ||
      textLower.includes('apa itu') ||
      textLower.includes('mana') ||
      textLower.includes('eja') ||
      textLower.includes('spelling') ||
      (matched && textLower.split(' ').length <= 2);

    // If a show request is detected, switch/display the item immediately
    if (matched && isShowIntent) {
      setActiveItem(matched.item, matched.topic.name);
      const replyEn = `Here is ${matched.item.word}! ${matched.item.example_en}`;
      const replyId = `Ini dia ${matched.item.meaning_id} (${matched.item.word})! Ayo coba lafalkan bersama Arvi.`;

      addChatMessage({ role: 'user', textEn: cleanText });
      setLiveSubtitle({ en: replyEn, id: replyId });
      addChatMessage({ role: 'arvi', textEn: replyEn, textId: replyId });
      speakText(replyEn);
      return;
    }

    // 1. If active item exists and user is NOT asking a conversational question or show request, evaluate pronunciation
    if (activeItem && !isConversationalIntent) {
      setIsProcessing(true);
      setEmotion('thinking');
      try {
        const evalRes = await evaluateSpeechApi(cleanText, activeItem.word, gradeLevel);
        setEvaluationResult(evalRes);

        if (evalRes.accuracy_percent >= 80) {
          addStars(5);
          setEmotion('cheering');
          speakText(`Awesome! Your pronunciation of ${activeItem.word} is perfect!`);
        } else if (evalRes.accuracy_percent >= 50) {
          addStars(2);
          setEmotion('happy');
          speakText(`Good try! Listen to me: ${activeItem.word}`);
        } else {
          setEmotion('thinking');
          speakText(`Keep practicing! Follow me: ${activeItem.word}`);
        }

        setLiveSubtitle({
          en: evalRes.feedback_en,
          id: evalRes.feedback,
        });
        return;
      } catch (err) {
        console.error('Eval error:', err);
      } finally {
        setIsProcessing(false);
      }
    }

    // 2. Add to chat history
    addChatMessage({
      role: 'user',
      textEn: cleanText,
    });
    setInputMessage('');
    setIsProcessing(true);
    setEmotion('thinking');

    try {
      // 4. Call Chat API
      const historyPayload = chatMessages.slice(-6).map((m) => ({
        role: m.role === 'arvi' ? 'assistant' : 'user',
        content: m.textEn,
      }));

      const response = await chatWithArviApi(cleanText, gradeLevel, historyPayload);

      // If backend attached a display_item, move ARVI to corner and show on center stage
      if (response.display_item) {
        setActiveItem(response.display_item, response.topic_id || 'Curriculum');
      }

      setLiveSubtitle({
        en: response.response_text_en,
        id: response.response_text_id,
      });

      addChatMessage({
        role: 'arvi',
        textEn: response.response_text_en,
        textId: response.response_text_id,
        correction: response.correction,
      });

      if (response.emotion) {
        setEmotion(response.emotion as any);
      }

      speakText(response.response_text_en);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Instant Web Speech Recognition (Real-time in browser)
  const {
    isSupported: isWebSpeechSupported,
    interimTranscript: webSpeechInterim,
    startListening: startWebSpeech,
    stopListening: stopWebSpeech,
  } = useSpeechRecognition({
    lang: 'id-ID',
    onResult: (resultText) => {
      if (resultText && resultText.trim()) {
        processUserInput(resultText.trim());
      }
    },
    onWakeWord: () => {
      speakText("Yes! I am listening.");
    },
  });

  // Local Faster-Whisper Backend STT (Fallback)
  const {
    isTranscribing,
    interimText: backendInterimText,
    startRecording: startBackendRecording,
    stopRecording: stopBackendRecording,
  } = useBackendTranscription();

  const handleStartListening = async () => {
    setIsInitialized(true);
    if (isWebSpeechSupported) {
      await startWebSpeech();
    } else {
      await startBackendRecording();
    }
  };

  const handleStopListening = async () => {
    if (isWebSpeechSupported) {
      stopWebSpeech();
      // processUserInput is called by onResult callback in useSpeechRecognition
    } else {
      const text = await stopBackendRecording();
      if (text) await processUserInput(text);
    }
  };

  const handleStartArvi = async () => {
    setIsInitialized(true);
    speakText("Hello! ARVI is ready. Click the microphone button and speak to me.");
  };

  const currentInterimDisplay = webSpeechInterim || backendInterimText;

  const quickActionChips = [
    { label: '🍎 Tampilkan Apel', text: 'Show me an Apple' },
    { label: '🦁 Tampilkan Singa', text: 'Show me a Lion' },
    { label: '🔴 Tampilkan Merah', text: 'Show me Red' },
    { label: '🎯 Main Kuis', text: "Let's play a quiz" },
    { label: '🎓 Ejaan Teacher', text: 'How to spell Teacher and IPA?' },
    { label: '💬 Halo Arvi', text: 'Hello Arvi, how are you?' },
  ];

  return (
    <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col justify-between overflow-hidden">
      {/* INITIAL ACTIVATION MODAL / BANNER (Required by browser security for microphone) */}
      {!isInitialized && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mx-auto mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 text-white shadow-xl flex items-center justify-between z-50 border border-white/20"
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
            <div className="text-xs">
              <p className="font-black">Klik tombol untuk mengaktifkan pendengaran ARVI</p>
              <p className="text-indigo-100 text-[11px]">Browser memerlukan izin klik sekali agar suara Anda dapat didengar otomatis.</p>
            </div>
          </div>
          <button
            onClick={handleStartArvi}
            className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-black text-xs shadow-md hover:bg-amber-300 hover:scale-105 transition-all shrink-0 cursor-pointer"
          >
            Aktifkan 🎙️
          </button>
        </motion.div>
      )}

      {/* Main Dynamic Stage Layout */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-[460px]">
        {/* ARVI AVATAR - DYNAMIC SPATIAL POSITIONING */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className={`z-30 transition-all duration-500 ${
            spatialState === 'corner'
              ? 'absolute top-1 right-2 sm:right-6 flex flex-col items-center'
              : 'relative flex flex-col items-center justify-center my-auto'
          }`}
        >
          <ArviAvatar
            size={spatialState === 'corner' ? 'md' : 'xl'}
            audioLevel={audioLevel}
            onClick={() => {
              if (!isInitialized) {
                handleStartArvi();
              } else {
                speakText(liveSubtitle.en);
              }
            }}
          />

          {spatialState === 'corner' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-indigo-900 bg-white/95 px-2.5 py-0.5 rounded-full shadow-xs mt-1 border"
            >
              Mode Pendamping 👁️
            </motion.span>
          )}
        </motion.div>

        {/* CENTER STAGE CARD (Appears in center when user asks to show item/quiz) */}
        <AnimatePresence>
          {activeItem && (
            <div className="w-full flex items-center justify-center py-2">
              <CenterStageCard
                item={activeItem}
                topicName={activeTopicName}
                evaluationResult={evaluationResult}
                onPlayAudio={(word) => speakText(word)}
                onClose={() => {
                  setActiveItem(null);
                  speakText("Returning to center!");
                }}
                onResetEvaluation={() => setEvaluationResult(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* IDLE / CHAT CENTER VIEW (When no card is active) */}
        {spatialState === 'center' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 w-full max-w-2xl flex flex-col items-center text-center"
          >
            {/* Real-time Subtitle & Voice Transcript */}
            <div className="w-full p-4 rounded-3xl bg-white/95 backdrop-blur-md shadow-xl border-2 border-indigo-100 flex flex-col items-center gap-1.5">
              {isTranscribing ? (
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm animate-pulse">
                  <Bot className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>Arvi sedang memproses suaramu... 🎙️</span>
                </div>
              ) : isListening ? (
                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm animate-pulse">
                  <Mic className="w-4 h-4 text-emerald-500" />
                  <span>&ldquo;{currentInterimDisplay || 'Mendengarkan... Silakan bicara'} &rdquo;</span>
                </div>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                    {liveSubtitle.en}
                  </p>
                  <p className="text-xs sm:text-sm font-medium italic text-slate-500">
                    &ldquo;{liveSubtitle.id}&rdquo;
                  </p>
                </>
              )}
            </div>

            {/* Audio Waveform Canvas */}
            <div className="mt-3">
              <AudioVisualizer level={audioLevel} isActive={isListening} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Control Dock: Push-to-Talk, Quick Action Chips & Text Input */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3 z-40 mt-2">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto w-full py-1">
          {quickActionChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => processUserInput(chip.text)}
              className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-xs font-bold text-slate-700 shadow-xs border border-indigo-100 hover:border-indigo-400 hover:text-indigo-600 transition-all shrink-0 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Voice Button & Text Input Box */}
        <div className="w-full flex items-center gap-3">
          {/* Main Push to Talk Button */}
          <MicButton
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            disabled={isProcessing || isTranscribing}
          />

          {/* Fallback Text Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processUserInput(inputMessage);
            }}
            className="flex-1 flex items-center gap-2 bg-white/95 rounded-full p-2 shadow-xl border-2 border-indigo-100"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Bicara atau ketik ke Arvi (misal: 'Tampilkan Apel', 'Main kuis')..."
              className="flex-1 px-4 py-2 text-xs sm:text-sm font-medium text-slate-800 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
