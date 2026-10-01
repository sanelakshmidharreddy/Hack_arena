from typing import Dict, List, Any
import time

class SessionService:
    def __init__(self):
        # In-memory session tracking for hackathon MVP (ephemeral, no persistent DB)
        self._sessions: Dict[str, Dict[str, Any]] = {}

    def get_or_create_session(self, session_id: str, language: str) -> Dict[str, Any]:
        if session_id not in self._sessions:
            self._sessions[session_id] = {
                "session_id": session_id,
                "language": language,
                "history": [],
                "daughter_age": None,
                "is_eligible": None,
                "current_step": 0,
                "last_active": time.time(),
            }
        else:
            self._sessions[session_id]["language"] = language
            self._sessions[session_id]["last_active"] = time.time()
        return self._sessions[session_id]

    def add_turn(self, session_id: str, role: str, content: str):
        if session_id in self._sessions:
            # Only keep the last 6 turns to avoid context bloat and preserve privacy
            self._sessions[session_id]["history"].append({"role": role, "content": content})
            if len(self._sessions[session_id]["history"]) > 6:
                self._sessions[session_id]["history"] = self._sessions[session_id]["history"][-6:]

    def reset_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]

session_service = SessionService()
