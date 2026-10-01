"""
Scheme Router Service for Jansakhi.

Identifies which of the 6 supported schemes a user message is about,
using keyword matching (language-aware) and optional LLM classification.
Returns:
  - scheme_id: str (one of the 6 IDs, or "ssy" alias for sukanya_samriddhi_yojana)
  - confidence: float 0–1
  - candidates: list[str] for ambiguous cases
  - clarification_needed: bool
  - clarification_question: str | None  (one question at a time)

Rules:
  1. Keyword match first (deterministic, fast, offline).
  2. LLM classify if keyword match returns "ambiguous".
  3. Never mix facts from different schemes in one answer.
  4. If vague ("I need help / scholarship"), trigger the 4-step
     one-question-at-a-time clarification flow.
"""
from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import httpx

from app.config import GEMINI_API_KEY, GEMINI_MODEL, GROQ_API_KEY, GROQ_MODEL, LLM_PRIMARY, LLM_FALLBACK

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Scheme catalogue (canonical IDs must match verified_schemes.json)
# ---------------------------------------------------------------------------

SCHEME_KEYWORDS: Dict[str, Dict[str, List[str]]] = {
    "sukanya_samriddhi_yojana": {
        "en": ["sukanya", "ssy", "samriddhi", "girl child savings", "girl savings", "daughter savings",
               "post office savings", "small savings girl", "beti bachao", "account for daughter",
               "daughter account", "interest 8.2", "250 deposit"],
        "te": ["సుకున్య", "సమృద్ధి", "పాప పొదుపు", "కూతురు పొదుపు", "ఆడపిల్ల పొదుపు", "పోస్టాఫీస్ ఖాతా"],
        "hi": ["सुकन्या", "समृद्धि", "बेटी बचाओ", "बालिका बचत", "बेटी का खाता", "पोस्ट ऑफिस बचत खाता"],
        "ta": ["சுகன்யா", "சம்ரித்தி", "செல்வமகள்", "மகள் சேமிப்பு", "பெண் குழந்தை சேமிப்பு"],
    },
    "kgbv": {
        "en": ["kgbv", "kasturba", "kasturba gandhi", "balika vidyalaya", "residential school girls",
               "hostel school girls", "free hostel school", "class 6 residential", "girls boarding school",
               "sc st residential school", "free school hostel", "samagra shiksha school"],
        "te": ["కస్తూర్బా", "కస్తూర్బా గాంధీ", "బాలికా విద్యాలయం", "గురుకుల పాఠశాల", "వసతి పాఠశాల",
               "ఉచిత వసతి పాఠశాల", "ఆడపిల్లల వసతి పాఠశాల"],
        "hi": ["कस्तूरबा", "कस्तूरबा गांधी", "बालिका विद्यालय", "आवासीय विद्यालय", "छात्रावास स्कूल",
               "केजीबीवी", "आवासीय बालिका विद्यालय", "मुफ्त छात्रावास"],
        "ta": ["கஸ்தூரிபா", "கஸ்தூரிபா காந்தி", "பாலிகா வித்யாலயா", "இல்லம் பள்ளி", "தங்கல் பள்ளி",
               "இலவச தங்கல் பள்ளி"],
    },
    "pm_yasasvi_top_class": {
        "en": ["yasasvi", "pm yasasvi", "obc scholarship", "ebc scholarship", "dnt scholarship",
               "young achievers scholarship", "vibrant india", "class 9 scholarship", "class 10 scholarship",
               "class 11 scholarship", "class 12 scholarship", "obc school scholarship",
               "backward class scholarship school"],
        "te": ["యశస్వి", "OBC స్కాలర్షిప్", "ఓబీసీ స్కాలర్షిప్", "EBC స్కాలర్షిప్", "తరగతి 9", "తరగతి 10",
               "వెనుకబడిన వర్గాల స్కాలర్షిప్", "DNT స్కాలర్షిప్"],
        "hi": ["यशस्वी", "OBC छात्रवृत्ति", "ओबीसी छात्रवृत्ति", "EBC छात्रवृत्ति", "कक्षा 9 छात्रवृत्ति",
               "कक्षा 10 छात्रवृत्ति", "कक्षा 11 छात्रवृत्ति", "कक्षा 12 छात्रवृत्ति",
               "पिछड़ा वर्ग छात्रवृत्ति", "DNT छात्रवृत्ति"],
        "ta": ["யசஸ்வி", "OBC உதவித்தொகை", "EBC உதவித்தொகை", "9 ஆம் வகுப்பு உதவித்தொகை",
               "10 ஆம் வகுப்பு உதவித்தொகை", "பிற்படுத்தப்பட்ட வகுப்பு உதவித்தொகை"],
    },
    "aicte_pragati": {
        "en": ["pragati", "aicte pragati", "pragati scholarship", "girl engineering scholarship",
               "girl technical scholarship", "engineering college scholarship girl",
               "engineering college scholarship", "diploma scholarship girl",
               "aicte scholarship", "technical education scholarship girl", "b.tech scholarship girl",
               "polytechnic scholarship girl", "50000 scholarship engineering",
               "engineering scholarship girl", "technical college scholarship"],
        "te": ["ప్రగతి", "AICTE ప్రగతి", "ఇంజనీరింగ్ స్కాలర్షిప్", "టెక్నికల్ కళాశాల స్కాలర్షిప్",
               "బీటెక్ స్కాలర్షిప్", "ఆడపిల్ల ఇంజనీరింగ్ స్కాలర్షిప్", "ఇంజనీరింగ్ కళాశాల",
               "పాలిటెక్నిక్ స్కాలర్షిప్"],
        "hi": ["प्रगति", "AICTE प्रगति", "इंजीनियरिंग स्कॉलरशिप", "तकनीकी छात्रवृत्ति",
               "बी टेक छात्रवृत्ति", "लड़कियों के लिए इंजीनियरिंग छात्रवृत्ति",
               "डिप्लोमा छात्रवृत्ति लड़की", "पॉलिटेक्निक छात्रवृत्ति"],
        "ta": ["பிரகதி", "AICTE பிரகதி", "பொறியியல் உதவித்தொகை", "தொழில்நுட்ப உதவித்தொகை",
               "பி.டெக் உதவித்தொகை", "பெண் மாணவர் பொறியியல் உதவித்தொகை",
               "பாலிடெக்னிக் உதவித்தொகை"],
    },
    "nmmss": {
        "en": ["nmmss", "national means cum merit", "means cum merit", "nmms", "class 8 scholarship",
               "merit scholarship class 8", "means merit scholarship", "state selection examination scholarship",
               "nmms exam", "12000 scholarship school"],
        "te": ["NMMSS", "నేషనల్ మీన్స్ మెరిట్ స్కాలర్షిప్", "మేధా మెరిట్ స్కాలర్షిప్",
               "8వ తరగతి స్కాలర్షిప్", "NMMS", "రాష్ట్ర ఎంపిక పరీక్ష స్కాలర్షిప్"],
        "hi": ["NMMSS", "राष्ट्रीय साधन सह मेधा छात्रवृत्ति", "NMMS", "कक्षा 8 छात्रवृत्ति",
               "मेधा छात्रवृत्ति परीक्षा", "12000 छात्रवृत्ति"],
        "ta": ["NMMSS", "NMMS", "தேசிய திறன் மற்றும் தகுதி உதவித்தொகை", "8 ஆம் வகுப்பு உதவித்தொகை",
               "மாநில தேர்வு உதவித்தொகை"],
    },
    "pm_usp": {
        "en": ["pm usp", "pm-usp", "central sector scheme scholarship", "csss scholarship",
               "college scholarship merit", "university scholarship", "higher education scholarship",
               "12000 college scholarship", "20000 college scholarship", "80th percentile scholarship",
               "uchchatar shiksha", "protsahan scholarship", "graduation scholarship merit",
               "top 20 percent scholarship"],
        "te": ["PM USP", "కేంద్ర రంగ స్కాలర్షిప్", "కళాశాల మెరిట్ స్కాలర్షిప్",
               "ఉన్నత విద్య స్కాలర్షిప్", "గ్రాడ్యుయేషన్ స్కాలర్షిప్", "యూనివర్సిటీ స్కాలర్షిప్"],
        "hi": ["PM USP", "केंद्रीय क्षेत्र छात्रवृत्ति", "कॉलेज मेधा छात्रवृत्ति",
               "उच्च शिक्षा छात्रवृत्ति", "ग्रेजुएशन छात्रवृत्ति", "विश्वविद्यालय छात्रवृत्ति"],
        "ta": ["PM USP", "மத்திய துறை உதவித்தொகை", "கல்லூரி தகுதி உதவித்தொகை",
               "உயர் கல்வி உதவித்தொகை", "பட்டப்படிப்பு உதவித்தொகை"],
    },
}

