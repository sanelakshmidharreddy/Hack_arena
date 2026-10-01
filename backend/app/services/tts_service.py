import base64
import hashlib
import logging
from typing import Dict, Any, Optional, List
import httpx

from app.config import GOOGLE_CLOUD_API_KEY

logger = logging.getLogger(__name__)

# Verified Google Cloud TTS voice catalogue for Indian locales
# Checked against official Google Cloud Text-to-Speech documentation
RECOMMENDED_VOICES = {
    "te-IN": [
        {"name": "te-IN-Standard-A", "gender": "FEMALE", "display_name": "తెలుగు మహిళ (Standard A)"},
        {"name": "te-IN-Standard-B", "gender": "MALE", "display_name": "తెలుగు పురుషుడు (Standard B)"}
    ],
    "ta-IN": [
        {"name": "ta-IN-Standard-A", "gender": "FEMALE", "display_name": "தமிழ் பெண் (Standard A)"},
        {"name": "ta-IN-Standard-B", "gender": "MALE", "display_name": "தமிழ் ஆண் (Standard B)"}
    ],
    "hi-IN": [
        {"name": "hi-IN-Neural2-A", "gender": "FEMALE", "display_name": "हिन्दी महिला (Neural2 A)"},
        {"name": "hi-IN-Neural2-B", "gender": "MALE", "display_name": "हिन्दी पुरुष (Neural2 B)"},
        {"name": "hi-IN-Standard-A", "gender": "FEMALE", "display_name": "हिन्दी महिला (Standard A)"}
    ],
    "en-IN": [
        {"name": "en-IN-Neural2-A", "gender": "FEMALE", "display_name": "Indian English (Female Neural2)"},
        {"name": "en-IN-Neural2-B", "gender": "MALE", "display_name": "Indian English (Male Neural2)"},
        {"name": "en-IN-Wavenet-A", "gender": "FEMALE", "display_name": "Indian English (WaveNet A)"}
    ]
}

LANG_CODE_MAP = {
    "te": "te-IN",
    "ta": "ta-IN",
    "hi": "hi-IN",
    "en": "en-IN",
}

class TTSService:
    def __init__(self):
        self.api_key = GOOGLE_CLOUD_API_KEY
        # In-memory LRU cache of base64 audio to avoid repeated synthesis calls
        self._audio_cache: Dict[str, str] = {}
        self._max_cache_size = 200

    def get_voice_catalog(self, lang: str = "te") -> List[Dict[str, Any]]:
        locale = LANG_CODE_MAP.get(lang, "te-IN")
        return RECOMMENDED_VOICES.get(locale, RECOMMENDED_VOICES["te-IN"])

    def synthesize(
        self,
        text: str,
        lang: str = "te",
        voice_name: Optional[str] = None,
        gender: str = "FEMALE",
        speed: float = 0.95
    ) -> Dict[str, Any]:
        """
        Synthesizes text using Google Cloud Text-to-Speech API with phrase caching.
        Falls back smoothly to client-side browser synthesis if key is missing/unauthorized.
        """
        clean_text = text.replace("*", "").replace("#", "").strip()
        if not clean_text:
            return {"audio_content": None, "fallback_to_browser": True}

        locale = LANG_CODE_MAP.get(lang, "te-IN")

        # Pick voice
        if not voice_name:
            voices = RECOMMENDED_VOICES.get(locale, [])
            matched = next((v["name"] for v in voices if v["gender"] == gender.upper()), None)
            voice_name = matched or (voices[0]["name"] if voices else f"{locale}-Standard-A")

        # Check Cache
        cache_key = hashlib.md5(f"{clean_text}:{locale}:{voice_name}:{speed}".encode("utf-8")).hexdigest()
        if cache_key in self._audio_cache:
            return {
                "audio_content": self._audio_cache[cache_key],
                "cached": True,
                "fallback_to_browser": False,
                "voice_used": voice_name
            }

        # If no Google Cloud API key, return fallback signal
        if not self.api_key:
            return {
                "audio_content": None,
                "fallback_to_browser": True,
                "reason": "google_cloud_api_key_not_configured"
            }

        # Call Google Cloud TTS REST API
        endpoint = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={self.api_key}"
        payload = {
            "input": {"text": clean_text},
            "voice": {
                "languageCode": locale,
                "name": voice_name,
                "ssmlGender": gender.upper()
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "speakingRate": speed,
                "pitch": 0.0
            }
        }

        try:
            with httpx.Client(timeout=8.0) as client:
                resp = client.post(endpoint, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    audio_b64 = data.get("audioContent")
                    if audio_b64:
                        # Store in cache
                        if len(self._audio_cache) >= self._max_cache_size:
                            # evict oldest item
                            oldest = next(iter(self._audio_cache))
                            del self._audio_cache[oldest]
                        self._audio_cache[cache_key] = audio_b64

                        return {
                            "audio_content": audio_b64,
                            "cached": False,
                            "fallback_to_browser": False,
                            "voice_used": voice_name
                        }
                else:
                    logger.warning(f"Google Cloud TTS returned {resp.status_code}: {resp.text[:150]}")
        except Exception as e:
            logger.warning(f"Google Cloud TTS synthesis call failed: {e}")

        # Fallback to browser synthesis
        return {
            "audio_content": None,
            "fallback_to_browser": True,
            "reason": "cloud_tts_unavailable"
        }

tts_service = TTSService()
