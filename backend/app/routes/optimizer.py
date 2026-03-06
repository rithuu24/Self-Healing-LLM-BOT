from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

# Import the Ollama service (we will write this next)
from app.services.ollama import generate_optimization

# Initialize the router
router = APIRouter()
logger = logging.getLogger(__name__)

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
    try:
        logger.info(f"Optimizing {request.language} code...")
        
        # Call the LLM service
        result = await generate_optimization(
            language=request.language, 
            source_code=request.source_code
        )
        
        return OptimizerResponse(
            optimized_code=result["optimized_code"],
            optimization_summary=result["optimization_summary"]
        )
        
    except Exception as e:
        logger.error(f"Optimization failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LLM Engine Error: {str(e)}")