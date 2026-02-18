import os
import time
# The import line below works now because we fixed memory.py
from memory import RecallEngine 

def test_brain():
    print("🧠 Initializing Recall Engine (FAISS + Gemini)...")
    
    try:
        # Initialize the engine
        brain = RecallEngine()
    except Exception as e:
        print(f"❌ Failed to start engine. Check your API Key in .env! Error: {e}")
        return

    # --- TEST DATA ---
    fake_error = "ZeroDivisionError: division by zero"
    fake_fix = """
    def divide(a, b):
        if b == 0: return 0  # Safe division
        return a / b
    """

    print(f"\n📝 LEARNING STEP:")
    print(f"   Feeding error: '{fake_error}'")
    
    # 1. Memorize
    brain.memorize(fake_error, fake_fix)
    print("   ✅ Saved to Long-Term Memory (FAISS).")

    # Wait a moment to ensure file I/O is done
    time.sleep(1)

    # --- RETRIEVAL TEST ---
    query = "Error: integer division or modulo by zero"
    
    print(f"\n🔍 RECALL STEP:")
    print(f"   Asking about similar error: '{query}'")
    
    # 2. Retrieve
    retrieved_fix = brain.retrieve(query)

    print("-" * 40)
    if retrieved_fix:
        if "Safe division" in retrieved_fix:
            print("✨ SUCCESS! The bot remembered the fix.")
            print(f"\n📄 Retrieved Code:\n{retrieved_fix}")
        else:
            print("⚠️ retrieved data, but it didn't match the expected fix.")
            print(f"Got: {retrieved_fix}")
    else:
        print("❌ FAILED. The bot returned None.")
    print("-" * 40)

if __name__ == "__main__":
    test_brain()