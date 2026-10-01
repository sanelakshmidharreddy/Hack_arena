import json
import logging
from typing import Dict, Any, List, Optional
from app.config import GEMINI_API_KEY
from app.models.response_models import AssistantResponse, DocumentItem, StepItem, OptionItem
from app.services.scheme_service import scheme_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are "Digital Guide" (డిజిటల్ గైడ్ / டிஜிட்டல் வழிகாட்டி / डिजिटल साथी) — an AI assistant designed specifically for a first-time rural woman user in India who has:
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

OUTPUT MUST BE VALID JSON MATCHING THIS EXACT SCHEMA:
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

class GeminiService:
    def __init__(self):
        self._client = None
        if GEMINI_API_KEY:
            try:
                from google import genai
                self._client = genai.Client(api_key=GEMINI_API_KEY)
                logger.info("Gemini Client successfully initialized with google-genai SDK.")
            except Exception as e:
                logger.warning(f"Could not initialize Gemini Client: {e}")

    def process_message(
        self,
        session_id: str,
        lang: str,
        message: str,
        history: List[Dict[str, str]]
    ) -> AssistantResponse:
        # If client is configured, call Gemini API
        if self._client:
            try:
                return self._call_gemini(lang, message, history)
            except Exception as e:
                logger.warning(f"Gemini API invocation failed: {e}. Gracefully using verified scheme engine.")

        # Fallback to local verified scheme engine
        return self._detect_scenario_and_respond(message, lang)

    def _call_gemini(
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

        prompt = SYSTEM_PROMPT.format(
            language_name=language_name,
            verified_scheme_data=scheme_context
        )

        conversation_contents = f"{prompt}\n\nRecent Conversation:\n"
        for turn in history[-4:]:
            conversation_contents += f"{turn['role']}: {turn['content']}\n"
        conversation_contents += f"user: {message}\nassistant (strictly JSON):"

        response = self._client.models.generate_content(
            model="gemini-2.5-flash",
            contents=conversation_contents,
        )

        text_output = response.text.strip()
        # Clean any markdown code fences if Gemini returns ```json
        if text_output.startswith("```json"):
            text_output = text_output[7:]
        if text_output.startswith("```"):
            text_output = text_output[3:]
        if text_output.endswith("```"):
            text_output = text_output[:-3]
        text_output = text_output.strip()

        data = json.loads(text_output)
        return AssistantResponse(**data)

    def explain_simply(self, text: str, lang: str) -> str:
        if self._client:
            try:
                lang_names = {"te": "Telugu", "ta": "Tamil", "hi": "Hindi", "en": "English"}
                prompt = (
                    f"Explain this government scheme statement to a first-time rural woman user "
                    f"in extremely simple, comforting {lang_names.get(lang, 'Telugu')}. "
                    f"Do not add any new facts or change the meaning. Keep it under 2 sentences.\n\n"
                    f"Statement: {text}"
                )
                response = self._client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini explain simply failed: {e}")

        # Deterministic simplification
        demo_resp = scheme_service.get_deterministic_path("explain_simply", lang)
        return demo_resp.explanation

    def _detect_scenario_and_respond(self, message: str, lang: str) -> AssistantResponse:
        lower = message.lower().strip()

        # Check for "explain simply" or "don't understand"
        if any(w in lower for w in ["understand", "simple", "అర్థం కాలేదు", "సులభంగా", "புரியவில்லை", "எளிமையாக", "समझ नहीं", "सरल"]):
            return scheme_service.get_deterministic_path("explain_simply", lang)

        # Check for eligibility / age answers
        if any(w in lower for w in ["yes", "7", "8", "5", "6", "9", "10", "అవును", "ஆம்", "हाँ", "eligible", "అర్హత", "years", "ఏళ్లు"]):
            return scheme_service.get_deterministic_path("eligible_yes", lang)

        # Check for documents
        if any(w in lower for w in ["document", "paper", "certificate", "కాగితాలు", "సర్టిఫికెట్", "ఆధార్", "ஆவணங்கள்", "சான்றிதழ்", "कागजात", "दस्तावेज"]):
            return scheme_service.get_deterministic_path("documents", lang)

        # Check for how to proceed / where to go
        if any(w in lower for w in ["where", "go", "apply", "visit", "office", "పోస్టాఫీస్", "ఎక్కడికి", "వెళ్లాలి", "எங்கு", "செல்ல", "कहाँ", "जाना"]):
            return scheme_service.get_deterministic_path("how_to_proceed", lang)

        # Default to need help
        return scheme_service.get_deterministic_path("need_help", lang)

gemini_service = GeminiService()
