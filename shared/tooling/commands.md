---
type: tooling-reference
title: Common commands
description: Verified commands for backend and Android development
tags: [tooling, commands]
timestamp: "2026-07-01"
status: canonical
sensitivity: internal
---

# Common Commands

Run commands from the directory shown.

## Backend (`backend/`)

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Start PostgreSQL | `docker compose up -d postgres` |
| Generate Prisma client | `npm run db:generate` |
| Create/apply development migration | `npm run db:migrate` |
| Apply committed migrations | `npm run db:deploy` |
| Seed development data | `npm run db:seed` |
| Start development API | `npm run dev` |
| Type-check | `npm run typecheck` |
| Run tests | `npm test` |
| Run end-to-end tests | `npm run test:e2e` |
| Build | `npm run build` |

`npm run db:reset` is destructive and is permitted only against an explicitly confirmed development database.

## Android (`apps/android/`)

On Windows use `gradlew.bat`; on macOS/Linux use `./gradlew`.

| Task | Windows command |
|---|---|
| List Gradle tasks | `.\gradlew.bat tasks` |
| Run unit tests | `.\gradlew.bat test` |
| Build debug APK | `.\gradlew.bat assembleDebug` |

## Web admin

No commands are defined. `apps/web-admin/package.json` is empty and the portal remains a placeholder scaffold.
