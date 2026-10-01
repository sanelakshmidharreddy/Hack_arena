from typing import Literal
from pydantic import BaseModel, Field, field_validator

AllowedLanguages = Literal["te", "ta", "hi", "en"]
AllowedInputModes = Literal["voice", "text"]

class MessageRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128, description="Unique session identifier")
    language: AllowedLanguages = Field(default="te", description="Selected regional language")
    message: str = Field(..., min_length=1, max_length=1000, description="Natural language user need or answer")
    input_mode: AllowedInputModes = Field(default="text", description="Input method used by user")

    @field_validator("message")
    @classmethod
    def clean_message(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Message cannot be empty or whitespace only")
        return cleaned

class ExplainRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Complex text to simplify")
    language: AllowedLanguages = Field(default="te", description="Target language")

class ResetRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
