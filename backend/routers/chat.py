from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llm_service import LLMService

router = APIRouter(prefix="/api/chat", tags=["Chat"])
llm_service = LLMService()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    grade_level: Optional[str] = "sd_low"
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    response_text_en: str
    response_text_id: str
    correction: Optional[str] = ""
    emotion: Optional[str] = "happy"

@router.post("", response_model=ChatResponse)
async def chat_with_arvi(payload: ChatRequest):
    """
    Conversational English practice endpoint. Returns bilingual response + emotion.
    """
    result = await llm_service.generate_response(
        message=payload.message,
        grade_level=payload.grade_level,
        history=payload.history
    )
    return result
