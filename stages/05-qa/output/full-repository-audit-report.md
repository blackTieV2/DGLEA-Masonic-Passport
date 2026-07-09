---
type: qa-report
title: Full repository audit
timestamp: "2026-07-01"
status: rejected
sensitivity: internal
scope: full-repository
---

# Full Repository Audit

## Decision

**Rejected for integration, deployment, or user testing with real data.** The product purpose remains sound, but the active implementation is an incomplete backend rewrite paired with an Android client for the retired API. The safest route is not to preserve current implementation choices indiscriminately; retain the domain intent and rebuild coherent vertical slices behind one tested contract.

## Audit Scope

- Active NestJS/Prisma backend, schema, controllers, services, guards, tests, dependencies, and local operations
- Android application, API contract, authentication/session storage, build configuration, and tests
- Web-admin placeholder
- OpenAPI and architecture documentation alignment
- Workspace, Git state, migrations, secrets posture, and deployment readiness
- Archived backend was treated as historical reference, not active code

## Executive Findings

| Severity | Count | Meaning |
|---|---:|---|
| Critical | 6 | Direct data exposure/destruction, unusable core integration, or undeployable database |
| High | 12 | Material authorization, history, workflow, security, test, or operational failure |
| Medium | 9 | Significant completeness, maintainability, privacy, or documentation weakness |

## Critical Findings

### C1 — Activity read endpoints are authenticated IDORs

The three activity list endpoints accept any Brother UUID and perform no authorization check. `listMentorSessions` returns private notes alongside ordinary records. Any authenticated user can enumerate another Brother’s mentor sessions, visitations, and ritual records.

Evidence: `activity.controller.ts` lines 38–74 delegates without the current user; `activity.service.ts` lines 60–65 returns all mentor sessions including `isPrivateNote` records.

Required action: require a scoped read policy on every resource query and implement a separate private-note policy and response model.

### C2 — User lookup exposes arbitrary accounts

`GET /api/users/:id` has no resource authorization and returns role assignments plus the Brother profile. Any authenticated account can retrieve another user by UUID.

Evidence: `users.controller.ts` lines 17–19; `users.service.ts` lines 8–12.

Required action: remove the endpoint until a purpose-specific, field-minimized, scoped user search/read policy exists.

### C3 — Scope enforcement widens access beyond assigned lodges/districts

District roles are treated as global without comparing their `scopeId` to the Brother’s district. A user with multiple Lodge scopes causes `listBrothers` to omit the filter and return every Brother. Expired/future role assignments are loaded as active.

Evidence: `permission-evaluator.service.ts` lines 29–39; `brothers.service.ts` lines 13–35; `firebase-auth.guard.ts` lines 100–136.

Required action: define one authorization context containing active assignments and exact district/lodge ownership, then use deny-by-default query predicates rather than post-query role labels.

### C4 — Any authenticated non-production user can reset the database

`POST /api/dev/seed-reset` checks only that `NODE_ENV` is not `production`. It does not require an admin role or an explicit seed-bypass flag, and executes a destructive shell command synchronously. A staging/test deployment can be wiped by any authenticated user.

Evidence: `dev.controller.ts` lines 18–21; `dev.service.ts` lines 6–14.

Required action: remove the HTTP reset endpoint. Keep reset/seed as an operator-only CLI command with explicit environment and database-host safeguards.

### C5 — Android and backend cannot communicate

Android calls the retired API (`auth/login`, `me`, `members/*`, `passport-records/*`, `verification-queue`) and stores a backend-issued token. The active backend exposes Firebase-authenticated `/api/auth/me`, `/api/brothers/*`, `/api/progress/*`, and `/api/mentor/review-queue`. Android also omits the backend’s `/api` prefix.

Evidence: `BackendApi.kt` lines 9–50; `AuthRepository.kt` lines 12–31; `MainActivity.kt` line 24; `backend/src/main.ts` line 15; active controllers.

Required action: choose the authentication flow and canonical API, generate or validate client DTOs from it, then replace the Android networking/auth layer as one vertical slice.

### C6 — No deployable database migration exists

Only `migration_lock.toml` exists. The backend `.gitignore` explicitly ignores every Prisma `migration.sql`, so `npm run db:deploy` cannot reproduce the schema.

Evidence: `backend/prisma/migrations/migration_lock.toml`; `backend/.gitignore` lines 40–41.

Required action: stop ignoring migrations, create a reviewed baseline migration, test clean database deploy/rollback strategy, and commit it.

## High Findings

### H1 — Workflow permits prohibited state rollback

Draft updates are allowed from `LOCKED` and `SUBMITTED`, converting them to `DRAFT`. This bypasses stage locks and can withdraw an item already awaiting review without a governed transition.

Evidence: `progress.service.ts` lines 14–20 and 56–66.

### H2 — Business mutations and audit events are not atomic

Most services mutate data and then create an audit event in a separate transaction. Audit failure leaves the business mutation committed without its required audit record. Review’s data transaction similarly excludes audit and notification.

Evidence: `reviews.service.ts` lines 110–144; `progress.service.ts` lines 62–76; `activity.service.ts` lines 37–55.

### H3 — Concurrent reviews can both succeed

Review reads `SUBMITTED`, then creates a review and performs an unconditional update. Two reviewers can pass the status check and record contradictory decisions.

Evidence: `reviews.service.ts` lines 54–75 and 110–127.

### H4 — Historical records can be cascade-deleted

Core relations use `onDelete: Cascade`, including Brother profiles to progress, reviews, mentoring activity, and assignments. This conflicts with the requirement to preserve verified and audited history.

