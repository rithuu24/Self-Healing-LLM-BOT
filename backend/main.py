from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json

# ==========================================
# API CONFIGURATION
# ==========================================
app = FastAPI(
    title="Self-Healing BOT API - Local RTX 2050 Edition",
    description="Backend for Automated Maintenance of Software Quality",
    version="1.0.0"
)

# Allow your React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"
# You can change this to "qwen2.5-coder" or whichever model you run locally
OLLAMA_MODEL = "qwen" 

# ==========================================
# PYDANTIC DATA MODELS (Request Schemas)
# ==========================================
class HealerRequest(BaseModel):
    language: str
    error_message: str
    source_code: str

class PolyglotRequest(BaseModel):
    source_language: str
    target_language: str
    source_code: str

class AnalyticsRequest(BaseModel):
    language: str
    source_code: str

class OptimizerRequest(BaseModel):
    language: str
    source_code: str

# ==========================================
# HELPER FUNCTION TO CALL OLLAMA
# ==========================================
def call_ollama(prompt: str) -> dict:
    """Sends a prompt to the local Ollama instance and returns parsed JSON."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "format": "json", # Forces the RTX 2050 to return strictly valid JSON
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        
        # Ollama returns a JSON with a 'response' string that contains our requested JSON
        ai_output = response.json().get("response", "{}")
        return json.loads(ai_output)
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Ollama connection error: {str(e)}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON.")

# ==========================================
# 1. THE HEALER TAB ENDPOINT
# ==========================================
@app.post("/api/heal-code")
async def heal_code(req: HealerRequest):
    prompt = f"""
    You are an expert {req.language} debugging AI. Analyze the following broken code and its error message.
    Error Message: {req.error_message}
    Broken Code:
    {req.source_code}
    
    Respond ONLY with a JSON object containing these exact keys:
    "explanation" (string explaining the bug concisely),
    "fixed_code" (string containing the corrected code),
    "confidence" (string, e.g., "95%")
    """
    return call_ollama(prompt)

# ==========================================
# 2. THE POLYGLOT TAB ENDPOINT
# ==========================================
@app.post("/api/translate")
async def translate_code(req: PolyglotRequest):
    prompt = f"""
    You are an expert software engineer. Translate the following {req.source_language} code into {req.target_language}.
    Ensure the translation follows the idiomatic best practices of {req.target_language}.
    
    Source Code:
    {req.source_code}
    
    Respond ONLY with a JSON object containing these exact keys:
    "translation_notes" (string explaining key syntax changes),
    "translated_code" (string containing the final code)
    """
    return call_ollama(prompt)

# ==========================================
# 3. THE ANALYTICS TAB ENDPOINT
# ==========================================
@app.post("/api/analyze")
async def analyze_code(req: AnalyticsRequest):
    prompt = f"""
    You are a senior code reviewer. Analyze the following {req.language} code for its structural complexity.
    
    Code to Analyze:
    {req.source_code}
    
    Respond ONLY with a JSON object containing these exact keys:
    "time_complexity" (string, e.g., "O(N)"),
    "space_complexity" (string, e.g., "O(1)"),
    "maintainability_score" (number from 1 to 100),
    "security_vulnerabilities" (string detailing any risks, or "None detected")
    """
    return call_ollama(prompt)

# ==========================================
# 4. THE OPTIMIZER TAB ENDPOINT
# ==========================================
@app.post("/api/optimize")
async def optimize_code(req: OptimizerRequest):
    prompt = f"""
    You are an expert performance engineer. Refactor the following {req.language} code to make it faster, cleaner, and more efficient.
    
    Original Code:
    {req.source_code}
    
    Respond ONLY with a JSON object containing these exact keys:
    "optimization_summary" (string explaining what you improved and why),
    "optimized_code" (string containing the refactored code)
    """
    return call_ollama(prompt)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Self-Healing BOT API - Local RTX 2050 Edition...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)