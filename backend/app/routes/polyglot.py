from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class PolyglotRequest(BaseModel):
    source_code: str
    source_lang: str
    target_lang: str

@router.post("/")
async def translate_code(request: PolyglotRequest):
    prompt = f"""
Convert this {request.source_lang} code into {request.target_lang}.

Return only the translated code.

Code:
{request.source_code}
"""

    result = query_ollama(prompt)
    return {"translated_code": result}