from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import ALLOWED_ORIGINS
from app.routes.api import router as api_router
from app.models.response_models import HealthResponse

app = FastAPI(
    title="Digital Guide API",
    description="AI-powered Digital Guide for rural first-time women users to access government schemes",
    version="1.0.0"
)

# CORS configuration - allows all origins so no FRONTEND_URL is required on Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Health endpoint required by Cloud Run and tests
@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok", version="1.0.0", scheme_loaded=True)

# Include API routes
app.include_router(api_router, prefix="/api")

# Error handler for unexpected exceptions to return friendly message instead of 500 stacktrace
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "server_error",
            "message": "మా వైపు సాంకేతిక సమస్య ఏర్పడింది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి."
        }
    )

# Static file serving for single-container Cloud Run deployment
possible_paths = [
    Path(__file__).resolve().parent.parent.parent / "frontend" / "dist",
    Path("/app/frontend/dist"),
    Path(__file__).resolve().parent.parent / "frontend" / "dist",
    Path("frontend/dist"),
]
FRONTEND_DIST = next((p for p in possible_paths if p.exists() and (p / "index.html").exists()), None)
if FRONTEND_DIST:
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
