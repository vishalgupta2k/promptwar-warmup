import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(title="LexiBridge API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
# Note: In production, use Cloud Secret Manager
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class RiskItem(BaseModel):
    clause: str
    threat: str
    severity: str

class CorrectionItem(BaseModel):
    target: str
    suggestion: str

class DeadlineItem(BaseModel):
    date: str
    action: str

class AnalysisResponse(BaseModel):
    document_type: str
    risk_score: int
    summary: str
    risks: List[RiskItem]
    corrections: List[CorrectionItem]
    deadlines: List[DeadlineItem]
    next_steps: List[dict]

@app.get("/")
async def root():
    return {"message": "LexiBridge API is running"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        # Read file content
        content = await file.read()
        
        # Initialize Gemini 1.5 Pro
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        prompt = """
        You are a specialized Legal Advocacy Agent. 
        Analyze the provided document and return a structured JSON response.
        
        Focus on:
        1. Identifying risks (hidden traps, unfair clauses).
        2. Finding inconsistencies or errors that can be corrected.
        3. Extracting all critical deadlines.
        4. Providing simple, actionable next steps for a non-lawyer.
        
        Return the response EXACTLY in this JSON format:
        {
          "document_type": "string",
          "risk_score": 0,
          "summary": "string",
          "risks": [{"clause": "string", "threat": "string", "severity": "HIGH/MEDIUM/LOW"}],
          "corrections": [{"target": "string", "suggestion": "string"}],
          "deadlines": [{"date": "string", "action": "string"}],
          "next_steps": [{"action": "string", "reason": "string"}]
        }
        """

        # Call Gemini
        response = model.generate_content([
            prompt,
            {"mime_type": file.content_type, "data": content}
        ])
        
        # Clean and parse response
        # Removing possible markdown code blocks
        json_str = response.text.strip()
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()
        elif json_str.startswith("```"):
            json_str = json_str[3:-3].strip()
            
        data = json.loads(json_str)
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
