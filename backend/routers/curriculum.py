from fastapi import APIRouter, HTTPException
import json
from pathlib import Path
import eng_to_ipa as ipa

router = APIRouter(prefix="/api/curriculum", tags=["Curriculum"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "curriculum.json"

@router.get("")
async def get_curriculum():
    """
    Get full list of topics and items.
    """
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Curriculum data not found.")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

@router.get("/lookup/{word}")
async def lookup_word(word: str):
    """
    Teacher tool: lookup IPA, spelling, and syllabification for any English word.
    """
    clean_word = word.strip().lower()
    ipa_transcription = ipa.convert(clean_word)
    spelling = " - ".join(list(clean_word.upper()))

    return {
        "word": clean_word.capitalize(),
        "spelling": spelling,
        "ipa": f"/{ipa_transcription}/",
        "example_en": f"Let's practice the word {clean_word}.",
        "example_id": f"Mari kita latih kata {clean_word} bersama-sama."
    }
