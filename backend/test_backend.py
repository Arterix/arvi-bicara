import sys
from services.scoring_service import ScoringService
from services.llm_service import LLMService
import asyncio

def test_scoring():
    print("Testing ScoringService...")
    res1 = ScoringService.evaluate_pronunciation("apple", "Apple")
    print(f"Exact match: score={res1['score']}, grade={res1['grade']}")
    assert res1['score'] == 100

    res2 = ScoringService.evaluate_pronunciation("apel", "Apple")
    print(f"Near match ('apel' vs 'Apple'): score={res2['score']}, is_match={res2['is_match']}, grade={res2['grade']}")
    assert res2['accuracy_percent'] > 50

    res3 = ScoringService.evaluate_pronunciation("watermelon", "Cat")
    print(f"Mismatch: score={res3['score']}, is_match={res3['is_match']}")
    assert res3['score'] < 50
    print("ScoringService tests PASSED!")

async def test_llm():
    print("Testing LLMService offline fallback...")
    llm = LLMService()
    res = await llm.generate_response("Hello Arvi", grade_level="paud")
    print(f"LLM EN: {res.get('response_text_en')}")
    assert "response_text_en" in res
    assert "response_text_id" in res

    # Test display intent
    res2 = await llm.generate_response("Show me an Apple")
    print(f"Display Intent: has_item={bool(res2.get('display_item'))}")
    assert res2.get("display_item") is not None

    print("LLMService tests PASSED!")

if __name__ == "__main__":
    test_scoring()
    asyncio.run(test_llm())
    print("\nALL BACKEND UNIT TESTS PASSED!")
