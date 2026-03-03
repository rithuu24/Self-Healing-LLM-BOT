from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import uvicorn

# ==========================================
# 1. API INITIALIZATION & CONFIGURATION
# ==========================================
app = FastAPI(
    title="Polyglot Bridge API - Local RTX 2050 Edition",
    description="Standalone backend for translating code across Python, Java, TypeScript, and JavaScript.",
    version="1.0.0"
)

# Enable CORS so your React frontend can communicate with this API without blocking errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, change this to ["http://localhost:3000"] or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local AI Configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen"  # Matches the local model you are running

# ==========================================
# 2. DATA MODELS (Request Validation)
# ==========================================
class TranslationRequest(BaseModel):
    source_language: str
    target_language: str
    source_code: str

# ==========================================
# 3. THE POLYGLOT TRANSLATION ENDPOINT
# ==========================================
@app.post("/api/translate")
async def translate_code(req: TranslationRequest):
    print(f"🚀 Received translation request: {req.source_language} -> {req.target_language}")
    
    # Craft the prompt to force strict, high-quality code translation
    prompt = f"""
    You are an expert compiler and senior polyglot software engineer. 
    Translate the following {req.source_language} code directly into idiomatic {req.target_language}.
    Ensure the syntax, types, and standard libraries strictly match {req.target_language} best practices.
    
    Source Code:
    {req.source_code}
    
    Respond ONLY with a JSON object containing this exact key:
    "translated_code" (a string containing the final translated code)
    """
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "format": "json", # Forces the local LLM to return valid JSON
        "stream": False
    }
    
    try:
        # Send the request to your local GPU-powered Ollama model
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        
        # Extract and parse the JSON response from the AI
        ai_output = response.json().get("response", "{}")
        parsed_result = json.loads(ai_output)
        
        print("✅ Translation complete!")
        
        # Return the clean payload to the React frontend
        return {
            "status": "success",
            "source_language": req.source_language,
            "target_language": req.target_language,
            "translated_code": parsed_result.get("translated_code", "// Translation failed. Please try again.")
        }
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {str(e)}")
        raise HTTPException(status_code=503, detail="Could not connect to the local Ollama instance. Is it running?")
    except json.JSONDecodeError:
        print("❌ Formatting Error: AI did not return valid JSON.")
        raise HTTPException(status_code=500, detail="AI returned invalid formatting. Please retry.")

# ==========================================
# 4. SERVER EXECUTION
# ==========================================
if __name__ == "__main__":
    print("==================================================")
    print("🔥 Starting Polyglot Bridge Backend Server...")
    print("⚙️  Ensure Ollama is running: 'ollama run qwen'")
    print("==================================================")
    uvicorn.run("polyglot_backend:app", host="127.0.0.1", port=8000, reload=True) 