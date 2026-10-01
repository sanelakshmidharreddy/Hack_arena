from typing import Literal, Optional
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

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1500, description="Text to speak")
    language: AllowedLanguages = Field(default="te", description="Target language")
    voice_name: Optional[str] = Field(default=None, description="Specific Google Cloud voice name")
    gender: Optional[str] = Field(default="FEMALE", description="FEMALE or MALE")
    speed: Optional[float] = Field(default=0.95, ge=0.5, le=1.5, description="Speaking rate")
