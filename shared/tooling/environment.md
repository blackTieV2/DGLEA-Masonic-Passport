---
type: tooling-reference
title: Development environment
description: Local environment layout and configuration boundaries
tags: [tooling, environment, security]
timestamp: "2026-07-01"
status: canonical
sensitivity: internal
---

# Development Environment

## Services and ports

| Service | Default address |
|---|---|
| Backend API | `http://localhost:3000` |
| Swagger UI | `http://localhost:3000/api/docs` |
| PostgreSQL | `localhost:5432` |
| Backend from Android emulator | `http://10.0.2.2:3000/` |

## Backend variables

Copy `backend/.env.example` to `backend/.env` locally. The current application declares:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `FIREBASE_PROJECT_ID`
- `DEV_AUTH_USER_ID`
- `SEED_BYPASS_PRODUCTION`

The handover also identifies future variables for OIDC, SMTP, push, queues, object storage, and retention. Do not add them until the associated integration exists.

## Security boundaries

- `.env`, service-account JSON, `secrets/`, private keys, and local Android SDK paths are ignored and must stay uncommitted.
- `DEV_AUTH_USER_ID` and seed bypasses are development-only.
- Development Android builds must not target production by default.
- Never log access tokens, credentials, restricted ritual content, or private mentoring notes.
