---
type: tooling-reference
title: Tool prerequisites
description: Verified local prerequisites for the DGLEA workspace
tags: [tooling, setup]
timestamp: "2026-07-01"
status: canonical
sensitivity: internal
---

# Tool Prerequisites

## Required

| Area | Requirement | Evidence |
|---|---|---|
| Version control | Git | Repository workflow |
| Backend | Node.js 20 or later and npm | `backend/package.json` |
| Database | PostgreSQL 15 through Docker Compose, or a compatible PostgreSQL instance | `backend/docker-compose.yml` |
| Containers | Docker with Compose support | Backend local setup |
| Android | Android Studio, Android SDK, and JDK 17 | `apps/android/README.md` |

## Optional or environment-dependent

- A Firebase project and Admin SDK service-account file are required for real token verification.
- Local backend development can use `DEV_AUTH_USER_ID`; it must never be enabled in production.
- The web-admin portal is currently documentation-only and has no runnable package configuration.

Do not commit local SDK paths, `.env` files, service-account files, keys, or generated build outputs.
