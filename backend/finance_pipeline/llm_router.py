import os
import requests
import json
import time

# List of all available text generation models to round-robin
API_MODELS = [
    "gemini-3.5-flash",
    "gemini-3-flash",
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemma-4-26b-a4b-it"
]

# Global counter to enable round-robin across requests
_current_model_index = 0

def get_next_model():
    global _current_model_index
    model = API_MODELS[_current_model_index]
    _current_model_index = (_current_model_index + 1) % len(API_MODELS)
    return model

def generate_content_api(prompt, model_name):
    api_key = os.environ.get("GEMINI_API_KEY_FINANCE", os.environ.get("FINANCE_GEMINI_API_KEY", os.environ.get("GEMINI_API_KEY", "")))
    if not api_key:
        raise ValueError("No Gemini API Key found in environment.")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1}
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    response.raise_for_status()
    result = response.json()
    
    try:
        return result['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as e:
        print(f"Error parsing response from {model_name}: {result}")
        raise e

def generate_content_ollama(prompt):
    url = "http://localhost:11434/api/generate"
    headers = {"Content-Type": "application/json"}
    data = {
        "model": "phi3",
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.1
        }
    }
    # 90s safety timeout
    response = requests.post(url, headers=headers, json=data, timeout=90)
    response.raise_for_status()
    result = response.json()
    try:
        return result['response']
    except (KeyError, IndexError) as e:
        print(f"Error parsing Ollama response: {result}")
        raise e

def generate_content(prompt):
    """
    Round-robin across all available API models.
    If a model fails (e.g., 429 Timeout or 500), it retries with the next model.
    Falls back to Ollama if ALL API models fail.
    """
    # We will try every API model once before falling back to Ollama
    for _ in range(len(API_MODELS)):
        model_name = get_next_model()
        try:
            return generate_content_api(prompt, model_name)
        except Exception as e:
            print(f"[LLM Router] API Model {model_name} failed: {e}. Trying next model...")
            time.sleep(1) # tiny sleep to avoid spamming the API network on complete outage
            
    # If we exit the loop, all API models failed
    print(f"[LLM Router] ALL {len(API_MODELS)} API models failed! Falling back to Ollama CPU...")
    return generate_content_ollama(prompt)
