import Levenshtein
import jellyfish
import eng_to_ipa as ipa
import re

class ScoringService:
    @staticmethod
    def clean_text(text: str) -> str:
        """Strip punctuation and normalize casing."""
        return re.sub(r'[^a-zA-Z0-9\s]', '', text).strip().lower()

    @classmethod
    def evaluate_pronunciation(cls, spoken_text: str, target_word: str) -> dict:
        """
        Evaluate pronunciation accuracy using a multi-algorithm blend:
        1. Normalized Levenshtein ratio (0.0 - 1.0)
        2. Metaphone phonetic equality / distance
        3. Soundex matching
        4. Jaro-Winkler similarity
        """
        clean_spoken = cls.clean_text(spoken_text)
        clean_target = cls.clean_text(target_word)

        if not clean_spoken:
            return {
                "score": 0,
                "accuracy_percent": 0,
                "is_match": False,
                "feedback": "Suara belum terdengar jelas. Yuk coba bicara lagi!",
                "feedback_en": "I couldn't hear clearly. Let's try again!",
                "ipa_target": ipa.convert(target_word),
                "soundex_match": False,
                "grade": "Try Again"
            }

        # Exact match check
        if clean_spoken == clean_target or clean_target in clean_spoken.split():
            return {
                "score": 100,
                "accuracy_percent": 100,
                "is_match": True,
                "feedback": "Luar biasa! Pelafalan kamu sangat sempurna! 🌟",
                "feedback_en": "Awesome! Your pronunciation is perfect! 🌟",
                "ipa_target": ipa.convert(target_word),
                "soundex_match": True,
                "grade": "Perfect"
            }

        # 1. Levenshtein ratio (0.0 to 1.0)
        lev_ratio = Levenshtein.ratio(clean_spoken, clean_target)

        # 2. Jaro-Winkler similarity (0.0 to 1.0)
        jaro_score = jellyfish.jaro_winkler_similarity(clean_spoken, clean_target)

        # 3. Soundex code comparison
        soundex_spoken = jellyfish.soundex(clean_spoken)
        soundex_target = jellyfish.soundex(clean_target)
        soundex_match = (soundex_spoken == soundex_target)

        # 4. Metaphone phonetic representation
        meta_spoken = jellyfish.metaphone(clean_spoken)
        meta_target = jellyfish.metaphone(clean_target)
        meta_lev = Levenshtein.ratio(meta_spoken, meta_target) if meta_spoken and meta_target else 0.0

        # Weighted combined score (percentage 0 - 100)
        # Weights: 40% Levenshtein, 30% Jaro-Winkler, 30% Metaphone phonetic
        combined_raw = (0.4 * lev_ratio) + (0.3 * jaro_score) + (0.3 * meta_lev)
        if soundex_match and combined_raw < 0.8:
            combined_raw = min(1.0, combined_raw + 0.15)

        accuracy_percent = int(round(combined_raw * 100))
        accuracy_percent = max(0, min(100, accuracy_percent))

        # Qualitative grading & kid-friendly feedback
        if accuracy_percent >= 85:
            is_match = True
            grade = "Excellent"
            feedback = f"Hebat sekali! Pelafalan '{target_word}' kamu tepat ({accuracy_percent}%)! 🎉"
            feedback_en = f"Great job! Your pronunciation of '{target_word}' is accurate ({accuracy_percent}%)!"
        elif accuracy_percent >= 65:
            is_match = True
            grade = "Good"
            feedback = f"Bagus! Sudah mendekati ({accuracy_percent}%). Coba dengarkan Arvi dan ulangi ya! 👍"
            feedback_en = f"Good attempt ({accuracy_percent}%)! Listen to Arvi and try once more!"
        else:
            is_match = False
            grade = "Keep Trying"
            feedback = f"Hampir bisa ({accuracy_percent}%). Jangan menyerah, yuk tirukan suara Arvi! 💪"
            feedback_en = f"Keep practicing ({accuracy_percent}%)! Follow Arvi's voice!"

        return {
            "score": accuracy_percent,
            "accuracy_percent": accuracy_percent,
            "is_match": is_match,
            "feedback": feedback,
            "feedback_en": feedback_en,
            "ipa_target": ipa.convert(target_word),
            "soundex_match": soundex_match,
            "grade": grade,
            "metrics": {
                "levenshtein": round(lev_ratio, 2),
                "jaro_winkler": round(jaro_score, 2),
                "metaphone_similarity": round(meta_lev, 2)
            }
        }
