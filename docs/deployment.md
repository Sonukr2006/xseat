# Deployment Notes

## Local Development
1. Start MongoDB and services:
   - `docker compose up --build`
2. Backend:
   - `cd backend`
   - `cp .env.example .env`
   - `npm install`
   - `npm run dev`
3. Web App:
   - `cd web`
   - `npm install`
   - `npm run dev`
4. Prediction Service (standalone):
   - `cd prediction-service`
   - `python3 -m venv .venv && source .venv/bin/activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --port 8000`

## Production
- Use managed MongoDB (Atlas) and configure `MONGODB_URI`
- Store `JWT_SECRET` and SMS credentials in a secret manager
- Replace OTP dev bypass with an SMS provider
- Run backend and prediction service as separate containers
- Configure HTTPS and stricter CORS allowlist
