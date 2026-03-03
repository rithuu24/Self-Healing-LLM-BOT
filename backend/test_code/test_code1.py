import requests
import json

# The URL where your FastAPI server is running
API_URL = "http://127.0.0.1:8000/api/heal-code"

# 1. We simulate a broken test scenario (e.g., UI changed, ID is missing)
broken_test_data = {
    "language": "python",
    "error_message": "NoSuchElementException: Message: no such element: Unable to locate element: {\"method\":\"css selector\",\"selector\":\"#old-login-btn\"}",
    "source_code": """
def test_user_login(driver):
    # Navigating to the login page
    driver.get("https://example.com/login")
    
    # Trying to click the login button using the old, broken ID
    login_button = driver.find_element(By.ID, "old-login-btn")
    login_button.click()
    
    assert "Dashboard" in driver.title
"""
}

def run_test():
    print("🚀 Sending broken code to Guardian Auto-Healer...")
    print("-" * 50)
    
    try:
        # 2. Send the POST request to your FastAPI backend
        response = requests.post(API_URL, json=broken_test_data)
        
        # 3. Check if the server responded successfully
        if response.status_code == 200:
            ai_result = response.json()
            
            print("✅ HEALING SUCCESSFUL!\n")
            print("💡 AI Explanation:")
            print(f"   {ai_result.get('explanation')}")
            print(f"   Confidence Score: {ai_result.get('confidence')}\n")
            
            print("🛠️ FIXED CODE:")
            print(ai_result.get('fixed_code'))
            
        else:
            print(f"❌ Server Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the server.")
        print("Make sure your FastAPI server is running with: uvicorn main:app --reload")

if __name__ == "__main__":
    run_test()