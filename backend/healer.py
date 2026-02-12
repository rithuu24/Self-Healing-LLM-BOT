import subprocess
import os
import re
import google.generativeai as genai
from dotenv import load_dotenv

# --- NEW: Import the Memory Engine ---
try:
    from memory import HealerMemory
    memory_bank = HealerMemory()
    print("🧠 Memory Bank Loaded.")
except ImportError:
    print("⚠️ Warning: memory.py not found. Running without Long-Term Memory.")
    memory_bank = None

# Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("❌ Error: GOOGLE_API_KEY is missing from .env file")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def run_tests(test_file_path):
    """Runs pytest and returns (success, output)"""
    print(f"🚀 Running tests on {test_file_path}...")
    result = subprocess.run(
        ["pytest", test_file_path],
        capture_output=True,
        text=True
    )
    return result.returncode == 0, result.stdout + result.stderr

def read_file(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w') as f:
        f.write(content)

# --- UPDATED: Accepts 'past_fix' argument ---
def get_ai_fix(error_log, source_code, test_code, past_fix=None):
    print("🧠 Consulting Gemini 1.5 Flash for a fix...")
    
    # Inject Memory Hint if available
    memory_context = ""
    if past_fix:
        print("💡 Injecting past solution into Prompt...")
        memory_context = f"""
        --- 💡 MEMORY HINT (A similar bug was fixed this way before) ---
        {past_fix}
        ---------------------------------------------------------------
        Use the logic above if it applies to this error.
        """

    prompt = f"""
    You are an expert Python QA Engineer.
    
    {memory_context}
    
    --- ERROR LOG ---
    {error_log}
    
    --- SOURCE CODE ---
    {source_code}
    
    --- BROKEN TEST CODE ---
    {test_code}
    
    --- INSTRUCTIONS ---
    1. Analyze why the test failed.
    2. Rewrite the FULL content of the test file to fix the error.
    3. Return ONLY the python code. 
    4. Do NOT use Markdown formatting (no ```python blocks). 
    """
    
    try:
        response = model.generate_content(prompt)
        fixed_code = response.text
        fixed_code = re.sub(r"^```python", "", fixed_code, flags=re.MULTILINE)
        fixed_code = re.sub(r"^```", "", fixed_code, flags=re.MULTILINE)
        return fixed_code.strip()
    except Exception as e:
        print(f"❌ Error calling AI: {e}")
        return None

# --- MAIN ORCHESTRATOR ---
def trigger_healing_process(test_file, source_file):
    logs = []
    
    # Step 1: Run Initial Tests
    logs.append(f"🔍 Executing tests in {test_file}...")
    success, output = run_tests(test_file)
    
    if success:
        logs.append("✅ Tests Passed! No healing needed.")
        return {"status": "success", "logs": logs}
    
    logs.append("❌ Failure Detected! Capturing errors...")
    
    # Step 2: Read Context
    source_code = read_file(source_file)
    test_code = read_file(test_file)
    
    if not source_code or not test_code:
        logs.append("⚠️ Error: Could not find source files.")
        return {"status": "error", "logs": logs}

    # --- NEW: Step 3 - Check Memory (RAG) ---
    past_fix = None
    if memory_bank:
        logs.append("🧠 Checking Memory Bank for similar past bugs...")
        past_fix = memory_bank.find_similar_fix(output)
        if past_fix:
            logs.append("💡 Memory Found! Using past solution as a guide.")
    
    # Step 4: Get AI Fix (Passing the memory hint)
    logs.append("🧠 Sending context to Gemini...")
    fixed_code = get_ai_fix(output, source_code, test_code, past_fix)
    
    if not fixed_code:
        logs.append("💀 AI failed to generate a fix.")
        return {"status": "error", "logs": logs}
        
    # Step 5: Apply Fix
    logs.append("🩹 Patching file with AI-generated code...")
    write_file(test_file, fixed_code)
    
    # Step 6: Verify
    logs.append("🔄 Re-running tests verification...")
    success, new_output = run_tests(test_file)
    
    if success:
        logs.append("✨ SUCCESS: Self-Healing Complete!")
        
        # --- NEW: Save Success to Memory ---
        if memory_bank:
            logs.append("💾 Saving this solution to Long-Term Memory...")
            memory_bank.add_fix(output, fixed_code)
            
        return {"status": "healed", "logs": logs}
    else:
        logs.append("⚠️ Fix failed. Manual intervention needed.")
        return {"status": "failed", "logs": logs}

if __name__ == "__main__":
    trigger_healing_process("tests/test_calculator.py", "src/calculator.py")