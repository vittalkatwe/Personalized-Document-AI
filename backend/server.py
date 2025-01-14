from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import cohere
import PyPDF2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Verify Cohere API key exists
if not os.getenv('COHERE_API_KEY'):
    raise Exception("COHERE_API_KEY not found in environment variables")

# Initialize Cohere client
co = cohere.Client(os.getenv('COHERE_API_KEY'))

# Store PDF content in memory (in production, use a proper database)
pdf_content = ""

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/upload")
async def upload_pdf(file: UploadFile):
    global pdf_content
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read the PDF file
        content = await file.read()
        with open("temp.pdf", "wb") as f:
            f.write(content)
        
        try:
            # Extract text from PDF
            pdf_reader = PyPDF2.PdfReader("temp.pdf")
            pdf_content = ""
            for page in pdf_reader.pages:
                pdf_content += page.extract_text()
            
            if not pdf_content.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
            return {"message": "PDF uploaded and processed successfully"}
        finally:
            # Clean up temporary file
            if os.path.exists("temp.pdf"):
                os.remove("temp.pdf")
    
    except Exception as e:
        if os.path.exists("temp.pdf"):
            os.remove("temp.pdf")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    global pdf_content
    
    if not pdf_content:
        raise HTTPException(status_code=400, detail="No PDF content available")
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Generate response using Cohere
        response = co.generate(
            model='command',
            prompt=f"Context: {pdf_content[:2000]}\n\nQuestion: {request.question}\n\nAnswer:",
            max_tokens=300,
            temperature=0.7,
            stop_sequences=["\n"]
        )
        
        answer = response.generations[0].text.strip()
        if not answer:
            raise HTTPException(status_code=500, detail="Failed to generate an answer")
            
        return {"answer": answer}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
