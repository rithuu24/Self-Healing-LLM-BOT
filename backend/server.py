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
    return {"message": "Healer Bot API is Online 🤖 (Powered by Gemini)"}

@app.get("/run-healer")
def run_healer():
    """
    This endpoint triggers the self-healing logic.
    It looks for specific files to heal.
    """
    print("🔔 API Request Received: Starting Healer...")

    # ---------------------------------------------------------
    # CONFIGURATION: Change these paths to match your project files
    # ---------------------------------------------------------
    # Ensure these files actually exist in your 'backend' folder!
    target_test_file = "tests/test_calculator.py" 
    target_source_file = "src/calculator.py"
    
    # Check if files exist before running
    if not os.path.exists(target_test_file) or not os.path.exists(target_source_file):
        error_msg = [
            f"❌ Error: Could not find target files.",
            f"Looking for Test File: {os.path.abspath(target_test_file)}",
            f"Looking for Source File: {os.path.abspath(target_source_file)}",
            "Action: Please create 'src/calculator.py' and 'tests/test_calculator.py' inside the backend folder."
        ]
        print("\n".join(error_msg))
        return {
            "status": "error", 
            "logs": error_msg
        }

    # Call the logic from healer.py
    try:
        result = trigger_healing_process(target_test_file, target_source_file)
        return result
    except Exception as e:
        print(f"🔥 Critical Server Error: {e}")
        return {
            "status": "error", 
            "logs": [f"🔥 Critical Server Error: {str(e)}"]
        }

# To run: uvicorn server:app --reload