from app.routes import (
    analyze,
    summary,
    risk,
    codehealer,
    optimizer,
    polyglot,
    analytics
)

app.include_router(codehealer.router, prefix="/api/codehealer", tags=["CodeHealer"])
app.include_router(optimizer.router, prefix="/api/optimizer", tags=["Optimizer"])
app.include_router(polyglot.router, prefix="/api/polyglot", tags=["PolyglotBridge"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])