import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from app.config import ALLOWED_ORIGINS, validate_config, PORT
from app.routes.api import router as api_router
from app.models.response_models import HealthResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("jansakhi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation without logging secrets
    validate_config()
    yield
    logger.info("Jansakhi application shutting down.")

app = FastAPI(
    title="Jansakhi - Voice AI Digital Guide API",
    description="Voice-first AI guide for first-time rural Indian women accessing Sukanya Samriddhi Yojana",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits Vercel frontend, local dev, and custom domains
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Root Health endpoint required by Google Cloud Run and health checks
@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok", version="1.0.0", scheme_loaded=True)

# Include API routes
app.include_router(api_router, prefix="/api")

# Error handler for unexpected exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error: {exc}", exc_info=True)
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
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
