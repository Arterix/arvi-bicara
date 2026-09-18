import { EvaluationResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function evaluateSpeechApi(
  spokenText: string,
  targetWord: string,
  gradeLevel: string = 'sd_low'
): Promise<EvaluationResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spoken_text: spokenText,
        target_word: targetWord,
        grade_level: gradeLevel,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[API] Evaluation API call failed, calculating fallback score locally:', err);
    // Local fallback evaluation
    const cleanSpoken = spokenText.trim().toLowerCase();
    const cleanTarget = targetWord.trim().toLowerCase();
    const isExact = cleanSpoken === cleanTarget || cleanSpoken.includes(cleanTarget);
    const score = isExact ? 100 : cleanSpoken.length > 0 ? 75 : 0;

    return {
      score,
      accuracy_percent: score,
      is_match: score >= 60,
      feedback: isExact
        ? `Luar biasa! Pengucapan kata '${targetWord}' tepat! 🌟`
        : `Bagus! Coba ulangi lagi agar semakin lancar! 👍`,
      feedback_en: isExact
        ? `Awesome! Pronunciation for '${targetWord}' is right!`
        : `Nice try! Practice once more to make it perfect!`,
      ipa_target: `/${targetWord.toLowerCase()}/`,
      soundex_match: isExact,
      grade: isExact ? 'Perfect' : 'Good',
    };
  }
}

export async function chatWithArviApi(
  message: string,
  gradeLevel: string = 'sd_low',
  history: Array<{ role: string; content: string }> = []
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        grade_level: gradeLevel,
        history,
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[API] Chat API call failed, generating offline conversational response:', err);
    return {
      response_text_en: `That's great! You said "${message}". Keep going!`,
      response_text_id: `Keren! Kamu berkata "${message}". Semangat terus belajar!`,
      correction: '',
      emotion: 'cheering',
    };
  }
}

export async function lookupTeacherWordApi(word: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/curriculum/lookup/${encodeURIComponent(word)}`);
    if (!res.ok) throw new Error(`Lookup error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Teacher lookup API failed, falling back locally:', err);
    return {
      word: word.charAt(0).toUpperCase() + word.slice(1),
      spelling: word.toUpperCase().split('').join(' - '),
      ipa: `/${word.toLowerCase()}/`,
      example_en: `Let's practice pronouncing the word ${word}.`,
      example_id: `Mari kita latih pengucapan kata ${word} bersama-sama.`,
    };
  }
}
