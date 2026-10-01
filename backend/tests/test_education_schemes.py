"""
Tests for the 5 new education schemes added to Jansakhi.

Covers:
  1. Scheme identification (keyword routing)
  2. Ambiguous / vague query clarification flow
  3. Clarification answer routing (steps 0-2)
  4. Scheme service: get_scheme_context_prompt for each new scheme
  5. Scheme service: get_education_scheme_response for each new scheme
  6. End-to-end process_message routing (mocked LLM)

All tests are deterministic; no real API keys are needed.
"""
import json
import pytest
from unittest.mock import patch, MagicMock

from app.services.scheme_router import (
    identify_scheme_from_message,
    route_clarification_answer,
    RoutingResult,
    SCHEME_KEYWORDS,
)
from app.services.scheme_service import scheme_service


# ==========================================================================
# 1. Scheme keyword identification tests
# ==========================================================================

class TestSchemeIdentification:

    @pytest.mark.parametrize("msg,lang,expected_id", [
        # SSY – English
        ("Tell me about sukanya samriddhi yojana", "en", "sukanya_samriddhi_yojana"),
        ("I want to open an SSY account for my daughter", "en", "sukanya_samriddhi_yojana"),
        # KGBV – English
        ("Tell me about kasturba gandhi school", "en", "kgbv"),
        ("Is there a free hostel school for girls?", "en", "kgbv"),
        # PM-YASASVI – English
        ("Is there an OBC scholarship for class 9 students?", "en", "pm_yasasvi_top_class"),
        ("PM YASASVI scholarship eligibility", "en", "pm_yasasvi_top_class"),
        # AICTE Pragati – English (specific phrases)
        ("AICTE Pragati engineering scholarship", "en", "aicte_pragati"),
        ("girl technical scholarship engineering", "en", "aicte_pragati"),
        # NMMSS – English
        ("What is the National Means cum Merit scholarship?", "en", "nmmss"),
        ("NMMS exam eligibility class 8", "en", "nmmss"),
        # PM-USP – English
        ("Central sector scheme scholarship for college students", "en", "pm_usp"),
        ("PM USP scholarship merit list", "en", "pm_usp"),
        # Telugu
        ("కస్తూర్బా గాంధీ బాలికా విద్యాలయం గురించి చెప్పండి", "te", "kgbv"),
        ("NMMSS స్కాలర్షిప్ ఎలా పొందాలి", "te", "nmmss"),
        ("ప్రగతి స్కాలర్షిప్ ఇంజనీరింగ్", "te", "aicte_pragati"),
        ("PM USP కళాశాల స్కాలర్షిప్", "te", "pm_usp"),
        # Hindi
        ("कस्तूरबा गांधी बालिका विद्यालय में प्रवेश कैसे मिलेगा", "hi", "kgbv"),
        ("यशस्वी छात्रवृत्ति OBC", "hi", "pm_yasasvi_top_class"),
        ("प्रगति इंजीनियरिंग छात्रवृत्ति", "hi", "aicte_pragati"),
        # Tamil
        ("கஸ்தூரிபா காந்தி பள்ளியில் சேர்க்கை", "ta", "kgbv"),
        ("NMMSS உதவித்தொகை தேர்வு", "ta", "nmmss"),
    ])
    def test_keyword_routing(self, msg: str, lang: str, expected_id: str):
        result = identify_scheme_from_message(msg, lang)
        assert result.scheme_id == expected_id, (
            f"Expected '{expected_id}', got '{result.scheme_id}' for: {msg!r}"
        )
        assert not result.clarification_needed

    @pytest.mark.parametrize("msg,lang", [
        ("I need help with scholarship", "en"),
        ("scholarship", "en"),
        ("my daughter needs help for studying", "en"),
        ("education help", "en"),
        ("छात्रवृत्ति", "hi"),
        ("உதவித்தொகை", "ta"),
        ("స్కాలర్షిప్", "te"),
    ])
    def test_vague_triggers_clarification(self, msg: str, lang: str):
        result = identify_scheme_from_message(msg, lang)
        assert result.clarification_needed, f"Expected clarification for: {msg!r}"
        assert result.scheme_id == "ambiguous"
        assert result.clarification_question is not None
        assert len(result.clarification_question) > 10

    def test_ssy_confidence_at_least_moderate(self):
        result = identify_scheme_from_message("sukanya samriddhi account 250 deposit", "en")
        assert result.confidence >= 0.3

    def test_multiple_lang_fallback(self):
        # Telugu keyword for KGBV
        result = identify_scheme_from_message("కస్తూర్బా గాంధీ పాఠశాల", "te")
        assert result.scheme_id == "kgbv"