Evidence: `schema.prisma` lines 181–205 and 261–296.

### H5 — Read permission is reused as write permission

Visitation and ritual creation call `canViewBrother`; District Mentors, District Admins, and System Admins therefore gain ordinary write access. This contradicts the role model.

Evidence: `activity.service.ts` lines 68–88 and 108–125; `permission-evaluator.service.ts` lines 37–49.

### H6 — Stage transition and sign-off ignore completion rules

Stage transition checks ordering only. It does not require verified mandatory milestones, counts, section sign-off, readiness evidence, or a transition date. Same-stage transitions are allowed. Section sign-off likewise checks no prerequisites.

Evidence: `progression.service.ts` lines 50–77; `activity.service.ts` lines 145–172.

### H7 — System administrators receive ordinary business-data access

System Admin is allowed to browse every Brother and district data, conflicting with the stated technical-only, audited break-glass role.

Evidence: `permission-evaluator.service.ts` lines 25–39; `brothers.service.ts` lines 16–21.

### H8 — Private mentoring notes are not segregated

Privacy is represented by one Boolean on a generally queryable mentor-session table. There is no separate authorization path, projection, encryption policy, retention rule, or district exclusion.

Evidence: `schema.prisma` lines 299–315; `activity.service.ts` lines 60–65.

### H9 — Production dependencies have known high-severity vulnerabilities

`npm audit --omit=dev` reports 20 vulnerabilities: 3 high and 17 moderate, including Lodash injection/prototype pollution and Multer denial-of-service advisories. Fixes require coordinated major upgrades.

### H10 — End-to-end tests do not run from the documented environment

The only E2E suite fails before initialization because `DATABASE_URL` is absent, then its teardown dereferences an undefined app. It tests only public health and unauthenticated `/auth/me`, not RBAC, workflow, audit, or persistence.

Evidence: `backend/test/brothers.e2e-spec.ts` lines 7–29 and audit execution results.

### H11 — Android build is not reproducible through the checked-in wrapper

The wrapper JAR exists, but both launcher scripts ignore it and require a system `gradle` executable. `gradlew.bat test` and `assembleDebug` fail on this machine.

Evidence: `apps/android/gradlew.bat` and `apps/android/gradlew`.

### H12 — Formal OpenAPI, active backend, and Android each describe different products

The formal OpenAPI remains the legacy contract, the Nest-generated API is a smaller incompatible contract, and Android uses the legacy paths. There is no contract-diff or generated-client gate.

Evidence: `docs/03-api/openapi/openapi.yaml`, active controllers, and `BackendApi.kt`.

## Medium Findings

1. Authentication errors return raw Firebase exception messages to clients (`firebase-auth.guard.ts` lines 79–85).
2. No rate limiting, security headers, request-size policy, CORS policy, or production Swagger policy is configured (`main.ts`).
3. `allowBackup="true"` and plaintext SharedPreferences token storage are inappropriate for a sensitive authenticated app (`AndroidManifest.xml` line 5; `SessionStore.kt` lines 13–18).
4. Release minification is disabled and no signing/release configuration is present (`app/build.gradle.kts` lines 20–27).
5. Backend tests cover only 24 unit cases across permission, progress, and review services; most modules have no tests.
6. Web admin is an empty `package.json` plus README, not an implementation.
7. Infrastructure is descriptive only; no staging/production deployment, backup, monitoring, rollback, or secret-manager assets exist.
8. Audit is application-convention “append-only,” not database-enforced; no database permission or trigger prevents updates/deletes.
9. The working tree combines a backend replacement, workspace overlay, documentation changes, and archived code into one very large uncommitted change, making review and rollback difficult.

## What Should Be Retained

- High-level purpose: district-governed mentoring and progression across the four Passport stages
- Explicit human verification and clarification workflow
- No ritual secrets or automatic progression decisions
- Server-owned authorization with lodge/district scopes
- Relational system of record and immutable audit intent
- Android Brother/Mentor experience plus Lodge/District administration
- The domain terminology, Passport template source, permissions matrix, and user journeys after reconciliation

## What Should Not Be Preserved by Default

- Current API paths or DTOs
- Current Nest module/service implementations
- Current Prisma schema or migration approach
- Current Android authentication/network layer
- Firebase as the identity provider if operational fit is not confirmed
- The legacy OpenAPI contract
- The placeholder web-admin scaffold
- Existing module boundaries where they fragment one workflow across many anemic services

## Verification Results

| Check | Result |
|---|---|
| Backend TypeScript type-check | Pass |
| Backend unit tests | Pass: 24/24 |
| Backend build | Pass |
| Prisma validation | Blocked/fail: `DATABASE_URL` absent |
| Backend E2E | Fail during configuration bootstrap |
| Production dependency audit | Fail: 3 high, 17 moderate |
| Android unit tests | Fail to start: wrapper launcher defect/system Gradle absent |
| Android debug assembly | Fail to start: same cause |
| Web-admin build | Not possible: empty package file |
| Deployable schema migration | Fail: none present |

## Recommended Technical Direction

Rebuild around thin, end-to-end capabilities rather than continuing broad scaffolding:

1. Identity/session and exact scoped authorization context
2. Read-only current Brother Passport
3. Draft → submit → clarify/reject/verify workflow with atomic audit
4. Mentor queue with assignment and Lodge scope
5. Stage sign-off/transition policy
6. Lodge and District aggregate reporting
7. Web administration and operational hardening

Each slice must include schema migration, API contract, backend policy tests, Android or web client integration, audit behavior, and E2E tests before the next slice begins.
