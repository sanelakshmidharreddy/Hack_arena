import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_explain_simply():
    payload = {
        "text": "భారత ప్రభుత్వం ప్రవేశపెట్టిన సుకున్య సమృద్ధి ఖాతా నిబంధనల ప్రకారం అర్హత పొందవచ్చు.",
        "language": "te"
    }
    response = client.post("/api/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simplified_text" in data
    assert len(data["simplified_text"]) > 0

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
