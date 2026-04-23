from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
import json

# 1. Load environment variables from the .env file.
# This makes os.getenv("GROQ_API_KEY") available.
load_dotenv()

# 2. Initialize the FastAPI application instance
app = FastAPI(title="AI Interview Coach Backend")

# 3. Configure CORS (Cross-Origin Resource Sharing)
# This allows the React frontend (running on a different port, e.g., 5173) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your exact frontend URL
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

# 4. Initialize the Groq client.
# This assumes you have the GROQ_API_KEY set in your .env file
try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
except Exception as e:
    print(f"Warning: Groq client failed to initialize: {e}")

# 5. Define the data model for the incoming request from the frontend
class RoleRequest(BaseModel):
    role: str

# 6. Create the endpoint to generate interview questions
@app.post("/api/generate-questions")
async def generate_questions(request: RoleRequest):
    """
    This endpoint takes a specific role (e.g., 'frontend developer') and 
    requests 3 relevant interview questions from the Groq AI model.
    """
    if not request.role:
        raise HTTPException(status_code=400, detail="Role cannot be empty")

    try:
        # We craft a prompt for the AI to return data in a specific JSON format
        prompt = f"""You are an expert technical interviewer. 
The user is applying for the role of: {request.role}.
Provide exactly 3 relevant and challenging interview questions for this role.
Return the output ONLY as a valid JSON array of strings. 
No markdown blocks, no extra text. 
Example format: ["question 1?", "question 2?", "question 3?"]
"""
        # 7. Make the API call to Groq
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            # You can change the model string if you prefer a different one
            model="llama3-8b-8192", 
            temperature=0.7,
        )

        # 8. Parse the response
        response_text = chat_completion.choices[0].message.content.strip()
        
        # We attempt to clean up the response in case the AI added markdown blocks 
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        questions = json.loads(response_text)
        
        # 9. Return the parsed questions list to the frontend
        return {"questions": questions}

    except Exception as e:
        # If anything goes wrong, return an error to the frontend
        raise HTTPException(status_code=500, detail=str(e))
