import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from healer import trigger_marr_loop
from config import TEST_FILE
from optimizer import optimize_code
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/run-healer")
def run_healer():
    return trigger_marr_loop()

@app.get("/memory")
def get_memory():
    if os.path.exists("fix_history.json"):
        with open("fix_history.json", "r") as f:
            return json.load(f)[::-1]
    return []

@app.delete("/clear-memory")
def clear_memory():
    if os.path.exists("fix_history.json"): os.remove("fix_history.json")
    if os.path.exists("faiss_index.bin"): os.remove("faiss_index.bin")
    return {"status": "cleared"}

@app.get("/reset-demo")
def reset_demo():
    # Breaks the code for the demo
    broken_code = """
import pytest
from src.calculator import add
def test_add():
    assert add(2, 2) == 5 # BROKEN
    """
    with open(TEST_FILE, "w") as f: f.write(broken_code)
    return {"status": "reset"}

# --- OPTIMIZER ENDPOINT ---
class OptimizeRequest(BaseModel):
    code: str

@app.post("/optimize")
async def optimize_endpoint(req: OptimizeRequest):
    print("🚀 Received code for optimization...")
    
    result = optimize_code(req.code)
    
    if "error" in result:
        return {"status": "error", "message": result["error"]}
        
    return {
        "status": "success",
        "current_time": result["current_time"],
        "current_space": result["current_space"],
        "optimized_time": result["optimized_time"],
        "optimized_space": result["optimized_space"],
        "explanation": result["explanation"],
        "optimized_code": result["optimized_code"]
    }

# --- STREAMING DIAGNOSTICS ENDPOINT ---
@app.get("/stream-diagnostics")
async def stream_diagnostics():
    async def log_generator():
        # These are the simulated steps. Later, we can hook this up to trigger_marr_loop()!
        real_logs = [
            "Initializing AI core...",
            "Connecting to LLM Backend API...",
            "Scanning repository for syntax anomalies...",
            "Analyzing Data Structures & Algorithms...",
            "WARNING: Found sub-optimal loop in src/utils/helpers.ts (O(n^2)).",
            "Applying AST transformation to optimize to O(n log n)...",
            "Running unit tests on patched code...",
            "DONE" # Our secret signal to tell React to stop listening
        ]
        
        for log in real_logs:
            await asyncio.sleep(1) # Simulates the AI "thinking" for 1 second
            yield f"{log}\n"
            
    return StreamingResponse(log_generator(), media_type="text/plain")