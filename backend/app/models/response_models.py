from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class DocumentItem(BaseModel):
    name: str = Field(..., description="Document name")
    purpose: str = Field(..., description="Why this document is required")

class StepItem(BaseModel):
    step_number: int = Field(..., ge=1)
    instruction: str = Field(..., description="Clear single action")
    detail: str = Field(..., description="Simple explanation of what happens")
    action_text: str = Field(..., description="Text for user acknowledgment button")

class OptionItem(BaseModel):
    label: str = Field(..., description="Button text")
    value: str = Field(..., description="Value transmitted back")

class AssistantResponse(BaseModel):
    reply: str = Field(..., description="Concise conversational answer in regional language")
    intent: str = Field(..., description="Classified user need/intent")
    needs_clarification: bool = Field(default=False)
    question: Optional[str] = Field(default=None, description="One single question at a time")
    question_options: Optional[List[OptionItem]] = Field(default=None)
    eligible: Literal["yes", "no", "unknown"] = Field(default="unknown")
    explanation: str = Field(..., description="Simple factual explanation grounded in verified data")
    documents: List[DocumentItem] = Field(default_factory=list)
    steps: List[StepItem] = Field(default_factory=list)
    next_action: str = Field(..., description="Clear, unambiguous next physical step")
    source: str = Field(default="verified_demo_data")
    confidence: Literal["verified", "unknown"] = Field(default="verified")

class ExplainResponse(BaseModel):
    simplified_text: str = Field(..., description="Extremely simplified explanation without added facts")
    source: str = Field(default="verified_simplification")

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    scheme_loaded: bool = True