# Vague triggers that need one-question clarification
_VAGUE_TRIGGERS_EN = [
    "scholarship", "help", "assistance", "scheme", "government help",
    "education", "my daughter study", "study help", "need scholarship",
    "college help", "school help", "support",
]
_VAGUE_TRIGGERS_MULTILANG: List[str] = [
    # Telugu
    "స్కాలర్షిప్", "సహాయం", "చదువు", "పాఠశాల సహాయం", "కళాశాల సహాయం",
    # Hindi
    "छात्रवृत्ति", "मदद", "पढ़ाई", "स्कूल मदद", "कॉलेज मदद", "सहायता",
    # Tamil
    "உதவித்தொகை", "உதவி", "படிப்பு", "பள்ளி உதவி", "கல்லூரி உதவி",
]

# Clarification flow: 4 steps
_CLARIFICATION_STEPS: List[Dict[str, Dict[str, str]]] = [
    {
        "question": {
            "en": "Is your daughter currently in school (Classes 6–12) or in college?",
            "te": "మీ పాప ప్రస్తుతం పాఠశాలలో (6వ నుండి 12వ తరగతి) చదువుతుందా, లేదా కళాశాలలో చేరాలా?",
            "hi": "क्या आपकी बेटी अभी स्कूल (कक्षा 6 से 12) में है, या कॉलेज जाना चाहती है?",
            "ta": "உங்கள் மகள் இப்போது பள்ளியில் (6 முதல் 12 ஆம் வகுப்பு) படிக்கிறாளா, அல்லது கல்லூரிக்கு செல்ல வேண்டுமா?",
        },
        "options": {
            "en": ["School (Classes 6–12)", "College / University", "Technical college (Engineering / Diploma)"],
            "te": ["పాఠశాల (6వ నుండి 12వ తరగతి)", "కళాశాల / విశ్వవిద్యాలయం", "ఇంజనీరింగ్ / పాలిటెక్నిక్"],
            "hi": ["स्कूल (कक्षा 6 से 12)", "कॉलेज / विश्वविद्यालय", "तकनीकी कॉलेज (इंजीनियरिंग / डिप्लोमा)"],
            "ta": ["பள்ளி (6 முதல் 12 ஆம் வகுப்பு)", "கல்லூரி / பல்கலைக்கழகம்", "தொழில்நுட்ப கல்லூரி (பொறியியல் / டிப்ளோமா)"],
        },
    },
    {
        "question": {
            "en": "Does your daughter need a hostel / residential school, or just a scholarship to cover school fees?",
            "te": "మీ పాపకు వసతి (హాస్టల్) సహితం పాఠశాల అవసరమా, లేదా పాఠశాల ఖర్చులకు స్కాలర్షిప్ అవసరమా?",
            "hi": "क्या आपकी बेटी को छात्रावास सहित स्कूल चाहिए, या सिर्फ स्कूल फीस के लिए छात्रवृत्ति चाहिए?",
            "ta": "உங்கள் மகளுக்கு தங்கல் வசதியுடன் பள்ளி வேண்டுமா, அல்லது பள்ளி கட்டணத்திற்கு உதவித்தொகை மட்டும் போதுமா?",
        },
        "options": {
            "en": ["Free hostel + residential school", "Just a scholarship for fees"],
            "te": ["ఉచిత హాస్టల్ + పాఠశాల", "కేవలం ఫీజుల కోసం స్కాలర్షిప్"],
            "hi": ["निःशुल्क छात्रावास + स्कूल", "केवल फीस के लिए छात्रवृत्ति"],
            "ta": ["இலவச தங்கல் + பள்ளி", "கட்டணத்திற்கு மட்டும் உதவித்தொகை"],
        },
    },
    {
        "question": {
            "en": "Does your daughter belong to OBC, EBC, or DNT category?",
            "te": "మీ పాప OBC, EBC, లేదా DNT వర్గానికి చెందుతారా?",
            "hi": "क्या आपकी बेटी OBC, EBC, या DNT वर्ग से है?",
            "ta": "உங்கள் மகள் OBC, EBC, அல்லது DNT பிரிவைச் சேர்ந்தவரா?",
        },
        "options": {
            "en": ["Yes, OBC / EBC / DNT", "No / Not sure"],
            "te": ["అవును, OBC / EBC / DNT", "కాదు / తెలియదు"],
            "hi": ["हाँ, OBC / EBC / DNT", "नहीं / पता नहीं"],
            "ta": ["ஆம், OBC / EBC / DNT", "இல்லை / தெரியவில்லை"],
        },
    },
]


