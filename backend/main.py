import os
import json
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# --- 1. SETUP LOGGING ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GuardianAPI")

# 2. Load environment variables
load_dotenv()

# --- 3. RETRY LOGIC ---
# This will catch the 'ResourceExhausted' (429) error and retry
# It waits 2s, then 4s, then 8s... up to 10s max.
def before_retry_log(retry_state):
    logger.info(f"🔄 Rate limit hit. Retrying attempt {retry_state.attempt_number}...")

gemini_retry_strategy = retry(
    retry=retry_if_exception_type(Exception), # In SDK v2, check generic or specific 429 string
    wait=wait_exponential(multiplier=1, min=2, max=10),
    stop=stop_after_attempt(5),
    before_sleep=before_retry_log,
    reraise=True
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("❌ GEMINI_API_KEY not found in .env file.")
        sys.exit(1)
    logger.info(f"✅ Gemini API Key detected. {app.title} is ready.")
    yield

# 4. Initialize FastAPI
app = FastAPI(title="Guardian V2 API - Gemini Edition", lifespan=lifespan)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 5. LOGGING MIDDLEWARE ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"📩 Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"📤 Response status: {response.status_code}")
    return response

class CodeRepairRequest(BaseModel):
    source_code: str
    language: str
    error_message: str

# --- 6. WRAPPED API CALL ---
@gemini_retry_strategy
async def get_gemini_fix(user_prompt, system_prompt):
    return await client.aio.models.generate_content(
        model="gemini-1.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.2,
            response_mime_type="application/json",
        ),
        contents=user_prompt
    )

@app.post("/api/heal-code")
async def heal_code(request: CodeRepairRequest):
    try:
        system_prompt = """
        You are an elite QA Automation Engineer and Code Optimizer. 
        You must fix the code and return a strictly formatted JSON response.
        Format: {"fixed_code": "string", "explanation": "string", "confidence": float}
        """

        user_prompt = f"Language: {request.language}\nError: {request.error_message}\nCode:\n{request.source_code}"

        # Call the retrying function
        response = await get_gemini_fix(user_prompt, system_prompt)
        ai_result = json.loads(response.text)

        return {
            "status": "success",
            "original_code": request.source_code,
            "fixed_code": ai_result.get("fixed_code"),
            "explanation": ai_result.get("explanation"),
            "confidence": ai_result.get("confidence")
        }

    except Exception as e:
        # Check if it's still a 429 after retries
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            raise HTTPException(status_code=429, detail="Gemini quota exhausted. Please try again in a minute.")
        logger.error(f"Final Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)