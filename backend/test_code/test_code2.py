import requests
import json

# The URL where your FastAPI server is running
API_URL = "http://127.0.0.1:8000/api/heal-code"

# 1. We simulate a modern TypeScript Playwright test failing
broken_test_data = {
    "language": "typescript",
    "error_message": "TimeoutError: locator('.submit-btn-old') exceeded 5000ms. Element not found.",
    "source_code": """
import { test, expect } from '@playwright/test';

test('User can submit the checkout form', async ({ page }) => {
  await page.goto('https://example.com/checkout');
  
  // The developer changed the button class to data-testid="submit-checkout" 
  // but forgot to update this test!
  await page.locator('.submit-btn-old').click();
  
  await expect(page.locator('.success-message')).toBeVisible();
});
"""
}

def run_test():
    print("🚀 Sending broken TypeScript code to Guardian Auto-Healer...")
    print("-" * 50)
    
    try:
        response = requests.post(API_URL, json=broken_test_data)
        
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