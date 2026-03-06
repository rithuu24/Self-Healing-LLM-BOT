from fastapi import FastAPI

from app.routes import (
    analyze,
    summary,
    risk,
    codehealer,
    optimizer,
    polyglot,
    analytics
)

app = FastAPI(
    title="Guardian V2 Backend",
    version="2.0"
)

# Root health check
@app.get("/")
def root():
    return {"message": "Guardian V2 Backend Running"}


# -----------------------------
# Security Analysis APIs
# -----------------------------

app.include_router(
    analyze.router,
    prefix="/api/analyze",
    tags=["Analyze"]
)

app.include_router(
    summary.router,
    prefix="/api/summary",
    tags=["Summary"]
)

app.include_router(
    risk.router,
    prefix="/api/risk",
    tags=["Risk"]
)


# -----------------------------
# Guardian V2 AI Tools
# -----------------------------

app.include_router(
    codehealer.router,
    prefix="/api/codehealer",
    tags=["CodeHealer"]
)

app.include_router(
    optimizer.router,
    prefix="/api/optimizer",
    tags=["Optimizer"]
)

app.include_router(
    polyglot.router,
    prefix="/api/polyglot",
    tags=["PolyglotBridge"]
)

app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"]
)