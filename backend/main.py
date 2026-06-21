from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os
from utils import extract_text
from nlp_engine import process_resume

app = FastAPI(title="Resume Keyword Extraction API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Resume Keyword Extraction API"}

@app.post("/extract")
async def extract_keywords(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text(content, file.filename)
        results = process_resume(text)

        print(f"\n--- EXTRACTED DATA FOR {file.filename} ---\n")
        print(json.dumps(results, indent=2))
        print("\n------------------------------------------\n")
        return {
            "filename": file.filename,
            "status": "success",
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
