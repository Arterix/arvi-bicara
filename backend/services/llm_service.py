import json
import os
import re
from openai import OpenAI
from pathlib import Path
import eng_to_ipa as ipa

# Load prompts and curriculum
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PROMPTS_PATH = DATA_DIR / "prompts.json"
CURRICULUM_PATH = DATA_DIR / "curriculum.json"

try:
    with open(PROMPTS_PATH, "r", encoding="utf-8") as f:
        SYSTEM_PROMPTS = json.load(f).get("system_prompts", {})
except Exception:
    SYSTEM_PROMPTS = {}

try:
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        CURRICULUM_TOPICS = json.load(f).get("topics", [])
except Exception:
    CURRICULUM_TOPICS = []

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OMNIROUTE_API_KEY", "omniroute-arvi-demo-key")
        self.base_url = os.getenv("OMNIROUTE_BASE_URL", "https://api.omniroute.ai/v1")
        self.model = os.getenv("OMNIROUTE_MODEL", "gpt-4o-mini")

        try:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        except Exception:
            self.client = None

    def _search_curriculum(self, text: str):
        """Find matching curriculum word in the knowledge bank."""
        words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        for topic in CURRICULUM_TOPICS:
            for item in topic.get("items", []):
                item_word = item.get("word", "").lower()
                item_meaning = item.get("meaning_id", "").lower()
                if item_word in words or item_meaning in text.lower():
                    return item, topic
        return None, None

    async def generate_response(self, message: str, grade_level: str = "sd_low", history: list = None) -> dict:
        """
        Intelligent intent detection & bilingual response.
        Detects:
        1. Show Word / Flashcard intent ("Show me an apple", "Tampilkan kucing", "Apa bahasa inggrisnya singa")
        2. Quiz intent ("Ayo main kuis", "Tanya aku", "Quiz time")
        3. Teacher / Phonetic lookup intent ("Cara baca X", "IPA for X", "Ejaan X")
        4. Free speech conversation ("Hi Arvi", "What are you doing", etc.)
        """
        msg_lower = message.strip().lower()
        matched_item, matched_topic = self._search_curriculum(message)

        # 1. Intent: Explicit Display / Show Request or Match Found with 'show'/'tampilkan'/'gambar'/'eja'
        wants_display = any(k in msg_lower for k in ["show", "tampilkan", "gambar", "lihat", "eja", "spelling", "cara baca", "pronounce", "ipa", "what is", "apa itu"])
        
        if matched_item and (wants_display or len(msg_lower.split()) <= 3):
            word = matched_item["word"]
            return {
                "response_text_en": f"Here is {word}! {matched_item['example_en']}",
                "response_text_id": f"Ini dia {matched_item['meaning_id']} ({word})! Ayo coba lafalkan bersama Arvi.",
                "correction": "",
                "emotion": "happy",
                "display_item": matched_item,
                "topic_id": matched_topic["id"] if matched_topic else "fruits"
            }

        # 2. Intent: Quiz Request
        if any(k in msg_lower for k in ["quiz", "kuis", "main kuis", "tebak", "test me", "latihan"]):
            # Pick a topic
            topic = CURRICULUM_TOPICS[0]
            for t in CURRICULUM_TOPICS:
                if t["id"] in msg_lower or t["name"].lower() in msg_lower or t["name_id"].lower() in msg_lower:
                    topic = t
                    break
            first_item = topic["items"][0]
            return {
                "response_text_en": f"Let's play a quiz about {topic['name']}! Can you say this word?",
                "response_text_id": f"Ayo main kuis topik {topic['name_id']}! Bisakah kamu ucapkan kata ini?",
                "correction": "",
                "emotion": "cheering",
                "display_item": first_item,
                "topic_id": topic["id"]
            }

        # 3. Intent: Wake Word Greeting
        if any(msg_lower.startswith(w) for w in ["hi arvi", "hello arvi", "hey arvi", "halo arvi", "arvi"]):
            clean_cmd = re.sub(r'^(hi|hello|hey|halo)\s+arvi[,!\s]*', '', msg_lower).strip()
            if not clean_cmd:
                return {
                    "response_text_en": "Yes! I am listening. What would you like to learn or say?",
                    "response_text_id": "Ya! Aku siap mendengarkan. Mau belajar atau ngobrol apa hari ini?",
                    "correction": "",
                    "emotion": "cheering"
                }

        # 4. Try Cloud API if available
        if self.client and self.api_key and self.api_key != "omniroute-arvi-demo-key":
            try:
                system_prompt = SYSTEM_PROMPTS.get(grade_level, SYSTEM_PROMPTS.get("sd_low", ""))
                messages = [{"role": "system", "content": system_prompt}]
                if history:
                    for item in history[-6:]:
                        messages.append({"role": item.get("role", "user"), "content": item.get("content", "")})
                messages.append({"role": "user", "content": message})

                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    response_format={"type": "json_object"}
                )
                raw = json.loads(response.choices[0].message.content)
                return raw
            except Exception as e:
                print(f"[LLMService] API Call fallback: {e}")

        # 5. High-Quality Offline Conversational Responses
        return self._generate_offline_response(message, grade_level)

    def _generate_offline_response(self, message: str, grade_level: str) -> dict:
        msg_lower = message.strip().lower()

        if any(w in msg_lower for w in ["hello", "hi", "halo", "hai", "good morning", "selamat pagi"]):
            return {
                "response_text_en": "Hello! I am Arvi, your English speaking partner. How are you today?",
                "response_text_id": "Halo! Aku Arvi, teman belajarmu. Bagaimana kabarmu hari ini?",
                "correction": "",
                "emotion": "cheering"
            }

        if "who are you" in msg_lower or "siapa kamu" in msg_lower:
            return {
                "response_text_en": "I am Arvi, your AI friend to help you speak English with confidence!",
                "response_text_id": "Aku Arvi, teman AI yang siap membantumu lancar berbahasa Inggris!",
                "correction": "",
                "emotion": "happy"
            }

        if "how are you" in msg_lower or "apa kabar" in msg_lower:
            return {
                "response_text_en": "I am super excited and happy to chat with you! What is your favorite hobby?",
                "response_text_id": "Aku sangat senang bisa mengobrol bersamamu! Apa hobi kesukaanmu?",
                "correction": "",
                "emotion": "happy"
            }

        # Default conversational replies by grade level
        if grade_level == "paud":
            return {
                "response_text_en": f"Wonderful! You said '{message}'. You are so great!",
                "response_text_id": f"Hebat sekali! Kamu bilang '{message}'. Keren!",
                "correction": "",
                "emotion": "cheering"
            }
        elif grade_level == "sd_high":
            return {
                "response_text_en": f"That sounds very interesting! Can you tell me more about that in English?",
                "response_text_id": f"Terdengar sangat menarik! Bisakah kamu ceritakan lebih banyak dalam bahasa Inggris?",
                "correction": "",
                "emotion": "thinking"
            }
        else:
            return {
                "response_text_en": f"Awesome! Keep practicing speaking with me.",
                "response_text_id": f"Luar biasa! Teruslah berlatih bicara bersamaku ya.",
                "correction": "",
                "emotion": "happy"
            }
