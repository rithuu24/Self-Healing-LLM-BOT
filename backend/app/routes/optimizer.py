from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Import the actual AI service function
from app.services.ollama import generate_optimization

# Load environment variables
load_dotenv()

router = APIRouter()

# Define the expected JSON payload from the React frontend
class OptimizerRequest(BaseModel):
    language: str
    source_code: str

# Define the expected JSON response sent back to React
class OptimizerResponse(BaseModel):
    optimized_code: str
    optimization_summary: str

@router.post("/optimize", response_model=OptimizerResponse)
async def optimize_code(request: OptimizerRequest):
    """
    Endpoint to optimize source code using the local Ollama engine.
    This replaces the previous mock implementation with a live AI call.
    """
    try:
        # Check if code is provided
        if not request.source_code.strip():
            raise HTTPException(status_code=400, detail="Source code cannot be empty.")

        # Call the real AI service
        # This function in app/services/ollama.py now handles the heavy lifting
        result = await generate_optimization(
            language=request.language, 
            source_code=request.source_code
        )
        
        # Return the AI-generated results to the frontend
        return OptimizerResponse(
            optimized_code=result["optimized_code"],
            optimization_summary=result["optimization_summary"]
        )
        
    except Exception as e:
        # If the LLM engine fails or is offline, return a 500 error
        raise HTTPException(
            status_code=500, 
            detail=f"Neural Engine Error: {str(e)}"
        )