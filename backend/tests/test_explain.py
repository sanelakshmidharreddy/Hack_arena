import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.services.llm_service import is_valid_language_script, llm_service
from app.services.scheme_service import scheme_service

client = TestClient(app)

LANG_SCRIPTS = {
    "en": {"sample": "This is a simple, easy to understand explanation for rural mothers.", "bad": "ఇది కేవలం తెలుగులో ఉంది."},
    "te": {"sample": "సులభంగా చెప్పాలంటే: ఇది మీ పాప చదువు కోసం ప్రభుత్వం ఇచ్చే పొదుపు ఖాతా.", "bad": "This is English not Telugu."},
    "hi": {"sample": "सीधे शब्दों में: यह आपकी बेटी की पढ़ाई के लिए डाकघर की सरकारी बचत योजना है।", "bad": "ఇది హిందీ కాదు తెలుగు."},
    "ta": {"sample": "எளிய வார்த்தைகளில்: இது உங்கள் மகளின் கல்விக்காக தபால் அலுவலகத்தில் திறக்கப்படும் அரசு சேமிப்பு கணக்கு.", "bad": "This is English not Tamil."},
}


def test_is_valid_language_script_unit():
    """Unit test the script validator for all 4 languages and negative checks."""
    assert is_valid_language_script("Simple explanation in English", "en") is True
    assert is_valid_language_script("Simple explanation with Telugu తెలుగు", "en") is False

    assert is_valid_language_script("సులభ వివరణ", "te") is True
    assert is_valid_language_script("Simple English text", "te") is False

    assert is_valid_language_script("सरल व्याख्या", "hi") is True
    assert is_valid_language_script("Simple English text", "hi") is False

    assert is_valid_language_script("எளிய விளக்கம்", "ta") is True
    assert is_valid_language_script("Simple English text", "ta") is False

    assert is_valid_language_script("", "en") is False
    assert is_valid_language_script("   ", "te") is False


@pytest.mark.parametrize("lang", ["en", "te", "hi", "ta"])
def test_explain_all_languages_mocked_llm(lang):
    """Assert /api/explain returns valid script text when LLM succeeds in that language."""
    mock_reply = LANG_SCRIPTS[lang]["sample"]

    with patch.object(llm_service, "explain_simply", return_value=mock_reply):
        payload = {
            "previous_answer": "Previous detailed scheme explanation.",
            "language": lang,
            "original_question": "What is this scheme?",
            "scheme_id": "sukanya_samriddhi"
        }
        response = client.post("/api/explain", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "simplified_text" in data
        assert is_valid_language_script(data["simplified_text"], lang) is True


@pytest.mark.parametrize("lang", ["en", "te", "hi", "ta"])
def test_explain_wrong_language_llm_falls_back_to_correct_language(lang):
    """
    When the primary LLM returns text in the wrong script/language,
    assert the script check fails and it falls back to the deterministic localized explanation in the requested language.
    """
    bad_reply = LANG_SCRIPTS[lang]["bad"]

    # Mock primary LLM call to return bad_reply
    with patch("httpx.Client") as mock_client:
        mock_instance = MagicMock()
        mock_response = MagicMock()
        mock_response.status_code = 200
        # For Gemini format
        mock_response.json.return_value = {
            "candidates": [{"content": {"parts": [{"text": bad_reply}]}}],
            "choices": [{"message": {"content": bad_reply}}]
        }
        mock_instance.__enter__.return_value.post.return_value = mock_response
        mock_client.return_value = mock_instance

        # Directly call explain_simply on llm_service with gemini key set to test fallback logic
        original_gemini = llm_service.gemini_key
        original_groq = llm_service.groq_key
        try:
            llm_service.gemini_key = "fake-key"
            llm_service.groq_key = None
            result = llm_service.explain_simply("Previous complex answer", lang)
            # The result MUST be in the requested language, not the bad reply
            assert is_valid_language_script(result, lang) is True
            assert result != bad_reply
        finally:
            llm_service.gemini_key = original_gemini
            llm_service.groq_key = original_groq


@pytest.mark.parametrize("lang", ["en", "te", "hi", "ta"])
def test_deterministic_fallback_scripts(lang):
    """Ensure the verified deterministic fallback has valid script for every supported language."""
    demo = scheme_service.get_deterministic_path("explain_simply", lang)
    assert demo.explanation is not None
    assert len(demo.explanation.strip()) > 10
    assert is_valid_language_script(demo.explanation, lang) is True


def test_explain_invalid_language_rejected():
    """Assert invalid language is rejected with 422."""
    payload = {
        "previous_answer": "Some text",
        "language": "fr"
    }
    response = client.post("/api/explain", json=payload)
    assert response.status_code == 422


def test_explain_missing_language_rejected():
    """Assert missing language is rejected with 422."""
    payload = {
        "previous_answer": "Some text"
    }
    response = client.post("/api/explain", json=payload)
    assert response.status_code == 422


def test_reset_session():
    payload = {
        "session_id": "test-session-reset"
    }
    response = client.post("/api/reset", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "reset_successful"


def test_service_details():
    response = client.get("/api/service?lang=te")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "sukanya_samriddhi_yojana"
    assert len(data["documents"]) > 0
    assert len(data["steps"]) > 0
    assert "official_url" in data

