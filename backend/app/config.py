import os
import logging
from pathlib import Path
from typing import List
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load .env file if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# LLM Providers Configuration (No xAI / Grok-by-xAI)
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip()

# Google Cloud Text-to-Speech & Maps
GOOGLE_CLOUD_API_KEY: str = os.getenv("GOOGLE_CLOUD_API_KEY", "").strip()
GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "").strip()

# LLM Selection & Orchestration
LLM_PRIMARY: str = os.getenv("LLM_PRIMARY", "gemini").strip().lower()
LLM_FALLBACK: str = os.getenv("LLM_FALLBACK", "groq").strip().lower()

# Server & Environment
PORT: int = int(os.getenv("PORT", "8000"))
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development").strip().lower()

# CORS Allowed Origins
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

EXTRA_ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGINS") or os.getenv("FRONTEND_URL")
if EXTRA_ALLOWED_ORIGIN:
    for origin in EXTRA_ALLOWED_ORIGIN.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned and cleaned not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(cleaned)


def validate_config():
    """
    Startup validation: prints clear status messages WITHOUT EVER printing,
    logging, or leaking secret key values.
    """
    logger.info("=== Jansakhi Startup Configuration Check ===")
    logger.info(f"Environment: {ENVIRONMENT} | Port: {PORT}")
    logger.info(f"Primary LLM: {LLM_PRIMARY} | Fallback LLM: {LLM_FALLBACK}")

    if GEMINI_API_KEY:
        logger.info("[Config] GEMINI_API_KEY is configured (Google AI Studio).")
    else:
        logger.warning("[Config] GEMINI_API_KEY is NOT set.")

    if GROQ_API_KEY:
        logger.info(f"[Config] GROQ_API_KEY is configured (Groq Cloud, model: {GROQ_MODEL}).")
    else:
        logger.warning("[Config] GROQ_API_KEY is NOT set.")

    if GOOGLE_CLOUD_API_KEY:
        logger.info("[Config] GOOGLE_CLOUD_API_KEY is configured (Google Cloud TTS / Places).")
    else:
        logger.info("[Config] GOOGLE_CLOUD_API_KEY not set. Using Application Default Credentials (ADC) or client fallback.")

    if GOOGLE_MAPS_API_KEY:
        logger.info("[Config] GOOGLE_MAPS_API_KEY is configured.")
    else:
        logger.info("[Config] GOOGLE_MAPS_API_KEY not set. Using OpenStreetMap & deep-link navigation.")

    logger.info("============================================")
