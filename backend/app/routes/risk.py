from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ollama import query_ollama
import json
import re

router = APIRouter()

class RiskRequest(BaseModel):
    logs: str


def clean_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    return text


@router.post("/")
async def calculate_risk(request: RiskRequest):

    prompt = f"""
You are a cybersecurity AI.

Analyze the following logs and estimate system risk.

Return ONLY valid JSON.

Format:
{{
  "risk_score": 0,
  "risk_level": "LOW | MEDIUM | HIGH | CRITICAL",
  "reason": "",
  "recommended_action": ""
}}

Logs:
{request.logs}
"""

    result = query_ollama(prompt)

    try:
        cleaned = clean_json(result)
        parsed = json.loads(cleaned)
        return parsed

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Model returned invalid JSON"
        )