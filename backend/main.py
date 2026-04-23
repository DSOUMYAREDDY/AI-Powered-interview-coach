from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
import json

# Load environment parameters
load_dotenv()

# Initialize the API application
app = FastAPI(title="AI Interview Coach Backend")

# Configure CORS settings for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the LLM provider client
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
except Exception as e:
    print(f"Failed to initialize LLM client: {e}")

class RoleRequest(BaseModel):
    role: str

@app.post("/api/generate-questions")
async def generate_questions(request: RoleRequest):
    """
    Endpoint to dynamically generate interview questions based on the candidate's selected role.
    Integrates with the LLM API to fetch domain-specific questions.
    """
    if not request.role:
        raise HTTPException(status_code=400, detail="Role cannot be empty")

    try:
        # Construct system prompt for generating technical interview questions
        prompt = f"""You are an expert technical interviewer. 
The user is applying for the role of: {request.role}.
Provide exactly 3 relevant and challenging interview questions for this role.
Return the output ONLY as a valid JSON array of strings. 
No markdown blocks, no extra text. 
Example format: ["question 1?", "question 2?", "question 3?"]
"""
        # Execute chat completion
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant", 
            temperature=0.7,
        )

        # Parse text response enforcing JSON array constraints
        response_text = chat_completion.choices[0].message.content.strip()
        
        # Sanitize potential markdown block formatting from the LLM output
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        questions = json.loads(response_text)
        
        return {"questions": questions}

    except Exception as e:
        print(f"CRITICAL ERROR generating questions: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
