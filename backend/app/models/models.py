from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    whatsapp_phone_id: Mapped[str | None] = mapped_column(String(120), unique=True, nullable=True)
    whatsapp_token: Mapped[str | None] = mapped_column(String(512), nullable=True)
    business_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    faq_knowledge_base: Mapped[str | None] = mapped_column(Text, nullable=True)
    response_tone: Mapped[str] = mapped_column(String(60), default="professional")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    leads: Mapped[list["Lead"]] = relationship("Lead", back_populates="business", cascade="all, delete-orphan")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="business", cascade="all, delete-orphan")


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), index=True)
    customer_phone: Mapped[str] = mapped_column(String(40), index=True)
    customer_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    business: Mapped[Business] = relationship("Business", back_populates="leads")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), index=True)
    customer_phone: Mapped[str] = mapped_column(String(40), index=True)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    ai_reply: Mapped[str | None] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    business: Mapped[Business] = relationship("Business", back_populates="messages")
