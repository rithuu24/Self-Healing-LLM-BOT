import subprocess
import os
import re
from openai import OpenAI
from dotenv import load_dotenv

# Load API Key from .env file
load_dotenv()

# Initialize OpenAI Client (Make sure OPENAI_API_KEY is in your .env)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def run_tests(test_file_path):
    """
    Runs pytest on a specific file and captures the output.
    Returns: (success: bool, output: str)
    """
    print(f"🚀 Running tests on {test_file_path}...")
    
    result = subprocess.run(
        ["pytest", test_file_path],
        capture_output=True,
        text=True
    )
    
    # Combine stdout and stderr to get the full error message
    full_output = result.stdout + result.stderr
    
    # Return True if exit code is 0 (Pass), False otherwise (Fail)
    return result.returncode == 0, full_output

def read_file(filepath):
    """Reads the content of a code file."""
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r') as f:
        return f.read()

def write_file(filepath, content):
    """Overwrites a file with new content."""
    with open(filepath, 'w') as f:
        f.write(content)

def get_ai_fix(error_log, source_code, test_code):
    """
    Sends the error and code to the LLM to generate a fix.
    """
    print("🧠 Consulting AI for a fix...")
    
    prompt = f"""
    You are an expert Python QA Engineer.
    
    I have a unit test that is failing. Your goal is to fix the TEST CODE so it matches the SOURCE CODE logic.
    
    --- ERROR LOG ---
    {error_log}
    
    --- SOURCE CODE (The Source of Truth) ---
    {source_code}
    
    --- BROKEN TEST CODE ---
    {test_code}
    
    --- INSTRUCTIONS ---
    1. Analyze why the test failed.
    2. Rewrite the FULL content of the test file to fix the error.
    3. Return ONLY the python code. 
    4. Do NOT use Markdown formatting (no ```python blocks). 
    5. Do NOT include any explanation text. Just the code.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # or "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant. Output only raw code."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Clean up the response (remove markdown backticks if the AI adds them)
        fixed_code = response.choices[0].message.content
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
    
    logs.append("❌ Failure Detected!")
    logs.append("📄 Capturing Error Stack Trace...")
    
    # Step 2: Read Context
    source_code = read_file(source_file)
    test_code = read_file(test_file)
    
    if not source_code or not test_code:
        logs.append("⚠️ Error: Could not find source files.")
        return {"status": "error", "logs": logs}
    
    # Step 3: Get AI Fix
    logs.append("🧠 Sending context to LLM...")
    fixed_code = get_ai_fix(output, source_code, test_code)
    
    if not fixed_code:
        logs.append("💀 AI failed to generate a fix.")
        return {"status": "error", "logs": logs}
        
    # Step 4: Apply Fix
    logs.append("🩹 AI generated a patch. Applying to file...")
    write_file(test_file, fixed_code)
    
    # Step 5: Verify
    logs.append("🔄 Re-running tests to verify fix...")
    success, new_output = run_tests(test_file)
    
    if success:
        logs.append("✨ SUCCESS: The test is now passing!")
        return {"status": "healed", "logs": logs}
    else:
        logs.append("⚠️ The fix didn't work. Manual intervention required.")
        return {"status": "failed", "logs": logs}

# For manual testing
if __name__ == "__main__":
    # Change these paths to test manually
    trigger_healing_process("tests/test_calculator.py", "src/calculator.py")