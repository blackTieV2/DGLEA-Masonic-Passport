---
type: log
title: OKF Knowledge Log
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# OKF Knowledge Log

## 2026-06-29

- Created model-neutral agent workspace overlay.
- Migrated original `AGENTS.md` project truth into `_config/` and `shared/knowledge/okf/` durable knowledge files.
- Archived original `AGENTS.md` at `archive/original-agents.md`.
- Added canonical `AGENTS.md`, `CONTEXT.md`, `README.md`, and `workspace.manifest.yaml`.
- Stored developer handover brief as `stages/01-intake/references/developer-handover-v1.md`.
- Open decisions captured in `stages/00-triage/output/triage-note.md`.

## Next expected updates

- Lock backend framework decision and record it under `systems/`.
- Finalise Passport template seed data under `datasets/`.
- Record API/runtime conventions under `systems/` once chosen.

## 2026-06-29 (later)

- Implemented NestJS 10 + TypeScript strict + Prisma + PostgreSQL backend foundation.
- Recorded backend/auth stack ADR at `docs/adr/0001-backend-auth-choice.md`.
- Added Google Play readiness checklist at `docs/google-play-readiness.md`.
- Created Firebase Authentication guard with server-side token verification and dev bypass.
- Implemented RBAC permission evaluator with positive/negative unit tests.
- Implemented MVP modules: health, auth, users, organisations, roles, brothers, passport, progress, reviews, mentorship, activity, progression, notifications, reporting, audit, dev.
- Added Prisma schema with all required enums, models, indexes, and append-only audit events.
- Added `prisma/seed.ts` with development dataset.
- Added Docker Compose and Dockerfile for local PostgreSQL and backend service.
- TypeScript typecheck passes; 24 unit tests pass.

## 2026-07-01

- Audited the model-neutral workspace in takeover mode and approved preservation of the existing workspace overlay and backend replacement.
- Added verified shared tooling references for prerequisites, connectors, commands, and local environment configuration.
- Clarified that `apps/web-admin` is a placeholder scaffold with no selected framework or runnable package scripts.
- Resolved the takeover repair-map questions without moving, renaming, or deleting files.
- Approved a core rebuild retaining only the product purpose and governed domain rules.
- Began the rebuild with exact active-scope authorization, history-preserving database constraints, a committed baseline migration, atomic progress/review audit transactions, `/api/v1`, and a functional Gradle wrapper.

## 2026-07-02

- Extended the Firebase auth guard to accept `X-Dev-Auth-Firebase-Uid` in non-production so the Android client can select seeded demo identities.
- Replaced the Android client's obsolete login-and-record API wiring with the live `me`, passport, review, and notification endpoints.
- Switched Android session storage to bearer token plus dev Firebase UID state.
- Reworked the Android app UI around connection, passport progress, and mentor review flows backed by the actual backend contract.
- Updated Android unit tests and the Android README to match the new flow.
- Added a backend unit test proving the seeded-demo Firebase UID header wins over any fallback dev auth user.
- Backend typecheck, unit tests, build, and e2e tests all passed after the auth-guard update.
- Installed a real Android SDK in user space at `C:\Users\BlackTie\AppData\Local\Android\Sdk`, updated `apps/android/local.properties`, and verified `./gradlew test` plus `./gradlew assembleDebug`.