@dataclass
class RoutingResult:
    """Result of scheme identification."""
    scheme_id: str  # canonical ID or "ambiguous" or "none"
    confidence: float  # 0.0 – 1.0
    candidates: List[str] = field(default_factory=list)
    clarification_needed: bool = False
    clarification_step: int = 0  # which step (0-indexed) we're at
    clarification_question: Optional[str] = None
    clarification_options: Optional[List[str]] = None
    identified_scheme_label: Optional[str] = None  # short label for display


def _normalise(text: str) -> str:
    """Lowercase and strip punctuation for matching."""
    return re.sub(r"[^\w\s]", " ", text.lower()).strip()


def identify_scheme_from_message(message: str, lang: str = "en") -> RoutingResult:
    """
    Identify which scheme a user message refers to.

    Priority order:
      1. Exact keyword match in the user language + English.
      2. If zero matches  → vague query → ask clarification.
      3. If multiple matches → check counts, highest wins; tie → ask clarification.
      4. Returns 'none' only if message is clearly off-topic (very short / gibberish).
    """
    norm = _normalise(message)
    score: Dict[str, int] = {sid: 0 for sid in SCHEME_KEYWORDS}

    for scheme_id, lang_kws in SCHEME_KEYWORDS.items():
        for kw_lang in [lang, "en"]:
            for kw in lang_kws.get(kw_lang, []):
                if _normalise(kw) in norm:
                    score[scheme_id] += 1

    max_score = max(score.values())

    if max_score == 0:
        # Check for vague triggers
        is_vague = any(_normalise(t) in norm for t in _VAGUE_TRIGGERS_EN + _VAGUE_TRIGGERS_MULTILANG)
        if is_vague:
            q_data = _CLARIFICATION_STEPS[0]
            return RoutingResult(
                scheme_id="ambiguous",
                confidence=0.0,
                candidates=list(SCHEME_KEYWORDS.keys()),
                clarification_needed=True,
                clarification_step=0,
                clarification_question=q_data["question"].get(lang, q_data["question"]["en"]),
                clarification_options=q_data["options"].get(lang, q_data["options"]["en"]),
            )
        return RoutingResult(scheme_id="none", confidence=0.0)

    top_schemes = [sid for sid, s in score.items() if s == max_score]

    if len(top_schemes) == 1:
        sid = top_schemes[0]
        confidence = min(1.0, max_score / 3.0)
        labels = {
            "sukanya_samriddhi_yojana": "Sukanya Samriddhi Yojana (SSY)",
            "kgbv": "Kasturba Gandhi Balika Vidyalaya (KGBV)",
            "pm_yasasvi_top_class": "PM-YASASVI Top Class Education",
            "aicte_pragati": "AICTE Pragati Scholarship",
            "nmmss": "National Means-cum-Merit Scholarship (NMMSS)",
            "pm_usp": "PM-USP Central Sector Scholarship",
        }
        return RoutingResult(
            scheme_id=sid,
            confidence=confidence,
            candidates=[sid],
            clarification_needed=False,
            identified_scheme_label=labels.get(sid, sid),
        )

    # Multiple high-score schemes → clarify
    q_data = _CLARIFICATION_STEPS[0]
    return RoutingResult(
        scheme_id="ambiguous",
        confidence=0.5,
        candidates=top_schemes,
        clarification_needed=True,
        clarification_step=0,
        clarification_question=q_data["question"].get(lang, q_data["question"]["en"]),
        clarification_options=q_data["options"].get(lang, q_data["options"]["en"]),
    )


