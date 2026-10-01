import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.services.grok_service import grok_service

client = TestClient(app)

def test_valid_message():
    """Tests natural language need in Telugu for daughter education"""
    payload = {
        "session_id": "test-session-001",
        "language": "te",
        "message": "నా బిడ్డ చదువు కోసం సహాయం కావాలి",
        "input_mode": "voice"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 0
    assert data["source"] == "verified_demo_data"
    assert data["needs_clarification"] is True
    assert data["question"] is not None

def test_valid_message_english():
    payload = {
        "session_id": "test-session-002",
        "language": "en",
        "message": "I need help for my daughter's education",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Sukanya Samriddhi" in data["reply"]
    assert data["needs_clarification"] is True

def test_invalid_message():
    """Tests invalid language rejection via Pydantic validator"""
    payload = {
        "session_id": "test-session-003",
        "language": "french", # unsupported language
        "message": "Hello",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 422

def test_empty_message():
    """Tests empty/whitespace message rejection"""
    payload = {
        "session_id": "test-session-004",
        "language": "te",
        "message": "   ",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 422

def test_scheme_eligibility():
    """Tests answering age criteria (e.g. 7 years old) -> eligible = 'yes'"""
    payload = {
        "session_id": "test-session-005",
        "language": "te",
        "message": "అవును, నా పాపకు 7 సంవత్సరాలు",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["eligible"] == "yes"
    assert len(data["documents"]) > 0
    assert len(data["steps"]) > 0
    assert "next_action" in data

def test_unknown_service():
    """Tests question outside verified scheme bounds returns safe guidance without hallucinating"""
    payload = {
        "session_id": "test-session-006",
        "language": "te",
        "message": "నేను వ్యవసాయ ట్రాక్టర్ కొనడానికి లోన్ కావాలి",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "verified_demo_data"

def test_missing_information():
    """Tests asking for missing or vague details"""
    payload = {
        "session_id": "test-session-007",
        "language": "en",
        "message": "Can I get assistance?",
        "input_mode": "text"
    }
    response = client.post("/api/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data

def test_grok_failure_and_safe_fallback():
    """Simulates Grok API throwing an unexpected Exception, verifying system gracefully recovers"""
    with patch.object(grok_service, "_call_grok_api", side_effect=Exception("API Quota Exceeded")):
        payload = {
            "session_id": "test-session-008",
            "language": "te",
            "message": "ఏ కాగితాలు కావాలి?",
            "input_mode": "text"
        }
        response = client.post("/api/message", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert len(data["documents"]) > 0
        assert data["source"] == "verified_demo_data"
