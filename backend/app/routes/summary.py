from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ollama import query_ollama
import json
import re

router = APIRouter()

class SummaryRequest(BaseModel):
    logs: str


def clean_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    return text


@router.post("/")
async def summarize_logs(request: SummaryRequest):

    prompt = f"""
You are a cybersecurity analyst.

Summarize the following system logs.

IMPORTANT:
Return ONLY valid JSON.

Format:
{{
  "summary": "",
  "main_issues": [],
  "recommended_actions": []
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