def route_clarification_answer(
    answer: str,
    step: int,
    lang: str = "en",
    candidates: Optional[List[str]] = None,
) -> RoutingResult:
    """
    Process the user's answer to a clarification question and either
    resolve to a scheme or return the next clarification question.

    step 0 answer options:
      - "school" / school option  → step 1 (hostel vs fee-only)
      - "college" / university    → pm_usp
      - "technical" / engineering → aicte_pragati

    step 1 answer options:
      - "hostel" → kgbv
      - "scholarship" / "fees"   → step 2 (OBC check)

    step 2 answer options:
      - "yes" / OBC / EBC / DNT  → pm_yasasvi
      - "no"                     → nmmss (merit-based school)
    """
    norm = _normalise(answer)

    labels = {
        "sukanya_samriddhi_yojana": "Sukanya Samriddhi Yojana (SSY)",
        "kgbv": "Kasturba Gandhi Balika Vidyalaya (KGBV)",
        "pm_yasasvi_top_class": "PM-YASASVI Top Class Education",
        "aicte_pragati": "AICTE Pragati Scholarship",
        "nmmss": "National Means-cum-Merit Scholarship (NMMSS)",
        "pm_usp": "PM-USP Central Sector Scholarship",
    }

    def _resolved(sid: str) -> RoutingResult:
        return RoutingResult(
            scheme_id=sid,
            confidence=0.85,
            candidates=[sid],
            clarification_needed=False,
            identified_scheme_label=labels.get(sid, sid),
        )

    def _next_step(s: int) -> RoutingResult:
        q_data = _CLARIFICATION_STEPS[s]
        return RoutingResult(
            scheme_id="ambiguous",
            confidence=0.0,
            candidates=candidates or list(SCHEME_KEYWORDS.keys()),
            clarification_needed=True,
            clarification_step=s,
            clarification_question=q_data["question"].get(lang, q_data["question"]["en"]),
            clarification_options=q_data["options"].get(lang, q_data["options"]["en"]),
        )

    if step == 0:
        engineering_kws = ["technical", "engineering", "diploma", "polytechnic",
                           "pragati", "btech", "b tech",
                           "इंजीनियरिंग", "डिप्लोमा", "पॉलिटेक्निक",
                           "பொறியியல்", "டிப்ளோமா", "பாலிடெக்னிக்"]
        if any(_normalise(w) in norm for w in engineering_kws):
            return _resolved("aicte_pragati")
        college_kws = ["college", "university", "graduation", "degree", "higher education",
                       "కళాశాల", "విశ్వవిద్యాలయం", "कॉलेज", "विश्वविद्यालय",
                       "கல்லூரி", "பல்கலைக்கழகம்"]
        if any(_normalise(w) in norm for w in college_kws):
            return _resolved("pm_usp")
        # Default: school → step 1
        return _next_step(1)


    if step == 1:
        hostel_kws = ["hostel", "residential", "boarding", "stay", "free school",
                     "వసతి", "హాస్టల్", "छात्रावास", "आवासीय", "தங்கல்", "இல்லம்",
                     "free hostel"]
        if any(_normalise(w) in norm for w in hostel_kws):
            return _resolved("kgbv")
        # Fee/scholarship answer → step 2
        return _next_step(2)

    if step == 2:
        # Check for positive OBC/EBC/DNT indicator first
        obc_positive = any(w in norm for w in ["yes", "obc", "ebc", "dnt", "backward",
                                                "అవును", "ओबीसी", "ஆம்",
                                                "पिछड़ा", "OBC", "EBC"])
        if obc_positive:
            return _resolved("pm_yasasvi_top_class")
        return _resolved("nmmss")

    # Fallback
    return _resolved("nmmss")


