import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- CONFIGURATION ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ CRITICAL ERROR: GOOGLE_API_KEY is missing from .env file!")

# Model Settings
MODEL_NAME = "gemini-1.5-flash"  # Fast & Efficient
EMBEDDING_MODEL = "models/text-embedding-004" # For Vector Memory

# File Paths
MEMORY_JSON = "fix_history.json"
MEMORY_INDEX = "faiss_index.bin"
TEST_FILE = "tests/test_calculator.py"
SOURCE_FILE = "src/calculator.py"

# Reflexion Settings
MAX_RETRIES = 3  # How many times to self-correct before giving up 