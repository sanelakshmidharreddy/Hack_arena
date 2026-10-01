import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# xAI Grok API Configuration
XAI_API_KEY: str = os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY", "")
XAI_BASE_URL: str = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1")
GROK_MODEL: str = os.getenv("GROK_MODEL", "grok-2-latest")

PORT: int = int(os.getenv("PORT", "8000"))
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

# CORS configuration supporting local dev, Render, and Vercel frontends
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

EXTRA_ALLOWED_ORIGIN = os.getenv("FRONTEND_URL")
if EXTRA_ALLOWED_ORIGIN:
    ALLOWED_ORIGINS.append(EXTRA_ALLOWED_ORIGIN.rstrip("/"))
