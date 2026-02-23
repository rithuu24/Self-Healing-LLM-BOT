import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

# Initialize the FastAPI application
app = FastAPI(title="Self-Healing BOT API - Local RTX 2050 Edition")

# Configure CORS so your frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the expected JSON payload structure
class CodeRepairRequest(BaseModel):
    source_code: str
    language: str
    error_message: str

@app.post("/api/heal-code")
async def heal_code(request: CodeRepairRequest):
    try:
        # 1. System Prompt instructs the AI on formatting
        system_prompt = """
        You are an elite QA Automation Engineer and Code Optimizer. 
        You must fix the broken code and return a strictly formatted JSON response.
        
        Format required:
        {
            "fixed_code": "the exact fixed code string",
            "explanation": "A short, 1-sentence explanation of why it works",
            "confidence": 0.95
        }
        """

        # 2. User Prompt injects the dynamic broken code data
        user_prompt = f"""
        Language: {request.language}
        Error Message: {request.error_message}
        Broken Code:
        {request.source_code}
        """

        # 3. Call your local Ollama instance asynchronously
        client = ollama.AsyncClient()
        response = await client.chat(
            model='qwen2.5-coder:1.5b',  # Optimized 1.5B model for 4GB VRAM GPUs
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            format='json',               # Forces strictly valid JSON output
            options={
                'temperature': 0.2,      # Keeps logic strict
                'num_ctx': 2048          # Caps reading memory to prevent CUDA crashes
            }, 
            keep_alive=0                 # 🎯 Instantly unloads from VRAM after completion
        )

        # 4. Parse the local AI's string response into a Python dictionary
        ai_result = json.loads(response['message']['content'])

        # 5. Return the clean JSON payload
        return {
            "status": "success",
            "original_code": request.source_code,
            "fixed_code": ai_result.get("fixed_code"),
            "explanation": ai_result.get("explanation"),
            "confidence": ai_result.get("confidence", 0.9)
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Runs the server on localhost port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)