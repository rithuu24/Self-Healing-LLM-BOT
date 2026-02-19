import google.generativeai as genai
import re
from config import GOOGLE_API_KEY, MODEL_NAME

# Initialize the AI
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)

def optimize_code(source_code: str) -> dict:
    """
    Analyzes code for Big-O bottlenecks and rewrites it using optimal Data Structures.
    """
    prompt = f"""
    You are an expert Data Structures and Algorithms (DSA) Software Engineer.
    Analyze the following Python code. It already works, but it might be slow.
    
    1. Identify the current Time and Space Complexity (Big-O).
    2. Suggest a more optimal approach using better data structures (e.g., Hash Maps, Sets, Pointers).
    3. Rewrite the code to be as efficient as possible.
    
    Respond STRICTLY in this format:
    CURRENT_TIME: <O(...)>
    CURRENT_SPACE: <O(...)>
    OPTIMIZED_TIME: <O(...)>
    OPTIMIZED_SPACE: <O(...)>
    EXPLANATION: <Brief explanation of the optimization>
    ---
    <optimized python code only, no markdown blocks>
    
    Code to optimize:
    {source_code}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse the AI's response
        lines = text.split('\n')
        result = {
            "current_time": "", "current_space": "",
            "optimized_time": "", "optimized_space": "",
            "explanation": "", "optimized_code": ""
        }
        
        code_started = False
        code_lines = []
        
        for line in lines:
            if line.startswith("CURRENT_TIME:"): result["current_time"] = line.split(":", 1)[1].strip()
            elif line.startswith("CURRENT_SPACE:"): result["current_space"] = line.split(":", 1)[1].strip()
            elif line.startswith("OPTIMIZED_TIME:"): result["optimized_time"] = line.split(":", 1)[1].strip()
            elif line.startswith("OPTIMIZED_SPACE:"): result["optimized_space"] = line.split(":", 1)[1].strip()
            elif line.startswith("EXPLANATION:"): result["explanation"] = line.split(":", 1)[1].strip()
            elif line.strip() == "---":
                code_started = True
            elif code_started:
                # Clean up any accidental markdown the AI might inject
                if not line.startswith("```"):
                    code_lines.append(line)
                    
        result["optimized_code"] = "\n".join(code_lines).strip()
        return result
        
    except Exception as e:
        return {"error": str(e)}

# Quick test block
if __name__ == "__main__":
    test_slow_code = '''
def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates
'''
    print("🧠 Optimizing code...")
    res = optimize_code(test_slow_code)
    print(f"Current: Time {res['current_time']}, Space {res['current_space']}")
    print(f"Optimized: Time {res['optimized_time']}, Space {res['optimized_space']}")
    print(f"How: {res['explanation']}")
    print("\nNew Code:\n", res['optimized_code'])