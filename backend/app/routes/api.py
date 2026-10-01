from fastapi import APIRouter, HTTPException, Query
from app.models.request_models import MessageRequest, ExplainRequest, ResetRequest
from app.models.response_models import AssistantResponse, ExplainResponse
from app.services.gemini_service import gemini_service
from app.services.scheme_service import scheme_service
from app.services.session_service import session_service

router = APIRouter()

@router.post("/message", response_model=AssistantResponse)
def handle_message(req: MessageRequest):
    """
    Main conversational endpoint:
    Processes user voice/text input with verified scheme grounding,
    asking ONE question at a time and guiding to next actions.
    """
    session = session_service.get_or_create_session(req.session_id, req.language)
    history = session.get("history", [])

    # Process message via Gemini Service (with verified scheme grounding)
    response = gemini_service.process_message(
        session_id=req.session_id,
        lang=req.language,
        message=req.message,
        history=history,
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
    without adding any new facts or hallucinations.
    """
    simplified = gemini_service.explain_simply(req.text, req.language)
    return ExplainResponse(simplified_text=simplified, source="verified_simplification")

@router.get("/service")
def get_service_details(lang: str = Query("te", pattern="^(te|ta|hi|en)$")):
    """
    Returns full verified scheme dataset for the selected language.
    """
    scheme = scheme_service.get_primary_scheme()
    docs = scheme_service.get_localized_documents(lang)
    steps = scheme_service.get_localized_steps(lang)
    next_action = scheme_service.get_next_action(lang)

    return {
        "id": scheme.get("id"),
        "name": scheme.get("name_regional", {}).get(lang) or scheme.get("name"),
        "purpose": scheme.get("purpose_regional", {}).get(lang) or scheme.get("purpose"),
        "documents": [d.model_dump() for d in docs],
        "steps": [s.model_dump() for s in steps],
        "next_action": next_action,
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
