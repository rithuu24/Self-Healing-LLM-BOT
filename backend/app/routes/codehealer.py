from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ollama import query_ollama

router = APIRouter()

class SummaryRequest(BaseModel):
    logs: str

@router.post("/")
async def summarize_logs(request: SummaryRequest):
    prompt = f"Summarize the following logs:\n{request.logs}"
    result = query_ollama(prompt)
    return {"summary": result}