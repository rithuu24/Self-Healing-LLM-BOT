from fastapi import APIRouter
from pydantic import BaseModel
import json
import re

from app.services.ollama import query_ollama

router = APIRouter()

class OptimizeRequest(BaseModel):
    code: str
    language: str


def clean_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    return json.loads(text)


@router.post("/")
async def optimize_code(request: OptimizeRequest):

    prompt = f"""
Optimize the following {request.language} code.

Return JSON only:

{{
 "optimized_code": "",
 "optimization_summary": ""
}}

Code:
{request.code}
"""

    result = query_ollama(prompt)

    parsed = clean_json(result)

    return parsed