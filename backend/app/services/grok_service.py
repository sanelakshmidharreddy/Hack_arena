import json
import logging
import httpx
from typing import Dict, Any, List, Optional

from app.config import XAI_API_KEY, XAI_BASE_URL, GROK_MODEL
from app.models.response_models import AssistantResponse, DocumentItem, StepItem, OptionItem
from app.services.scheme_service import scheme_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are "Digital Guide" (డిజిటల్ గైడ్ / டிஜிட்டல் வழிகாட்டி / डिजिटल साथी) — an empathetic AI assistant designed specifically for a first-time rural woman user in India who has:
- No English knowledge
- No technical background
- No prior digital literacy
- Zero knowledge of government websites, URLs, portals, or departments

YOUR CORE PRINCIPLES:
1. DO NOT BE A GENERIC CHATBOT. Be a caring, clear, respectful in-person digital guide.
2. RESPOND STRICTLY IN THE REQUESTED REGIONAL LANGUAGE ({language_name}). Do not use complex words or English jargon.
3. ASK ONLY ONE SIMPLE QUESTION AT A TIME if clarification is required (e.g. asking the daughter's age).
4. NEVER ASK FOR: Passwords, OTPs, PINs, Aadhaar numbers, or bank account credentials.
5. NEVER INVENT government rules, eligibility criteria, benefits, documents, or deadlines.
6. YOU MUST STRICTLY USE ONLY THE VERIFIED SCHEME INFORMATION PROVIDED BELOW.
7. If the user's question is outside this verified scheme, politely state:
   "ఈ పథకం గురించి మాత్రమే నాకు ధృవీకరించబడిన సమాచారం ఉంది." (I only have verified information about this scheme.)
8. If the user says "I don't understand" or asks to simplify, provide the simplest possible explanation.
9. Keep voice responses short and warm.
10. Always end with a clear physical next action (e.g. going to the local Post Office).

{verified_scheme_data}

OUTPUT MUST BE VALID JSON ONLY MATCHING THIS EXACT SCHEMA (NO MARKDOWN CODE FENCES):
{{
  "reply": "Conversational, very simple answer in the selected regional language",
  "intent": "Intent category name",
  "needs_clarification": true or false,
  "question": "One single simple question in the regional language if needed, else null",
  "question_options": [
    {{"label": "Option label in regional language", "value": "yes|no"}}
  ],
  "eligible": "yes" | "no" | "unknown",
  "explanation": "Simple verified explanation in regional language",
  "documents": [
    {{"name": "Document name in regional language", "purpose": "Simple purpose"}}
  ],
  "steps": [
    {{
      "step_number": 1,
      "instruction": "Simple single step instruction",
      "detail": "What to do in simple words",
      "action_text": "Button text (e.g. సిద్ధంగా ఉంది)"
    }}
  ],
  "next_action": "Clear physical next action in regional language",
  "source": "verified_demo_data",
  "confidence": "verified"
}}
"""

class GrokService:
    def __init__(self):
        self._api_key = XAI_API_KEY
        self._base_url = XAI_BASE_URL.rstrip("/")
        self._model = GROK_MODEL

        # Dynamic endpoint support: if a Groq key (gsk_...) is supplied, route to Groq; otherwise xAI
        if self._api_key and self._api_key.startswith("gsk_"):
            self._base_url = "https://api.groq.com/openai/v1"
            self._model = "llama-3.3-70b-versatile"
            logger.info("Detected Groq Cloud API credentials; routing to Groq endpoint.")
        elif self._api_key:
            logger.info(f"xAI Grok service initialized with model '{self._model}' at '{self._base_url}'.")
        else:
            logger.info("No live AI API key detected; using verified deterministic scheme engine.")

    def process_message(
        self,
        session_id: str,
        lang: str,
        message: str,
        history: List[Dict[str, str]]
    ) -> AssistantResponse:
        # If API key is present, attempt live Grok API call
        if self._api_key:
            try:
                return self._call_grok_api(lang, message, history)
            except Exception as e:
                logger.warning(f"xAI Grok API invocation failed: {e}. Gracefully falling back to verified scheme engine.")

        # Fallback to local verified scheme engine
        return self._detect_scenario_and_respond(message, lang)

    def _call_grok_api(
        self,
        lang: str,
        message: str,
        history: List[Dict[str, str]]
    ) -> AssistantResponse:
        lang_names = {
            "te": "Telugu (తెలుగు)",
            "ta": "Tamil (தமிழ்)",
            "hi": "Hindi (हिन्दी)",
            "en": "Simple English"
        }
        language_name = lang_names.get(lang, "Telugu")
        scheme_context = scheme_service.get_verified_context_prompt(lang)

        system_instruction = SYSTEM_PROMPT.format(
            language_name=language_name,
            verified_scheme_data=scheme_context
        )

        messages = [{"role": "system", "content": system_instruction}]
        for turn in history[-4:]:
            messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})
        messages.append({"role": "user", "content": message})

        endpoint = f"{self._base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self._model,
            "messages": messages,
            "temperature": 0.2,
            "response_format": {"type": "json_object"} if "api.x.ai" in self._base_url or "api.groq.com" in self._base_url else None
        }
        # Filter out None values
        payload = {k: v for k, v in payload.items() if v is not None}

        with httpx.Client(timeout=15.0) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()

        raw_content = data["choices"][0]["message"]["content"].strip()
        # Clean markdown wrappers if present
        if raw_content.startswith("```json"):
            raw_content = raw_content[7:]
        if raw_content.startswith("```"):
            raw_content = raw_content[3:]
        if raw_content.endswith("```"):
            raw_content = raw_content[:-3]
        raw_content = raw_content.strip()

        parsed = json.loads(raw_content)
        return AssistantResponse(**parsed)

    def explain_simply(self, text: str, lang: str) -> str:
        if self._api_key:
            try:
                lang_names = {"te": "Telugu", "ta": "Tamil", "hi": "Hindi", "en": "English"}
                prompt = (
                    f"Explain this government scheme statement to a first-time rural woman user "
                    f"in extremely simple, comforting {lang_names.get(lang, 'Telugu')}. "
                    f"Do not add any new facts or change the meaning. Keep it under 2 sentences.\n\n"
                    f"Statement: {text}"
                )
                endpoint = f"{self._base_url}/chat/completions"
                headers = {
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self._model,
                    "messages": [
                        {"role": "system", "content": "You are a simple language clarifier for rural women."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                }
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(endpoint, headers=headers, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"].strip()
            except Exception as e:
                logger.warning(f"Grok explain simply failed: {e}")

        # Deterministic simplification fallback
        demo_resp = scheme_service.get_deterministic_path("explain_simply", lang)
        return demo_resp.explanation

    def _detect_scenario_and_respond(self, message: str, lang: str) -> AssistantResponse:
        lower = message.lower().strip()

        if any(w in lower for w in ["understand", "simple", "అర్థం కాలేదు", "సులభంగా", "புரியவில்லை", "எளிமையாக", "समझ नहीं", "सरल"]):
            return scheme_service.get_deterministic_path("explain_simply", lang)

        if any(w in lower for w in ["yes", "7", "8", "5", "6", "9", "10", "అవును", "ஆம்", "हाँ", "eligible", "అర్హత", "years", "ఏళ్లు"]):
            return scheme_service.get_deterministic_path("eligible_yes", lang)

        if any(w in lower for w in ["document", "paper", "certificate", "కాగితాలు", "సర్టిఫికెట్", "ఆధార్", "ஆவணங்கள்", "சான்றிதழ்", "कागजात", "दस्तावेज"]):
            return scheme_service.get_deterministic_path("documents", lang)

        if any(w in lower for w in ["where", "go", "apply", "visit", "office", "పోస్టాఫీస్", "ఎక్కడికి", "వెళ్లాలి", "எங்கு", "செல்ல", "कहाँ", "जाना"]):
            return scheme_service.get_deterministic_path("how_to_proceed", lang)

        return scheme_service.get_deterministic_path("need_help", lang)

grok_service = GrokService()
