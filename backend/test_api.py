import requests
import json

# The URL where your FastAPI server is running
BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = "/api/heal-code"

def test_heal_code():
    # Example: A Python function with an indentation error
    payload = {
        "language": "python",
        "error_message": "IndentationError: expected an indented block",
        "source_code": "def calculate_sum(a, b):\nreturn a + b"
    }

    print(f"🚀 Sending request to {BASE_URL}{ENDPOINT}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}{ENDPOINT}",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            print("\n✅ API Response Received:")
            print("-" * 30)
            print(f"Status: {result.get('status')}")
            print(f"Confidence: {result.get('confidence')}")
            print(f"Explanation: {result.get('explanation')}")
            print("\n--- Fixed Code ---")
            print(result.get('fixed_code'))
            print("-" * 30)
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print("❌ Connection Failed: Is your FastAPI server running? (uvicorn main:app --reload)")

if __name__ == "__main__":
    test_heal_code()