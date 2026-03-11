from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BusinessOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    whatsapp_phone_id: str | None
    business_description: str | None
    faq_knowledge_base: str | None
    response_tone: str

    class Config:
        from_attributes = True


class WhatsAppConfigUpdate(BaseModel):
    whatsapp_phone_id: str
    whatsapp_token: str


class AISettingsUpdate(BaseModel):
    business_description: str | None = None
    faq_knowledge_base: str | None = None
    response_tone: str | None = "professional"


class ChatRequest(BaseModel):
    message: str
    customer_phone: str = "manual-chat"


class ChatResponse(BaseModel):
    reply: str


class MessageOut(BaseModel):
    id: int
    customer_phone: str
    message_text: str
    ai_reply: str | None
    timestamp: datetime

    class Config:
        from_attributes = True


class LeadOut(BaseModel):
    id: int
    customer_phone: str
    customer_name: str | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
