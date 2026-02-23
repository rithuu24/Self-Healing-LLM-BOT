import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama

# Initialize the dedicated background API for auto_healer.py
app = FastAPI(title="Auto-Healer Background Bot")

# The exact payload structure sent by your auto_healer.py script
class AutoHealRequest(BaseModel):
    source_code: str
    language: str
    error_message: str

@app.post("/api/heal-code")
async def process_auto_heal(request: AutoHealRequest):
    try:
        # System prompt tailored for automated terminal errors
        system_prompt = """
        You are an automated Python debugging AI running in the background.
        Analyze the exact terminal error message and the broken source code.
        Return a strict JSON response containing the corrected code.
        
        Format required:
        {
            "fixed_code": "the complete, corrected code string",
            "explanation": "A 1-sentence explanation of the bug and how it was resolved."
        }
        """

        user_prompt = f"""
        Language: {request.language}
        Terminal Error: {request.error_message}
        Broken File Content:
        {request.source_code}
        """

        print(f"\n🔍 [AUTO-HEALER] Crash detected! Sending {request.language} code to AI...")

        # Call your local Ollama model
        client = ollama.AsyncClient()
        response = await client.chat(
            model='qwen2.5-coder:1.5b',  # Lightweight 1.5B model for RTX 2050
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            format='json',               
            options={
                'temperature': 0.1,      # Lower temperature = more precise bug fixes
                'num_ctx': 2048          # Caps memory reading to prevent VRAM spikes
            }, 
            keep_alive=0                 # Instantly flushes GPU memory so your PC doesn't lag
        )

        ai_result = json.loads(response['message']['content'])
        
        print(f"✅ [AUTO-HEALER] Fix generated! Explanation: {ai_result.get('explanation')}")

        # Return the payload back to auto_healer.py so it can write the _fixed.py file
        return {
            "status": "success",
            "fixed_code": ai_result.get("fixed_code"),
            "explanation": ai_result.get("explanation")
        }

    except Exception as e:
        print(f"❌ [AUTO-HEALER] Backend failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Runs on port 8000, which exactly matches the API_URL in your auto_healer.py script
    uvicorn.run(app, host="0.0.0.0", port=8001) 