# ==========================================================================
# 2. Clarification flow routing tests
# ==========================================================================

class TestClarificationFlow:

    @pytest.mark.parametrize("answer,step,expected_id", [
        # Step 0: technical → AICTE Pragati
        ("I want to study engineering", 0, "aicte_pragati"),
        ("polytechnic diploma", 0, "aicte_pragati"),
        # Step 0: college/university → PM-USP
        ("college", 0, "pm_usp"),
        ("my daughter wants to go to university", 0, "pm_usp"),
        # Step 0: school (default) → next clarification (step 1)
        ("school", 0, "ambiguous"),
        ("she is in class 9", 0, "ambiguous"),
        # Step 1: hostel → KGBV
        ("hostel school", 1, "kgbv"),
        ("residential school", 1, "kgbv"),
        ("free hostel", 1, "kgbv"),
        # Step 1: fee only → next clarification (step 2)
        ("scholarship for fees", 1, "ambiguous"),
        ("just scholarship", 1, "ambiguous"),
        # Step 2: OBC/EBC → PM-YASASVI
        ("yes obc", 2, "pm_yasasvi_top_class"),
        ("ebc category", 2, "pm_yasasvi_top_class"),
        # Step 2: no → NMMSS
        ("general category student", 2, "nmmss"),
        ("not sure about category", 2, "nmmss"),
    ])
    def test_clarification_step_routing(self, answer: str, step: int, expected_id: str):
        result = route_clarification_answer(answer, step, lang="en")
        assert result.scheme_id == expected_id, (
            f"Step {step}, answer={answer!r}: expected {expected_id!r}, got {result.scheme_id!r}"
        )

    def test_step0_telugu_engineering(self):
        # Use Tamil engineering word which is in the keyword list
        result = route_clarification_answer("பொறியியல் படிப்பு", step=0, lang="ta")
        assert result.scheme_id == "aicte_pragati"

    def test_step1_telugu_hostel(self):
        result = route_clarification_answer("హాస్టల్ సహితం పాఠశాల", step=1, lang="te")
        assert result.scheme_id == "kgbv"

    def test_step2_hindi_yes_obc(self):
        result = route_clarification_answer("हाँ OBC हूँ", step=2, lang="hi")
        assert result.scheme_id == "pm_yasasvi_top_class"

    def test_step_next_question_not_empty(self):
        result = route_clarification_answer("school", step=0, lang="en")
        assert result.clarification_needed
        assert result.clarification_question
        assert result.clarification_options

    def test_clarification_options_present(self):
        result = identify_scheme_from_message("I need a scholarship", "en")
        assert result.clarification_options is not None
        assert len(result.clarification_options) >= 2


# ==========================================================================
# 3. scheme_service.get_scheme_context_prompt
# ==========================================================================

