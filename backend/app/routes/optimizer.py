from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class OptimizeRequest(BaseModel):
    code: str
    language: str

@router.post("/")
async def optimize_code(request: OptimizeRequest):
    prompt = f"""
Optimize the following {request.language} code.

Return JSON:
{{
  "optimized_code": "",
  "time_complexity": "",
  "space_complexity": "",
  "improvements": []
}}

Code:
{request.code}
"""

    result = query_ollama(prompt)
    return {"response": result}