def classify_scheme_with_llm(
    message: str,
    lang: str,
    scheme_ids: List[str],
) -> Optional[str]:
    """
    Use Gemini or Groq to classify which scheme the user is asking about.
    Returns a scheme_id string or None if classification fails.
    Outputs strict JSON: {"scheme_id": "<id>", "confidence": <float>}.
    Never reveals API keys.
    """
    scheme_list = "\n".join(f"- {sid}" for sid in scheme_ids)
    prompt = (
        f"Classify the following user message into ONE of these government scheme IDs. "
        f"Valid IDs: {', '.join(scheme_ids)}, or 'none' if unrelated.\n\n"
        f"User message: \"{message}\"\n"
        f"Language hint: {lang}\n\n"
        f"Output ONLY valid JSON: {{\"scheme_id\": \"<id or 'none'>\", \"confidence\": <0.0-1.0>}}"
    )

    providers = [LLM_PRIMARY, LLM_FALLBACK]
    for provider in providers:
        try:
            raw: Optional[str] = None
            if provider == "gemini" and GEMINI_API_KEY:
                url = (
                    f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
                )
                payload = {
                    "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json", "temperature": 0.0},
                }
                with httpx.Client(timeout=8.0) as client:
                    r = client.post(url, json=payload)
                    if r.status_code == 200:
                        raw = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
            elif provider == "groq" and GROQ_API_KEY:
                headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
                payload = {
                    "model": GROQ_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.0,
                    "response_format": {"type": "json_object"},
                }
                with httpx.Client(timeout=8.0) as client:
                    r = client.post("https://api.groq.com/openai/v1/chat/completions",
                                    headers=headers, json=payload)
                    if r.status_code == 200:
                        raw = r.json()["choices"][0]["message"]["content"].strip()

            if raw:
                parsed = json.loads(raw)
                sid = parsed.get("scheme_id", "none")
                if sid in scheme_ids or sid == "none":
                    return sid

        except Exception as exc:  # noqa: BLE001
            logger.warning("LLM scheme classification failed (%s): %s", provider, exc)

    return None