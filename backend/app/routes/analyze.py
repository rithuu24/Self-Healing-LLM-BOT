from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ollama import query_ollama
import json
import re

router = APIRouter()


class LogRequest(BaseModel):
    logs: str


def clean_json(text: str):
    """
    Remove markdown formatting from LLM response
    """
    text = re.sub(r"```json|```", "", text)
    return text.strip()


@router.post("/")
async def analyze_logs(request: LogRequest):

    prompt = f"""
You are a cybersecurity threat detection AI.

Analyze the following system logs and detect anomalies.

IMPORTANT RULES:
Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.

Format:
{{
  "threat_level": "LOW | MEDIUM | HIGH | CRITICAL",
  "anomalies": [
    {{
      "type": "",
      "source": "",
      "reason": ""
    }}
  ],
  "recommendation": ""
}}

Logs:
{request.logs}
"""

    try:
        result = query_ollama(prompt)

        cleaned = clean_json(result)

        parsed = json.loads(cleaned)

        return parsed

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Model returned invalid JSON"
        )