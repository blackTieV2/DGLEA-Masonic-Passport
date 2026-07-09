---
type: design-spec
title: DGLEA Passport core rebuild
timestamp: "2026-07-01"
status: approved
sensitivity: internal
---

# DGLEA Passport Core Rebuild

## Outcome

Replace the incompatible and unsafe implementation with one deployable vertical slice that supports a Brother and Mentor through the governed Passport workflow. Preserve the product purpose, not existing code contracts.

## Architecture Decisions

| Area | Decision | Reason |
|---|---|---|
| Backend | NestJS modular monolith | Existing team/repository investment is usable; defects are design defects, not a framework limitation |
| Database | PostgreSQL with committed Prisma migrations | Strong relational integrity and reproducible deployment |
| Authentication | Firebase Authentication; backend verifies ID tokens | Avoid custom password/session handling and align Android with managed identity |
| Authorization | Policy service producing exact database predicates from active role assignments | Prevent global role-label shortcuts and cross-scope leakage |
| API | One versioned REST contract under `/api/v1`; OpenAPI generated and checked | Remove the three competing contracts |
| Android | Kotlin/Compose with Firebase Auth, Retrofit, secure token handling, and canonical DTOs | Native-first product and coherent auth/API integration |
| Web admin | Deferred until the core contract stabilizes | Avoid building a second client on unstable foundations |
| Audit | Business mutation, decision history, audit event, and notification outbox in one DB transaction | Make governed actions atomic |
| Notifications | Transactional outbox first; external delivery later | Reliable without premature queue infrastructure |

## Core Slice

```text
Firebase identity
  -> active scoped authorization context
  -> Brother reads own Passport
  -> Brother edits DRAFT
  -> Brother submits
  -> assigned/Lodge Mentor verifies, rejects, or requests clarification
  -> Brother responds and resubmits
  -> every mutation writes history + audit + outbox atomically
```

## Canonical Roles

`BROTHER`, `PERSONAL_MENTOR`, `LODGE_MENTOR`, `LODGE_REVIEWER`, `LODGE_ADMIN`, `DISTRICT_MENTOR`, `DISTRICT_ADMIN`, `SYSTEM_ADMIN`.

Only active assignments (`active_from <= now` and `active_to is null or > now`) participate. Every non-global assignment must match its resource’s exact Lodge or District. `SYSTEM_ADMIN` has no ordinary member-data access; break-glass is a separate audited flow and is not part of the first slice.

## Core Data Model

- District and Lodge
- User and active/inactive RoleAssignment
- BrotherProfile
- MentorAssignment with preserved history
- PassportTemplate, SectionTemplate, MilestoneTemplate
- ProgressItem with optimistic version and explicit state
- ReviewDecision as append-only history
- AuditEvent as append-only history
- NotificationOutbox

Governed history uses restrictive foreign keys and status/retention fields, not cascade deletion.

## Workflow

| From | Action | To | Actor |
|---|---|---|---|
| `NOT_STARTED` | save draft | `DRAFT` | Brother |
| `DRAFT` | edit | `DRAFT` | Brother |
| `DRAFT` | submit | `SUBMITTED` | Brother |
| `SUBMITTED` | request clarification | `CLARIFICATION_REQUESTED` | Assigned or Lodge Mentor |
| `CLARIFICATION_REQUESTED` | respond | `DRAFT` | Brother |
| `SUBMITTED` | reject | `REJECTED` | Assigned or Lodge Mentor |
| `REJECTED` | revise | `DRAFT` | Brother |
| `SUBMITTED` | verify | `VERIFIED` | Assigned or Lodge Mentor |

Locked and verified items cannot be edited. Negative/clarification decisions require a reason. Conditional updates on version and current state prevent concurrent decisions.

## Initial API

- `GET /api/v1/me`
- `GET /api/v1/me/passport`
- `PATCH /api/v1/progress/{id}/draft`
- `POST /api/v1/progress/{id}/submit`
- `POST /api/v1/progress/{id}/clarification-response`
- `GET /api/v1/mentor/review-queue`
- `POST /api/v1/progress/{id}/reviews`
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`
- `GET /health/live`
- `GET /health/ready`

No arbitrary user or Brother lookup is included in the first slice.

## Security Baseline

- Deny by default; purpose-specific policies for read, edit, submit, review, and notifications
- No HTTP database reset endpoint
- Sanitized authentication errors
- Security headers, CORS allowlist, rate limits, request-size limits, and production Swagger disabled
- No private mentoring notes in the first slice; add later behind a separate policy boundary
- Android backup disabled and auth handled by Firebase SDK rather than plaintext custom tokens
- No real member data until security acceptance passes

## Testing Strategy

- Pure unit tests for state transitions and policy decisions
- PostgreSQL integration tests for active scopes, cross-Lodge denial, atomic audit, and concurrent reviews
- Contract tests comparing OpenAPI and Android routes/models
- Android repository/ViewModel tests using MockWebServer
- Clean database migration and seed test
