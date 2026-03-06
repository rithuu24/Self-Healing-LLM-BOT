from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Import the actual AI service function
from app.services.ollama import generate_heal

# Load environment variables
load_dotenv()

router = APIRouter()

# Define the expected JSON payload from the React frontend
class HealRequest(BaseModel):
    language: str
    error_message: str
    source_code: str

# Define the expected JSON response sent back to React
class HealResponse(BaseModel):
    explanation: str
    fixed_code: str

@router.post("/heal-code", response_model=HealResponse)
async def heal_broken_code(request: HealRequest):
    """
    Endpoint to repair broken code using the local Ollama engine.
    """
    try:
        if not request.source_code.strip():
            raise HTTPException(status_code=400, detail="Source code cannot be empty.")

        # Call the real AI service
        result = await generate_heal(
            language=request.language,
            error_message=request.error_message,
            source_code=request.source_code
        )
        
        return HealResponse(
            explanation=result["explanation"],
            fixed_code=result["fixed_code"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Healing Engine Error: {str(e)}"
        )