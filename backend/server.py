from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from healer import trigger_healing_process
import os

app = FastAPI()

# Enable CORS (Allows React running on localhost:5173 to talk to this Python script)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domain
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Healer Bot API is Online 🤖"}

@app.get("/run-healer")
def run_healer():
    """
    This endpoint triggers the self-healing logic.
    It looks for specific files to heal.
    """
    # ---------------------------------------------------------
    # CONFIGURATION: Change these paths to match your project files
    # ---------------------------------------------------------
    target_test_file = "tests/test_calculator.py" 
    target_source_file = "src/calculator.py"
    
    # Check if files exist before running
    if not os.path.exists(target_test_file) or not os.path.exists(target_source_file):
        return {
            "status": "error", 
            "logs": [
                f"❌ Error: Could not find files.",
                f"Looking for: {target_test_file}",
                f"Looking for: {target_source_file}",
                "Please create these dummy files to test the bot."
            ]
        }

    # Call the logic from healer.py
    try:
        result = trigger_healing_process(target_test_file, target_source_file)
        return result
    except Exception as e:
        return {
            "status": "error", 
            "logs": [f"🔥 Critical Server Error: {str(e)}"]
        }

# To run: uvicorn server:app --reload