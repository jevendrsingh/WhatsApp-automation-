# WhatsApp Automation AI SaaS (Multi-Tenant)

This repository contains an MVP full-stack SaaS platform that lets multiple businesses connect WhatsApp Business Cloud API and automate conversations using Gemini AI.

## Stack

- **Backend**: FastAPI, SQLAlchemy, JWT auth, SQLite/PostgreSQL-ready
- **AI**: Google Gemini (`gemini-2.0-flash` configurable)
- **Frontend**: Next.js + React + TailwindCSS

## MVP Features

- Business registration/login
- Multi-tenant business profile storage
- WhatsApp Cloud API credential storage per business
- AI auto-reply endpoint
- WhatsApp webhook verification + incoming message handling
- Automatic lead capture and conversation logging
- Dashboard for messages, leads, AI settings, and WhatsApp config

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Environment variables (optional):

- `DATABASE_URL` (default: `sqlite:///./whatsapp_saas.db`)
- `SECRET_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (`gemini-2.0-flash` or `gemini-3-flash`)
- `WHATSAPP_VERIFY_TOKEN`
- `CORS_ORIGINS`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE=http://localhost:8000` for local development.

## Deployment

- Frontend: Vercel
- Backend: Railway/Render
- Database: PostgreSQL

## Core API endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /business/me`
- `PUT /business/whatsapp-config`
- `PUT /business/ai-settings`
- `POST /chat`
- `GET /messages`
- `GET /leads`
- `GET /webhook`
- `POST /webhook`
