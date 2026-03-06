from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Import all the route modules from the routes directory
from app.routes import (
    optimizer,
    polyglot,
    codehealer,
    analytics,
    home,
    auth
)

# load environment variables from .env file
load_dotenv()
model = os.getenv("OLLAMA_DEFAULT_MODEL") 

# Initialize the main FastAPI application
app = FastAPI(
    title="Guardian V2 API",
    description="Neural QA Engine Backend - Powered by Local Ollama",
    version="2.0.0"
)

# Set up CORS middleware to allow your React/Vite frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "[http://127.0.0.1:5173](http://127.0.0.1:5173)", "https://self-healing-llm-bot.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the individual routers
# The prefix="/api" ensures all your React fetch() calls map correctly
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(home.router, prefix="/api", tags=["Home UI Metrics"])
app.include_router(optimizer.router, prefix="/api", tags=["Code Optimizer"])
app.include_router(polyglot.router, prefix="/api", tags=["Polyglot Translator"])
app.include_router(codehealer.router, prefix="/api", tags=["Code Healer"])
app.include_router(analytics.router, prefix="/api", tags=["Dashboard Analytics"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "online", 
        "engine": "Guardian V2 AI Core", 
        "message": "FastAPI server is running and ready for connections."
    }

# This allows you to run the file directly from the command line using `python app/main.py`
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)