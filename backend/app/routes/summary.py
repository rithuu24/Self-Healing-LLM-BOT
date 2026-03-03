from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class SummaryRequest(BaseModel):
    incident: str

@router.post("/")
async def summarize_incident(request: SummaryRequest):
    prompt = f"""
Summarize this cybersecurity incident in 5 bullet points:

{request.incident}
"""
    result = query_ollama(prompt)
    return {"summary": result}