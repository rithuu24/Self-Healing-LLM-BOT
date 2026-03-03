from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, summary, risk

app = FastAPI(title="Guardian V2 Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze")
app.include_router(summary.router, prefix="/api/summary")
app.include_router(risk.router, prefix="/api/risk")

@app.get("/")
def root():
    return {"message": "Guardian V2 Backend Running"}