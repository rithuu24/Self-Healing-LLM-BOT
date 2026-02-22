import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import AsyncOpenAI
import json

# Load environment variables from the .env file
load_dotenv()

# Initialize OpenAI Client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="Guardian V2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRepairRequest(BaseModel):
    source_code: str
    language: str
    error_message: str

@app.post("/api/heal-code")
async def heal_code(request: CodeRepairRequest):
    try:
        # 1. The System Prompt tells the AI exactly how to act
        system_prompt = """
        You are an elite QA Automation Engineer and Code Optimizer. 
        The user will provide broken code and an error message. 
        You must fix the code and return a strictly formatted JSON response.
        Do not include markdown blocks like ```json. Just return raw JSON.
        Format required:
        {
            "fixed_code": "the exact fixed code string",
            "explanation": "A short, 1-sentence explanation of why it works",
            "confidence": 0.95
        }
        """

        # 2. The User Prompt provides the specific broken data
        user_prompt = f"""
        Language: {request.language}
        Error Message: {request.error_message}
        Broken Code:
        {request.source_code}
        """

        # 3. Call the AI
        response = await client.chat.completions.create(
            model="gpt-4o-mini", # Or whichever model you prefer
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2, # Keep it low for logical code fixes
            response_format={ "type": "json_object" } # Forces the AI to return valid JSON
        )

        # 4. Parse the AI's string response into an actual Python dictionary
        ai_result = json.loads(response.choices[0].message.content)

        # 5. Send it back to Postman / React!
        return {
            "status": "success",
            "original_code": request.source_code,
            "fixed_code": ai_result.get("fixed_code"),
            "explanation": ai_result.get("explanation"),
            "confidence": ai_result.get("confidence")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))