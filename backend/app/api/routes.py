from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_business
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.database import get_db
from app.models.models import Business, Lead, Message
from app.schemas.schemas import (
    AISettingsUpdate,
    BusinessOut,
    ChatRequest,
    ChatResponse,
    LeadOut,
    LoginRequest,
    MessageOut,
    RegisterRequest,
    TokenResponse,
    WhatsAppConfigUpdate,
)
from app.services.ai_service import generate_ai_reply
from app.services.whatsapp_service import send_whatsapp_message

router = APIRouter()


@router.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(Business).filter(Business.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    business = Business(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return TokenResponse(access_token=create_access_token(str(business.id)))


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.email == payload.email).first()
    if not business or not verify_password(payload.password, business.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(str(business.id)))


@router.get("/business/me", response_model=BusinessOut)
def get_me(current_business: Business = Depends(get_current_business)):
    return current_business


@router.put("/business/whatsapp-config", response_model=BusinessOut)
def update_whatsapp_config(
    payload: WhatsAppConfigUpdate,
    db: Session = Depends(get_db),
    current_business: Business = Depends(get_current_business),
):
    current_business.whatsapp_phone_id = payload.whatsapp_phone_id
    current_business.whatsapp_token = payload.whatsapp_token
    db.add(current_business)
    db.commit()
    db.refresh(current_business)
    return current_business


@router.put("/business/ai-settings", response_model=BusinessOut)
def update_ai_settings(
    payload: AISettingsUpdate,
    db: Session = Depends(get_db),
    current_business: Business = Depends(get_current_business),
):
    current_business.business_description = payload.business_description
    current_business.faq_knowledge_base = payload.faq_knowledge_base
    current_business.response_tone = payload.response_tone or "professional"
    db.add(current_business)
    db.commit()
    db.refresh(current_business)
    return current_business


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_business: Business = Depends(get_current_business),
):
    ai_reply = await generate_ai_reply(current_business, payload.message)
    db.add(
        Message(
            business_id=current_business.id,
            customer_phone=payload.customer_phone,
            message_text=payload.message,
            ai_reply=ai_reply,
        )
    )
    db.commit()
    return ChatResponse(reply=ai_reply)


@router.get("/messages", response_model=list[MessageOut])
def list_messages(db: Session = Depends(get_db), current_business: Business = Depends(get_current_business)):
    return (
        db.query(Message)
        .filter(Message.business_id == current_business.id)
        .order_by(Message.timestamp.desc())
        .limit(200)
        .all()
    )


@router.get("/leads", response_model=list[LeadOut])
def list_leads(db: Session = Depends(get_db), current_business: Business = Depends(get_current_business)):
    return db.query(Lead).filter(Lead.business_id == current_business.id).order_by(Lead.created_at.desc()).all()


@router.get("/webhook")
def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    if hub_mode == "subscribe" and hub_verify_token == settings.whatsapp_verify_token:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def receive_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            metadata = value.get("metadata", {})
            phone_number_id = metadata.get("phone_number_id")
            business = db.query(Business).filter(Business.whatsapp_phone_id == phone_number_id).first()
            if not business:
                continue

            for message in value.get("messages", []):
                customer_phone = message.get("from")
                message_text = message.get("text", {}).get("body", "")
                if not message_text:
                    continue

                ai_reply = await generate_ai_reply(business, message_text)
                db.add(
                    Message(
                        business_id=business.id,
                        customer_phone=customer_phone,
                        message_text=message_text,
                        ai_reply=ai_reply,
                    )
                )

                existing_lead = (
                    db.query(Lead)
                    .filter(Lead.business_id == business.id, Lead.customer_phone == customer_phone)
                    .first()
                )
                if not existing_lead:
                    db.add(Lead(business_id=business.id, customer_phone=customer_phone, status="new"))

                if business.whatsapp_token:
                    await send_whatsapp_message(
                        phone_number_id=business.whatsapp_phone_id,
                        access_token=business.whatsapp_token,
                        to=customer_phone,
                        message=ai_reply,
                    )
    db.commit()
    return {"status": "ok"}
