import subprocess
import os
import re
import google.generativeai as genai # <--- FIXED IMPORT
from config import GOOGLE_API_KEY, MODEL_NAME, TEST_FILE, SOURCE_FILE, MAX_RETRIES
from memory import RecallEngine

# Configure Standard Library
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)
memory = RecallEngine()

def run_observer(test_path):
    """
    The OBSERVER Engine: Runs tests and captures raw output.
    """
    print(f"👀 Observer: Monitoring {test_path}...")
    result = subprocess.run(
        ["pytest", test_path],
        capture_output=True,
        text=True
    )
    return result.returncode == 0, result.stdout + result.stderr

def reasoning_engine(error_log, source_code, test_code, context=None):
    """
    The REASONING Engine: Uses Gemini to generate a patch.
    """
    print("🧠 Reasoning: Analyzing failure patterns...")
    
    memory_prompt = ""
    if context:
        print("💡 Memory Recall: Found a similar past solution!")
        memory_prompt = f"""
        --- 🧠 MEMORY RETRIEVAL (A similar bug was fixed this way) ---
        {context}
        --------------------------------------------------------------
        """

    prompt = f"""
    You are an Autonomous AI Repair Agent (MARR Architecture).
    
    {memory_prompt}
    
    --- ❌ ERROR LOG ---
    {error_log}
    
    --- 📄 SOURCE CODE ---
    {source_code}
    
    --- 🧪 BROKEN TEST ---
    {test_code}
    
    --- MISSION ---
    1. Analyze the root cause.
    2. Fix the test file logic.
    3. Return ONLY valid Python code. No Markdown.
    """
    
    try:
        # Standard generation call
        response = model.generate_content(prompt)
        
        if not response.text:
            return "API Error: Empty response."

        # Clean Markdown
        code = re.sub(r"^```python", "", response.text, flags=re.MULTILINE)
        code = re.sub(r"^```", "", code, flags=re.MULTILINE)
        return code.strip()
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return f"API Error: {str(e)}"

def trigger_marr_loop(test_path=TEST_FILE, source_path=SOURCE_FILE):
    """
    The Main MARR Loop (Observer -> Recall -> Reasoning -> Reflexion)
    """
    logs = []
    attempt = 0
    
    # 1. Observer Step
    success, output = run_observer(test_path)
    if success:
        return {"status": "success", "logs": ["✅ System Healthy. No repairs needed."]}
    
    logs.append(f"❌ Failure Detected. Entering Repair Loop...")

    # Read Files
    if not os.path.exists(source_path) or not os.path.exists(test_path):
        return {"status": "error", "logs": ["❌ Error: Source or Test file not found."]}

    with open(source_path, 'r') as f: source_code = f.read()
    with open(test_path, 'r') as f: test_code = f.read()

    # 2. Recall Step
    past_fix = memory.retrieve(output)
    
    # 3. Reflexion Loop (Retry Logic)
    while attempt < MAX_RETRIES:
        attempt += 1
        logs.append(f"🔄 Reflexion Cycle #{attempt}...")
        
        # 4. Reasoning Step
        new_code = reasoning_engine(output, source_code, test_code, past_fix)
        
        if "API Error" in new_code:
            logs.append(f"💀 Critical Failure: {new_code}")
            break
            
        # Apply Patch
        with open(test_path, 'w') as f: f.write(new_code)
        
        # Verify (Reflexion)
        success, new_output = run_observer(test_path)
        
        if success:
            logs.append("✨ SUCCESS: Patch Verified!")
            logs.append("💾 Saving to Long-Term Memory...")
            memory.memorize(output, new_code) # Learn!
            return {"status": "healed", "logs": logs}
        else:
            logs.append("⚠️ Patch Failed. Retrying...")
            output = new_output # Feed new error back into loop
            past_fix = None # Don't rely on memory for retries

    return {"status": "failed", "logs": logs + ["💀 Max retries exceeded."]}