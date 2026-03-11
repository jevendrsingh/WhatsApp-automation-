import httpx

from app.core.config import settings
from app.models.models import Business


SYSTEM_PROMPT = (
    "You are an AI assistant for a business replying to customers on WhatsApp. "
    "Be helpful, professional, and concise. If the customer asks about services or pricing, "
    "respond clearly and ask follow-up questions to capture their name and interest."
)


async def generate_ai_reply(business: Business, incoming_message: str) -> str:
    business_context = (
        f"Business name: {business.name}\n"
        f"Business description: {business.business_description or 'Not provided'}\n"
        f"FAQ knowledge base: {business.faq_knowledge_base or 'Not provided'}\n"
        f"Response tone: {business.response_tone or 'professional'}"
    )

    if not settings.gemini_api_key:
        return (
            "Thanks for reaching out! Our team received your message. "
            "Could you share your name and what you're interested in so we can help quickly?"
        )

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
        f"?key={settings.gemini_api_key}"
    )
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\n\n{business_context}\n\nCustomer message: {incoming_message}"}
                ]
            }
        ]
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(endpoint, json=payload)
        response.raise_for_status()
        data = response.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError):
        return "Thanks for your message! Could you share a few more details so I can assist you better?"
