# XSEAT - Intelligent Train Seat Exchange & Waitlist Prediction

XSEAT is a production-ready monorepo for Indian Railways passengers that predicts ticket confirmation, enables seat exchanges, and delivers smart travel assistance.

## Monorepo Structure
- `backend/` Express.js API, matching engine, Socket.IO chat
- `web/` Next.js passenger and admin experience
- `prediction-service/` FastAPI waitlist prediction microservice
- `docs/` Architecture, API, and deployment notes
- `docker-compose.yml` Multi-service local setup

## Core Features
- Email/password authentication with JWT sessions (OTP available if needed)
- Server-side sessions with secure cookies
- Ticket management and travel history
- OCR-style ticket import with manual correction
- Waitlist confirmation prediction
- Seat exchange requests with match engine prioritization
- Real-time chat after matching
- QR payload generation for TTE verification
- Coach map visualization
- Smart travel assistant insights
- Notifications via Socket.IO (FCM-ready push support)
- Admin analytics view

## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Notifications: Socket.IO + optional FCM
- AI: FastAPI prediction service

## Quick Start
### One-command (no Docker)
1. `npm run dev`
2. Backend runs at `http://localhost:4000`
3. Web runs at `http://localhost:3000`
4. Prediction service runs at `http://localhost:8000`

### Docker (optional)
1. `docker compose up --build`
2. Backend runs at `http://localhost:4000`
3. Web runs at `http://localhost:3000`
4. Prediction service runs at `http://localhost:8000`

## Manual Development
Backend:
- `cd backend`
- `cp .env.example .env`
- `npm install`
- `npm run dev`

Web:
- `cd web`
- `npm install`
- `npm run dev`

Prediction service:
- `cd prediction-service`
- `python3 -m venv .venv && source .venv/bin/activate`
- `pip install -r requirements.txt`
- `uvicorn app.main:app --reload --port 8000`

## Default OTP (Local)
- OTP: `123456` (only in `NODE_ENV=development`)

## Seed Demo Data
- `cd backend`
- `npm run seed:admin`
- `npm run seed:demo`

## API Documentation
See `docs/api.md`.

## Deployment
See `docs/deployment.md`.
