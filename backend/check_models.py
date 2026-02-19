import google.generativeai as genai
from config import GOOGLE_API_KEY

print("🔍 Checking available models...")
genai.configure(api_key=GOOGLE_API_KEY)

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Found supported model: {m.name}")
except Exception as e:
    print(f"❌ API Error: {e}") 