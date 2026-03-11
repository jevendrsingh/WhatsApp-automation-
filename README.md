# AgentChat AI

A full-stack multi-tenant SaaS platform that lets businesses build Gemini-powered website chatbots with isolated knowledge bases.

## Monorepo structure

```txt
/frontend
  /app
  /components
  /pages
  /styles
  /dashboard
/backend
  /src
    /controllers
    /routes
    /models
    /services
/widget
  chat-widget.js
```

## Core modules delivered

- Landing site with hero/features/how-it-works/pricing CTA
- JWT authentication (sign up, login, reset password endpoint)
- SaaS dashboard with sections: overview, chatbots, knowledge base, conversations, leads, settings, admin
- Chatbot creation wizard (business info, KB, AI behavior, generate)
- Chat widget script for embeddable website integration
- Chat API (`POST /api/chat`) with multi-tenant bot resolution by `agent_id`
- Gemini 1.5 Flash backend integration
- RAG-ready knowledge chunk pipeline (chunk + retrieval query)
- Lead capture trigger based on buying intent keywords
- Security controls: Helmet, CORS allowlist, rate limiting, payload validation with Zod

## Backend setup (Node + Express + PostgreSQL)

```bash
cd backend
npm install
cp .env.example .env # create this file manually from section below
npm run dev
```

### Backend environment variables

```env
PORT=8080
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentchat
JWT_SECRET=replace-with-strong-secret
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-1.5-flash
CORS_ORIGINS=http://localhost:3000
APP_URL=http://localhost:3000
WIDGET_URL=http://localhost:3000/widget/chat-widget.js
```

### Database setup

1. Create PostgreSQL database `agentchat`
2. Run SQL schema:

```bash
psql "$DATABASE_URL" -f backend/sql/schema.sql
```

## Frontend setup (Next.js + Tailwind + TypeScript)

```bash
cd frontend
npm install
NEXT_PUBLIC_API_BASE=http://localhost:8080/api npm run dev
```

## Widget install

Paste into any website:

```html
<script src="https://agentchat.ai/widget.js" data-agent-id="AGENT_ID"></script>
```

Local testing:

```html
<script src="http://localhost:3000/widget/chat-widget.js" data-agent-id="AGENT_ID" data-api="http://localhost:8080/api/chat"></script>
```

## API flow for `POST /api/chat`

1. Validate `agent_id` and message
2. Resolve chatbot tenant by `agent_id`
3. Load relevant knowledge chunks (RAG retrieval)
4. Build contextual prompt with business identity + AI behavior
5. Send prompt to Gemini 1.5 Flash (server-side only)
6. Return AI reply and log conversation/messages

## Production deployment

### Frontend (Vercel)

- Root: `frontend`
- Env: `NEXT_PUBLIC_API_BASE=https://api.agentchat.ai/api`

### Backend (Render / Railway)

- Root: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Provision PostgreSQL and apply `backend/sql/schema.sql`
- Set all backend environment variables

### Vector database options

The starter uses PostgreSQL full-text retrieval and an `embeddings` table.
To scale semantic retrieval, plug in:

- Supabase Vector (`pgvector`) or
- Pinecone

by extending `ragService.ts` for embedding generation + nearest-neighbor search.
