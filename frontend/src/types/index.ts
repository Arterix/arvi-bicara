export type GradeLevel = 'paud' | 'sd_low' | 'sd_high';

export type AppMode = 'siswa' | 'guru' | 'bebas';

export type ArviEmotion = 'happy' | 'thinking' | 'cheering' | 'listening' | 'speaking' | 'idle';

export interface CurriculumItem {
  id: string;
  word: string;
  phonetic: string;
  spelling: string;
  meaning_id: string;
  emoji: string;
  example_en: string;
  example_id: string;
  tips: string;
}

export interface CurriculumTopic {
  id: string;
  name: string;
  name_id: string;
  icon: string;
  color: string;
  items: CurriculumItem[];
}

export interface EvaluationResult {
  score: number;
  accuracy_percent: number;
  is_match: boolean;
  feedback: string;
  feedback_en: string;
  ipa_target: string;
  soundex_match: boolean;
  grade: string;
  metrics?: {
    levenshtein: number;
    jaro_winkler: number;
    metaphone_similarity: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'arvi';
  textEn: string;
  textId?: string;
  correction?: string;
  timestamp: number;
}
