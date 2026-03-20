# LexiBridge — The Legal Bridge MVP

This is a Gemini-powered application that acts as a universal bridge between messy legal documents and structured, actionable insights.

## Project Structure
- `/backend`: FastAPI server that uses Gemini 1.5 Pro for analysis.
- `/lexi-frontend`: React + Tailwind dashboard for uploading and viewing results.

## Prerequisites
1.  **Google Cloud Gemini API Key**: Get one at [aistudio.google.com](https://aistudio.google.com/).
2.  **Node.js & Python** installed on your machine.

---

## How to Run

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
# Set your API Key
set GOOGLE_API_KEY=your_key_here  # Windows
# or
export GOOGLE_API_KEY=your_key_here # Mac/Linux

python main.py
```
The server will run at `http://localhost:8000`.

### 2. Start the Frontend
```bash
cd lexi-frontend
npm install
npm run dev
```
The dashboard will run at `http://localhost:5173`.

---

## Core Features (MVP)
- **OCR Analysis**: Upload photos of messy docs.
- **Risk Radar**: Real-time risk scoring and "Red Flag" detection.
- **The Corrector**: Suggestions for internal legal document errors.
- **Timeline extraction**: Critical deadlines in a chronological view.
- **Strategic Plan**: Step-by-step guidance on what to do next.

---
> [!NOTE]
> This is a "Simple MVP" starting point. Future updates will include specialized Multi-Agent agents working in parallel for even higher precision.