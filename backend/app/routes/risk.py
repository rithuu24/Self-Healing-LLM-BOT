from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class RiskRequest(BaseModel):
    data: str

@router.post("/")
async def risk_score(request: RiskRequest):
    prompt = f"""
Based on the following data, give a risk score (1-100).

Return STRICT JSON:
{{
  "risk_score": number,
  "explanation": ""
}}

Data:
{request.data}
"""
    result = query_ollama(prompt)
    return {"risk": result}