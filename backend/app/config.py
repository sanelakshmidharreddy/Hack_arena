import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
PORT: int = int(os.getenv("PORT", "8000"))
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# When in production, additional configured origins can be added
EXTRA_ALLOWED_ORIGIN = os.getenv("FRONTEND_URL")
if EXTRA_ALLOWED_ORIGIN:
    ALLOWED_ORIGINS.append(EXTRA_ALLOWED_ORIGIN)