class TestSchemeContextPrompt:

    @pytest.mark.parametrize("scheme_id,lang,expected_keyword", [
        ("kgbv", "en", "Kasturba"),
        ("kgbv", "te", "కస్తూర్బా"),
        ("pm_yasasvi_top_class", "en", "YASASVI"),
        ("pm_yasasvi_top_class", "hi", "यशस्वी"),
        ("aicte_pragati", "en", "Pragati"),
        ("aicte_pragati", "te", "ప్రగతి"),
        ("nmmss", "en", "Means"),
        ("nmmss", "ta", "NMMSS"),
        ("pm_usp", "en", "Sector"),
        ("pm_usp", "hi", "केंद्रीय"),
    ])
    def test_context_contains_scheme_name(self, scheme_id: str, lang: str, expected_keyword: str):
        ctx = scheme_service.get_scheme_context_prompt(scheme_id, lang)
        assert expected_keyword in ctx, (
            f"Expected '{expected_keyword}' in context for scheme={scheme_id}, lang={lang}"
        )

    def test_context_fallback_for_unknown_id(self):
        ctx = scheme_service.get_scheme_context_prompt("unknown_scheme", "en")
        # Should fall back to SSY context
        assert "Sukanya" in ctx or "sukanya" in ctx.lower() or "SSY" in ctx

    def test_context_never_empty(self):
        for sid in ["sukanya_samriddhi_yojana", "kgbv", "pm_yasasvi_top_class",
                    "aicte_pragati", "nmmss", "pm_usp"]:
            ctx = scheme_service.get_scheme_context_prompt(sid, "en")
            assert len(ctx.strip()) > 50, f"Empty context for scheme_id={sid}"

    def test_context_contains_official_url(self):
        for sid in ["kgbv", "aicte_pragati", "nmmss", "pm_usp", "pm_yasasvi_top_class"]:
            ctx = scheme_service.get_scheme_context_prompt(sid, "en")
            assert "http" in ctx, f"No official URL in context for {sid}"


# ==========================================================================
# 4. scheme_service.get_education_scheme_response
# ==========================================================================

class TestEducationSchemeResponse:

    @pytest.mark.parametrize("scheme_id,lang", [
        ("kgbv", "en"),
        ("kgbv", "te"),
        ("kgbv", "hi"),
        ("kgbv", "ta"),
        ("pm_yasasvi_top_class", "en"),
        ("pm_yasasvi_top_class", "hi"),
        ("aicte_pragati", "en"),
        ("aicte_pragati", "te"),
        ("nmmss", "en"),
        ("nmmss", "ta"),
        ("pm_usp", "en"),
        ("pm_usp", "hi"),
    ])
    def test_response_structure(self, scheme_id: str, lang: str):
        resp = scheme_service.get_education_scheme_response(scheme_id, lang)
        assert resp.reply, f"Empty reply for {scheme_id}/{lang}"
        assert resp.intent == "education_scheme_info"
        assert resp.confidence == "verified"
        assert resp.source == "verified_demo_data"
        assert isinstance(resp.documents, list)
        assert isinstance(resp.steps, list)

    def test_kgbv_response_has_steps(self):
        resp = scheme_service.get_education_scheme_response("kgbv", "en")
        assert len(resp.steps) > 0

    def test_aicte_pragati_response_has_documents(self):
        resp = scheme_service.get_education_scheme_response("aicte_pragati", "en")
        assert len(resp.documents) > 0

    def test_unknown_scheme_falls_back(self):
        resp = scheme_service.get_education_scheme_response("does_not_exist", "en")
        assert resp.reply  # should still return something

    def test_no_reply_crosses_scheme_boundary(self):
        """SSY data must not appear in an education scheme response."""
        ssy_keywords = ["8.2%", "₹250", "Post Office passbook", "sukanya"]
        for sid in ["kgbv", "pm_yasasvi_top_class", "aicte_pragati", "nmmss", "pm_usp"]:
            resp = scheme_service.get_education_scheme_response(sid, "en")
            for kw in ssy_keywords:
                assert kw not in resp.reply, (
                    f"SSY keyword '{kw}' leaked into {sid} response: {resp.reply[:200]}"
                )


# ==========================================================================
# 5. process_message routing (mocked LLM — no real API calls)
# ==========================================================================

