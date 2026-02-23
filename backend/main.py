import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

# 1. Load variables FIRST
load_dotenv() 

# 2. Now initialize the client
client = AsyncOpenAI(
    # Explicitly pass the key from os.getenv to be safe
    api_key=os.getenv("OPENROUTER_API_KEY"), 
    base_url="https://openrouter.ai/api/v1"
)