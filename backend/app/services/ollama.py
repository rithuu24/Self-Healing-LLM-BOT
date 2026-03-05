from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ollama import query_ollama
import json
import re

router = APIRouter()

class LogRequest(BaseModel):
    logs: str

def clean_json_response(text: str):
    # Remove markdown code blocks if present
    text = re.sub(r"```json|```", "", text).strip()
    return text

@router.post("/")
async def analyze_logs(request: LogRequest):
    prompt = f"""
You are a cybersecurity AI.

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not explain anything.

Format:
{{
  "threat_level": "LOW | MEDIUM | HIGH",
  "anomalies": [],
  "recommendation": ""
}}

Logs:
{request.logs}
"""

    raw_result = query_ollama(prompt)

    try:
        cleaned = clean_json_response(raw_result)
        parsed = json.loads(cleaned)
        return parsed  # return real JSON
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Model returned invalid JSON"
        )