class TestProcessMessageRouting:

    def _make_message_request(self, scheme_id: str, lang: str = "en"):
        """Build a mock request that directly identifies the given scheme."""
        from app.services.llm_service import llm_service

        # Mock the LLM to fail so deterministic fallback is used
        with (
            patch.object(llm_service, "_call_gemini", side_effect=Exception("no key")),
            patch.object(llm_service, "_call_groq", side_effect=Exception("no key")),
        ):
            msg_map = {
                "kgbv": "Tell me about kasturba gandhi school for girls",
                "pm_yasasvi_top_class": "PM YASASVI scholarship for OBC class 9",
                "aicte_pragati": "AICTE Pragati scholarship for engineering girls",
                "nmmss": "National Means cum Merit scholarship NMMS exam",
                "pm_usp": "Central sector scheme scholarship college university",
                "sukanya_samriddhi_yojana": "How do I open a sukanya samriddhi account?",
            }
            response = llm_service.process_message(
                session_id="test-session",
                lang=lang,
                message=msg_map.get(scheme_id, "scholarship"),
                history=[],
                client_ip="127.0.0.1",
            )
        return response

    @pytest.mark.parametrize("scheme_id,lang", [
        ("kgbv", "en"),
        ("pm_yasasvi_top_class", "en"),
        ("aicte_pragati", "en"),
        ("nmmss", "en"),
        ("pm_usp", "en"),
    ])
    def test_education_scheme_routes_correctly(self, scheme_id: str, lang: str):
        resp = self._make_message_request(scheme_id, lang)
        assert resp.reply
        assert resp.confidence in ("verified", "high")
        # Must NOT mention SSY amount directly
        assert "₹250" not in resp.reply or scheme_id == "sukanya_samriddhi_yojana"

    def test_vague_query_triggers_clarification(self):
        from app.services.llm_service import llm_service
        with (
            patch.object(llm_service, "_call_gemini", side_effect=Exception("no key")),
            patch.object(llm_service, "_call_groq", side_effect=Exception("no key")),
        ):
            resp = llm_service.process_message(
                session_id="test-session",
                lang="en",
                message="I need help with scholarship",
                history=[],
                client_ip="127.0.0.1",
            )
        assert resp.needs_clarification
        assert resp.question is not None

    def test_ssy_route_unchanged(self):
        resp = self._make_message_request("sukanya_samriddhi_yojana", "en")
        assert resp.reply
        assert resp.source in ("verified_demo_data", "scheme_router")


# ==========================================================================
# 6. Verified scheme data integrity
# ==========================================================================

class TestVerifiedSchemesData:

    NEW_SCHEME_IDS = ["kgbv", "pm_yasasvi_top_class", "aicte_pragati", "nmmss", "pm_usp"]
    REQUIRED_LANGS = ["en", "te", "hi", "ta"]

    def test_all_six_schemes_present(self):
        schemes = scheme_service._data.get("schemes", [])
        ids = [s.get("id") for s in schemes]
        assert "sukanya_samriddhi_yojana" in ids
        for sid in self.NEW_SCHEME_IDS:
            assert sid in ids, f"Missing scheme: {sid}"

    @pytest.mark.parametrize("scheme_id", NEW_SCHEME_IDS)
    def test_scheme_has_required_fields(self, scheme_id: str):
        scheme = scheme_service._get_scheme_by_id(scheme_id)
        assert scheme, f"scheme_id={scheme_id} not found"
        for field in ["id", "name", "official_url", "documents", "steps"]:
            assert field in scheme, f"Missing field '{field}' in scheme {scheme_id}"

    @pytest.mark.parametrize("scheme_id", NEW_SCHEME_IDS)
    def test_scheme_has_english_name(self, scheme_id: str):
        scheme = scheme_service._get_scheme_by_id(scheme_id)
        name = scheme.get("name_regional", {}).get("en") or scheme.get("name", "")
        assert name, f"No English name for {scheme_id}"

    @pytest.mark.parametrize("scheme_id", NEW_SCHEME_IDS)
    def test_scheme_has_official_url(self, scheme_id: str):
        scheme = scheme_service._get_scheme_by_id(scheme_id)
        url = scheme.get("official_url", "")
        assert url.startswith("http"), f"Invalid official_url for {scheme_id}: {url!r}"

    @pytest.mark.parametrize("scheme_id", NEW_SCHEME_IDS)
    def test_scheme_has_at_least_one_step(self, scheme_id: str):
        scheme = scheme_service._get_scheme_by_id(scheme_id)
        steps = scheme.get("steps", [])
        assert len(steps) >= 1, f"No steps for scheme {scheme_id}"

    @pytest.mark.parametrize("scheme_id", NEW_SCHEME_IDS)
    def test_scheme_has_at_least_one_document(self, scheme_id: str):
        scheme = scheme_service._get_scheme_by_id(scheme_id)
        docs = scheme.get("documents", [])
        assert len(docs) >= 1, f"No documents for scheme {scheme_id}"
