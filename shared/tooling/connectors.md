---
type: tooling-reference
title: Connectors and external services
description: Verified and planned external dependencies
tags: [tooling, connectors, integrations]
timestamp: "2026-07-01"
status: canonical
sensitivity: internal
---

# Connectors and External Services

| Connector | Current role | Configuration | Status |
|---|---|---|---|
| PostgreSQL | Primary relational system of record | `DATABASE_URL` | Implemented locally |
| Firebase Authentication | Backend verification of Firebase ID tokens | `GOOGLE_APPLICATION_CREDENTIALS`, `FIREBASE_PROJECT_ID` | Implemented; project credentials supplied externally |
| Android emulator host bridge | Access local API from emulator | `http://10.0.2.2:3000/` | Documented |
| SMTP/email | Notification delivery | Not present in current `.env.example` | Planned |
| Android push | Push notification delivery | Not present in current `.env.example` | Planned |
| Object storage | Optional evidence attachments | Not present in current `.env.example` | Deferred |
| Solomon | Link-out only unless formally authorised | None | No direct integration |

Secrets and credentials must remain outside Git. Record only placeholders and setup instructions in the repository.
