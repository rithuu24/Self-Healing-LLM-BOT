import asyncio
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
    memory_prompt = ""
    if context:
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
        return f"API Error: {str(e)}"

def trigger_marr_loop(test_path=TEST_FILE, source_path=SOURCE_FILE):
    """
    The Original MARR Loop (Used for standard API requests)
    """
    # ... (Your existing trigger_marr_loop code remains unchanged here)
    pass

async def stream_marr_loop(test_path=TEST_FILE, source_path=SOURCE_FILE):
    """
    The LIVE MARR Loop (Streams text directly to the React Terminal)
    """
    yield "Initializing Self-Healing MARR Loop...\n"
    await asyncio.sleep(0.5) # Slight pause for UI effect
    
    attempt = 0
    
    # 1. Observer Step
    yield f"👀 Observer: Monitoring {test_path}...\n"
    await asyncio.sleep(0.5)
    success, output = run_observer(test_path)
    
    if success:
        yield "✅ System Healthy. No repairs needed.\n"
        yield "DONE\n" # Signal React to stop listening
        return
    
    yield "❌ Failure Detected. Entering Repair Loop...\n"

    # Read Files
    if not os.path.exists(source_path) or not os.path.exists(test_path):
        yield "❌ Error: Source or Test file not found.\n"
        yield "DONE\n"
        return

    with open(source_path, 'r') as f: source_code = f.read()
    with open(test_path, 'r') as f: test_code = f.read()

    # 2. Recall Step
    yield "🧠 Memory Engine: Searching for past solutions...\n"
    past_fix = memory.retrieve(output)
    
    if past_fix:
        yield "💡 Memory Recall: Found a similar past solution!\n"
        await asyncio.sleep(0.5)

    # 3. Reflexion Loop (Retry Logic)
    while attempt < MAX_RETRIES:
        attempt += 1
        yield f"\n🔄 Reflexion Cycle #{attempt}...\n"
        
        # 4. Reasoning Step
        yield "🧠 Reasoning Engine: Analyzing failure patterns with Gemini...\n"
        
        # This will pause the stream naturally while waiting for Google's API!
        new_code = reasoning_engine(output, source_code, test_code, past_fix)
        
        if "API Error" in new_code:
            yield f"💀 Critical Failure: {new_code}\n"
            break
            
        # Apply Patch
        yield "🔧 Applying AI-generated patch to source code...\n"
        with open(test_path, 'w') as f: f.write(new_code)
        await asyncio.sleep(0.5)
        
        # Verify (Reflexion)
        yield "🧪 Observer: Re-running tests to verify patch...\n"
        success, new_output = run_observer(test_path)
        
        if success:
            yield "✨ SUCCESS: Patch Verified!\n"
            yield "💾 Saving to Long-Term Memory...\n"
            memory.memorize(output, new_code)
            break
        else:
            yield "⚠️ Patch Failed. Refining prompt and retrying...\n"
            output = new_output
            past_fix = None 

    if not success:
        yield "💀 Max retries exceeded. Manual intervention required.\n"

    yield "DONE\n" # Signal React to close the stream