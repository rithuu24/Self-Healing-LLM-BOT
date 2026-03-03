from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class LogRequest(BaseModel):
    logs: str

@router.post("/")
async def analyze_logs(request: LogRequest):
    if not request.logs:
        raise HTTPException(status_code=400, detail="Logs required")

    prompt = f"""
You are a cybersecurity AI.

Analyze the logs below and return STRICT JSON:
{{
  "threat_level": "",
  "anomalies": [],
  "recommendation": ""
}}

Logs:
{request.logs}
"""

    result = query_ollama(prompt)
    return {"result": result}