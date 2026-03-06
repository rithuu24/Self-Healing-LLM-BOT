import ollama
import json
import logging
import os
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()
model = os.getenv("OLLAMA_DEFAULT_MODEL") 

# Set up basic logging so you can see AI errors in your terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# The local model you want to use. Make sure you have run `ollama run qwen2.5-coder` locally!
MODEL_NAME = "qwen2.5-coder"

async def generate_optimization(language: str, source_code: str) -> dict:
    """Handles the Logic Optimizer tab AI inference."""
    system_prompt = f"""
    You are an Expert Enterprise Software Architect.
    Your job is to take inefficient {language} code and optimize it for Big O time and space complexity.
    
    You MUST return ONLY a valid JSON object with EXACTLY two keys:
    1. "optimized_code": The refactored code block as a string.
    2. "optimization_summary": A brief 1-2 sentence explanation of how you improved the Big O complexity.
    
    Do NOT include markdown formatting (like ```json). Return raw JSON only.
    """

    try:
        logger.info(f"Sending {language} code to {MODEL_NAME} for optimization...")
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': source_code}
            ],
            options={'temperature': 0.1} # Low temp for analytical/coding tasks
        )
        
        raw_text = response['message']['content'].strip()
        
        # Clean up Markdown formatting if the AI disobeys instructions
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        return json.loads(raw_text)
        
    except Exception as e:
        logger.error(f"Optimization LLM failed: {e}")
        return {
            "optimized_code": source_code,
            "optimization_summary": f"Failed to connect to local engine. Error: {str(e)}"
        }


async def generate_translation(source_lang: str, target_lang: str, source_code: str) -> str:
    """Handles the Polyglot Bridge tab AI inference."""
    system_prompt = f"""
    You are a Senior Developer. Translate the following {source_lang} code into enterprise-grade {target_lang}.
    Return ONLY the raw translated code. 
    Do not explain the code. Do not use markdown blocks like ```{target_lang}.
    """
    
    try:
        logger.info(f"Translating {source_lang} to {target_lang} via {MODEL_NAME}...")
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': source_code}
            ],
            options={'temperature': 0.1}
        )
        
        raw_text = response['message']['content'].strip()
        # Clean up Markdown if present
        if raw_text.startswith(f"```{target_lang.lower()}"):
            raw_text = raw_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
            
        return raw_text
        
    except Exception as e:
        logger.error(f"Translation LLM failed: {e}")
        return f"// ❌ AI Engine Error: {str(e)}"


async def generate_heal(language: str, error_message: str, source_code: str) -> dict:
    """Handles the Code Healer tab AI inference."""
    system_prompt = f"""
    You are a QA Automation Expert. Fix the following broken {language} code based on this error context: {error_message}.
    
    You MUST return ONLY a valid JSON object with EXACTLY two keys:
    1. "fixed_code": The repaired code as a string.
    2. "explanation": A 1-2 sentence explanation of what you fixed.
    
    Do NOT include markdown formatting (like ```json). Return raw JSON only.
    """
    
    try:
        logger.info(f"Healing broken {language} code via {MODEL_NAME}...")
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f"Code:\n{source_code}"}
            ],
            options={'temperature': 0.1}
        )
        
        raw_text = response['message']['content'].strip()
        
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        return json.loads(raw_text)
        
    except Exception as e:
        logger.error(f"Healer LLM failed: {e}")
        return {
            "fixed_code": source_code,
            "explanation": f"Failed to connect to local engine. Error: {str(e)}"
        }