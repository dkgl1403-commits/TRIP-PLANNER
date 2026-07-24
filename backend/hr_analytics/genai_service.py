import requests
import json
from hr_analytics.db import Employee, EmployeeAiInsight

# The standard local Ollama endpoint on UAT
OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5-coder:7b" # Or whatever model is loaded locally on UAT

def generate_action_plan(employee: Employee, insight: EmployeeAiInsight) -> str:
    """
    Generates a personalized action plan for a manager to retain an at-risk employee.
    """
    risk_factors_str = "\n".join([f"- {factor}" for factor in insight.top_risk_factors]) if insight.top_risk_factors else "None"
    
    prompt = f"""You are an expert HR Manager AI. 
Write a highly concise, actionable 2-3 sentence plan for a manager to retain the following employee. 
Be direct, professional, and do not include pleasantries or greetings.

Employee: {employee.name}
Role: {employee.role}
Flight Risk Score: {round(insight.flight_risk_score * 100)}%
Burnout Risk Score: {round(insight.burnout_risk_score * 100)}%
Compensation Fairness: {round(insight.compensation_fairness_score * 100)}%

Risk Factors Detected:
{risk_factors_str}

Action Plan:"""

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 100 # Keep it very short
        }
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return f"Failed to generate action plan. Status: {response.status_code}"
    except Exception as e:
        return f"Error communicating with AI engine: {str(e)}"
