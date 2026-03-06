from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Import the actual AI service function
from app.services.ollama import generate_translation

# Load environment variables
load_dotenv()

router = APIRouter()

# Define the expected JSON payload from the React frontend
class TranslateRequest(BaseModel):
    source_language: str
    target_language: str
    source_code: str

# Define the expected JSON response sent back to React
class TranslateResponse(BaseModel):
    translated_code: str

@router.post("/translate", response_model=TranslateResponse)
async def translate_code(request: TranslateRequest):
    """
    Endpoint to translate code between languages using the local Ollama engine.
    """
    try:
        if not request.source_code.strip():
            raise HTTPException(status_code=400, detail="Source code cannot be empty.")

        # Call the real AI service
        translated = await generate_translation(
            source_lang=request.source_language,
            target_lang=request.target_language,
            source_code=request.source_code
        )
        
        return TranslateResponse(translated_code=translated)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Translation Engine Error: {str(e)}"
        )