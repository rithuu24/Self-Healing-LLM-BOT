# backend/test_memory.py
from memory import HealerMemory
import os

def test_memory_system():
    print("🧠 Initializing Memory Bank...")
    
    # 1. Initialize
    try:
        mem = HealerMemory()
    except Exception as e:
        print(f"❌ Failed to initialize memory: {e}")
        return

    # 2. Add a Dummy Entry (Simulating a past fix)
    test_error = "ZeroDivisionError: division by zero"
    test_fix = """
    def divide(a, b):
        if b == 0: return 0
        return a / b
    """
    
    print(f"📝 Learning a new fix for: '{test_error}'...")
    mem.add_fix(test_error, test_fix)

    # 3. Search for it (using slightly different wording to test AI search)
    # Note: We search for "dividing by 0" instead of "division by zero" to test similarity.
    query = "Error: dividing by 0 detected"
    print(f"🔍 Searching memory for a similar issue: '{query}'...")
    
    found_fix = mem.find_similar_fix(query)

    # 4. Verify Result
    if found_fix:
        print("\n✅ SUCCESS! Memory retrieval is working.")
        print("-" * 30)
        print(f"💡 Retrieved Fix:\n{found_fix.strip()}")
        print("-" * 30)
        
        # Check if files were created
        if os.path.exists("fix_history.json") and os.path.exists("faiss_index.bin"):
            print("📂 Database files (json/bin) were created successfully.")
        else:
            print("⚠️ Warning: Database files not found on disk.")
    else:
        print("\n❌ FAILED. The system could not recall the fix.")

if __name__ == "__main__":
    test_memory_system()