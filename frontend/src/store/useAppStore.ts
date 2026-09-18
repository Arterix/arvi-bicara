import { create } from 'zustand';
import { GradeLevel, ArviEmotion, ChatMessage, CurriculumItem, EvaluationResult } from '@/types';

interface AppState {
  gradeLevel: GradeLevel;
  setGradeLevel: (grade: GradeLevel) => void;

  emotion: ArviEmotion;
  setEmotion: (emotion: ArviEmotion) => void;

  totalStars: number;
  addStars: (amount: number) => void;

  // Spatial UI State: 'center' (idle/chat) vs 'corner' (displaying item/quiz on center stage)
  spatialState: 'center' | 'corner';
  setSpatialState: (state: 'center' | 'corner') => void;

  // Active Center Stage Item
  activeItem: CurriculumItem | null;
  setActiveItem: (item: CurriculumItem | null, topicName?: string) => void;
  activeTopicName: string;

  // Evaluation & Quiz state
  evaluationResult: EvaluationResult | null;
  setEvaluationResult: (res: EvaluationResult | null) => void;

  // Wake word background monitoring toggle
  isWakeWordActive: boolean;
  setIsWakeWordActive: (active: boolean) => void;

  isListening: boolean;
  setIsListening: (val: boolean) => void;

  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  gradeLevel: 'sd_low',
  setGradeLevel: (grade) => set({ gradeLevel: grade }),

  emotion: 'happy',
  setEmotion: (emotion) => set({ emotion }),

  totalStars: 0,
  addStars: (amount) => set((state) => ({ totalStars: state.totalStars + amount })),

  spatialState: 'center',
  setSpatialState: (spatialState) => set({ spatialState }),

  activeItem: null,
  activeTopicName: 'General',
  setActiveItem: (item, topicName = 'General') =>
    set({
      activeItem: item,
      activeTopicName: topicName,
      spatialState: item ? 'corner' : 'center',
      evaluationResult: null,
    }),

  evaluationResult: null,
  setEvaluationResult: (evaluationResult) => set({ evaluationResult }),

  isWakeWordActive: true,
  setIsWakeWordActive: (isWakeWordActive) => set({ isWakeWordActive }),

  isListening: false,
  setIsListening: (isListening) => set({ isListening }),

  isSpeaking: false,
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),

  chatMessages: [
    {
      id: 'welcome-1',
      role: 'arvi',
      textEn: "Hi! I am Arvi, your AI English speaking partner! Call me anytime with 'Hi Arvi'! 🌟",
      textId: "Halo! Aku Arvi, teman latihan bicara Bahasa Inggrismu! Panggil aku kapan saja dengan 'Hi Arvi'! 🌟",
      timestamp: Date.now(),
    },
  ],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: Date.now(),
        },
      ],
    })),
  clearChatMessages: () => set({ chatMessages: [] }),
}));
