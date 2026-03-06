import requests
import json
import os
import re

# Ollama API configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:1.5b"

TIMEOUT = 120


def clean_llm_response(text: str):
    """
    Remove markdown formatting and extra spaces
    """
    text = re.sub(r"```json|```", "", text)
    return text.strip()


def query_ollama(prompt: str):
    """
    Send prompt to Ollama and return response text
    """

    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "top_p": 0.9,
            "num_predict": 512
        }
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=TIMEOUT
        )

        if response.status_code != 200:
            raise Exception(f"Ollama API error: {response.text}")

        data = response.json()

        result = data.get("response", "")

        result = clean_llm_response(result)

        return result

    except requests.exceptions.Timeout:
        raise Exception("Ollama request timed out")

    except Exception as e:
        raise Exception(f"Ollama service error: {str(e)}")