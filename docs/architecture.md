# XSEAT Architecture

## Overview
XSEAT is a modular train seat exchange and waitlist prediction platform built for Indian Railways passengers. The system is split into independent services so each can scale, deploy, and evolve independently.

## Core Services
- Web App (Next.js) for passenger experience and admin visibility
- Backend API (Express.js) for authentication, tickets, exchanges, chat, and notifications
- MongoDB for user, ticket, exchange, match, chat, and notification data
- Matching Engine as a background job inside the backend service
- Prediction Engine (FastAPI) for waitlist confirmation probability
- Notification System using WebSockets (Socket.IO) with optional FCM integrations

## Data Flow
1. User logs in with OTP and receives a JWT
2. Ticket details are saved and used for matching or prediction requests
3. Exchange requests enter the matching engine queue
4. Matching engine scores compatible requests by train, date, seat types, and coach proximity
5. Matches generate notifications, chat rooms, and QR confirmation data
6. Prediction service responds with confirmation probability and status

## Scalability Notes
- Stateless backend with JWT enables horizontal scaling
- Matching job can be offloaded to a queue worker in production
- Prediction service can scale independently via autoscaling
- WebSocket layer supports real-time chat and notifications

## Security
- OTP-based authentication with JWT
- Rate-limited auth endpoints
- Schema validation with Zod
- CORS protection for known frontend origins
