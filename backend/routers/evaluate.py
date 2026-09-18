from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.scoring_service import ScoringService

router = APIRouter(prefix="/api/evaluate", tags=["Evaluation"])

class EvaluationRequest(BaseModel):
    spoken_text: str
    target_word: str
    grade_level: Optional[str] = "sd_low"

class EvaluationResponse(BaseModel):
    score: int
    accuracy_percent: int
    is_match: bool
    feedback: str
    feedback_en: str
    ipa_target: str
    soundex_match: bool
    grade: str
    metrics: Optional[dict] = None

@router.post("", response_model=EvaluationResponse)
async def evaluate_speech(payload: EvaluationRequest):
    """
    Evaluate student's spoken utterance against expected curriculum target word.
    """
    if not payload.target_word:
        raise HTTPException(status_code=400, detail="Target word is required for evaluation.")

    result = ScoringService.evaluate_pronunciation(
        spoken_text=payload.spoken_text,
        target_word=payload.target_word
    )
    return result
