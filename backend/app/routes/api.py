from fastapi import APIRouter, HTTPException, Query, Request
from typing import Optional

from app.models.request_models import MessageRequest, ExplainRequest, ResetRequest, TTSRequest
from app.models.response_models import AssistantResponse, ExplainResponse
from app.services.llm_service import llm_service
from app.services.scheme_service import scheme_service
from app.services.session_service import session_service
from app.services.tts_service import tts_service
from app.services.places_service import places_service

router = APIRouter()

@router.post("/message", response_model=AssistantResponse)
def handle_message(req: MessageRequest, request: Request):
    """
    Main conversational endpoint:
    Processes user voice/text input with verified scheme grounding,
    asking ONE question at a time and guiding to next actions.
    Uses Dual LLM pipeline (Gemini primary -> Groq fallback -> deterministic rules).
    """
    session = session_service.get_or_create_session(req.session_id, req.language)
    history = session.get("history", [])

    client_ip = request.client.host if request.client else "127.0.0.1"

    # Process message via LLM Service (with verified scheme grounding)
    response = llm_service.process_message(
        session_id=req.session_id,
        lang=req.language,
        message=req.message,
        history=history,
        client_ip=client_ip
    )

    # Store clean turns in session history
    session_service.add_turn(req.session_id, "user", req.message)
    session_service.add_turn(req.session_id, "assistant", response.reply)

    return response

@router.post("/explain", response_model=ExplainResponse)
def handle_explain(req: ExplainRequest):
    """
    Explain Simply:
    Simplifies complex government explanations for a first-time rural woman
    in the requested language without adding any new facts or hallucinations.
    """
    target_text = req.get_target_text()
    simplified = llm_service.explain_simply(
        text=target_text,
        lang=req.language,
        original_question=req.original_question,
        scheme_id=req.scheme_id
    )
    return ExplainResponse(simplified_text=simplified, source="verified_simplification")

@router.post("/tts")
def handle_tts(req: TTSRequest):
    """
    Text-to-Speech synthesis using Google Cloud TTS with audio caching.
    Returns base64 audio and fallback signal if browser synthesis is preferred.
    """
    result = tts_service.synthesize(
        text=req.text,
        lang=req.language,
        voice_name=req.voice_name,
        gender=req.gender or "FEMALE",
        speed=req.speed or 0.95
    )
    return result

@router.get("/voices")
def get_available_voices(lang: str = Query("te", pattern="^(te|ta|hi|en)$")):
    """
    Returns list of verified Google Cloud TTS voices with native gender labels for the selected language.
    """
    voices = tts_service.get_voice_catalog(lang)
    return {"language": lang, "voices": voices}

@router.get("/contacts")
def get_contacts():
    """
    Returns verified official scheme helplines and customer care contacts.
    """
    contacts = scheme_service.get_contacts()
    return {"status": "ok", "contacts": contacts}

@router.get("/post-offices")
def get_nearby_post_offices(
    lat: Optional[float] = Query(None, description="User latitude"),
    lng: Optional[float] = Query(None, description="User longitude"),
    query: Optional[str] = Query(None, description="PIN code or village name")
):
    """
    Finds nearest Post Office branches using Google Places / OpenStreetMap / Local Directory,
    and returns one-tap Google Maps navigation deep-links.
    """
    results = places_service.search_nearby_post_offices(lat=lat, lng=lng, query=query)
    return {
        "status": "ok",
        "count": len(results),
        "post_offices": results
    }

@router.get("/service")
def get_service_details(lang: str = Query("te", pattern="^(te|ta|hi|en)$")):
    """
    Returns full verified scheme dataset for the selected language.
    """
    scheme = scheme_service.get_primary_scheme()
    docs = scheme_service.get_localized_documents(lang)
    steps = scheme_service.get_localized_steps(lang)
    next_act = scheme_service.get_next_action(lang)

    return {
        "id": scheme.get("id"),
        "name": scheme.get("name_regional", {}).get(lang) or scheme.get("name"),
        "purpose": scheme.get("purpose_regional", {}).get(lang) or scheme.get("purpose"),
        "interest_rate": scheme.get("interest_rate"),
        "minimum_deposit": scheme.get("minimum_deposit"),
        "documents": [d.model_dump() for d in docs],
        "steps": [s.model_dump() for s in steps],
        "next_action": next_act,
        "official_url": scheme.get("official_url"),
        "source": "verified_demo_data"
    }

@router.post("/session")
def create_session(session_id: str = "demo-001", language: str = "te"):
    session = session_service.get_or_create_session(session_id, language)
    return {"session_id": session["session_id"], "language": session["language"], "status": "active"}

@router.post("/reset")
def reset_session_endpoint(req: ResetRequest):
    session_service.reset_session(req.session_id)
    return {"status": "reset_successful", "session_id": req.session_id}
