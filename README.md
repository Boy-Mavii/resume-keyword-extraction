# Resume Keyword Extraction System

This is a final year project that implements a Resume Keyword Extraction system using Natural Language Processing (NLP).

## System Architecture
- **Backend**: FastAPI (Python)
- **NLP Engine**: spaCy (NER & Phrase Matching)
- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS & Glassmorphism design

## Setup and Running Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
python3 -m spacy download en_core_web_sm
```

Running the backend server:
```bash
python3 main.py
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Running the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Features
- **File Support**: Extract text from PDF and DOCX files.
- **Entity Recognition**: Automatically identifies names, organizations, and locations.
- **Skill Extraction**: Cross-matches resume text against a professional skills database.
- **Interactive UI**: Modern, responsive interface with file upload and result visualization.

## Project Structure
- `/backend`: FastAPI server, NLP logic, and utility functions.
- `/frontend`: Next.js application and UI components.
- `/documentation`: Academic project documentation (Chapters 1-5).
