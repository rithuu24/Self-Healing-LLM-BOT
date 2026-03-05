import requests
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")

def query_ollama(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        response.raise_for_status()
        return response.json()["response"]

    except requests.exceptions.Timeout:
        raise Exception("Ollama request timed out")

    except requests.exceptions.ConnectionError:
        raise Exception("Ollama server not running")

    except Exception as e:
        raise Exception(f"Ollama failure: {str(e)}")