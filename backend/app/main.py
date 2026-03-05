from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, summary, risk

app = FastAPI(title="Guardian V2 Backend")

# CORS (needed if frontend runs on different port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Guardian V2 Backend Running"}

app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(summary.router, prefix="/api/summary", tags=["Summary"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk"])