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

# Define paths globally so we can use them in multiple functions
TEST_FILE_PATH = "tests/test_calculator.py"
SOURCE_FILE_PATH = "src/calculator.py"

@app.get("/")
def home():
    return {"message": "Healer Bot API is Online 🤖 (Powered by Gemini + FAISS Memory)"}

@app.get("/run-healer")
def run_healer():
    """
    Triggers the self-healing process using Gemini & FAISS.
    """
    print("🔔 API Request Received: Starting Healer...")

    # Check if files exist before running
    if not os.path.exists(TEST_FILE_PATH) or not os.path.exists(SOURCE_FILE_PATH):
        error_msg = [
            f"❌ Error: Could not find target files.",
            f"Looking for Test File: {os.path.abspath(TEST_FILE_PATH)}",
            f"Looking for Source File: {os.path.abspath(SOURCE_FILE_PATH)}",
            "Action: Please create 'src/calculator.py' and 'tests/test_calculator.py' inside the backend folder."
        ]
        print("\n".join(error_msg))
        return {
            "status": "error", 
            "logs": error_msg
        }

    # Call the logic from healer.py
    try:
        result = trigger_healing_process(TEST_FILE_PATH, SOURCE_FILE_PATH)
        return result
    except Exception as e:
        print(f"🔥 Critical Server Error: {e}")
        return {
            "status": "error", 
            "logs": [f"🔥 Critical Server Error: {str(e)}"]
        }

@app.get("/reset-demo")
def reset_demo():
    """
    Resets the test file to a BROKEN state.
    Use this button to restart your demo presentation.
    """
    print("🔄 Resetting Demo Environment...")
    
    # The broken code (Assertion Error: 2 + 2 == 5)
    broken_code = """
import pytest
from src.calculator import add, subtract

def test_add_correctly():
    # BROKEN ON PURPOSE: 2 + 2 is NOT 5
    # The Bot should fix this to be 4
    assert add(2, 2) == 5

def test_subtract_correctly():
    assert subtract(5, 3) == 2
    """.strip()
    
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(TEST_FILE_PATH), exist_ok=True)
        
        # Overwrite the file
        with open(TEST_FILE_PATH, "w") as f:
            f.write(broken_code)
            
        return {
            "status": "success", 
            "message": "Demo reset! The test is broken again."
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Failed to reset demo: {str(e)}"
        }

# To run: uvicorn server:app --reload