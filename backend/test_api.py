import requests
import time

# The endpoint for your local Self-Healing BOT
BASE_URL = "http://127.0.0.1:8000/api/heal-code"

# A batch of broken code snippets spanning different languages
test_cases = [
    {
        "language": "python",
        "error_message": "SyntaxError: expected ':'",
        "source_code": "def calculate_total(price, tax)\n    return price + tax"
    },
    {
        "language": "java",
        "error_message": "error: ';' expected",
        "source_code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\")\n    }\n}"
    },
    {
        "language": "typescript",
        "error_message": "Type 'string' is not assignable to type 'number'.",
        "source_code": "let userAge: number = \"twenty-five\";"
    }
]

def run_local_test():
    print(f"🚀 Starting Local API Test with {len(test_cases)} cases...\n")
    print("Running 100% locally. Zero rate limits.\n" + "="*50)
    
    for i, case in enumerate(test_cases, 1):
        print(f"\n[{i}/{len(test_cases)}] Testing {case['language'].upper()} repair...")
        start_time = time.time()
        
        try:
            # Send request to your FastAPI backend
            response = requests.post(
                BASE_URL,
                json=case,
                headers={"Content-Type": "application/json"}
            )
            
            elapsed_time = time.time() - start_time
            
            # Print the results
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Success! (Took {elapsed_time:.2f} seconds)")
                print(f"🤖 AI Explanation: {result.get('explanation')}")
                print("✨ Fixed Code:")
                print(result.get('fixed_code'))
            else:
                print(f"❌ Server returned an error (Status {response.status_code}):")
                print(response.text)
                
        except requests.exceptions.ConnectionError:
            print("\n❌ Connection Failed: Is your FastAPI server running?")
            print("Make sure you run `python main.py` in another terminal first.")
            break

if __name__ == "__main__":
    run_local_test()