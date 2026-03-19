# XSEAT API Guide

Base URL: `http://localhost:4000/api`

## Authentication
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/verify-otp`
- `GET /auth/profile`
- `PATCH /auth/profile`
- `POST /auth/logout`

## Tickets
- `POST /ticket/add`
- `GET /ticket/list`
- `POST /ticket/import-ocr` (upload + optional save)
- `PATCH /ticket/:id`
- `DELETE /ticket/:id`
- `POST /ticket/ocr` (optional text parsing)

## Waitlist Prediction
- `GET /prediction/waitlist?trainNumber=...&travelDate=...&currentWaitlist=...`

## Seat Exchange
- `POST /exchange/request`
- `GET /exchange/matches`
- `POST /exchange/confirm`

## Chat
- `GET /chat/:matchId`
- `POST /chat/:matchId`

## Coach Map
- `GET /coach/map?coachNumber=S1&seatNumber=12`

## Notifications
- `GET /notifications`
- `POST /notifications/register`
- `POST /notifications/:id/read`

## Users
- `GET /user/travel-history`

## Assistant
- `GET /assistant/insights`

## Admin
- `GET /admin/analytics`
- `GET /admin/dashboard`
- `GET /admin/users`
- `GET /admin/tickets`
- `GET /admin/exchanges`
- `GET /admin/matches`
- `GET /admin/notifications`
