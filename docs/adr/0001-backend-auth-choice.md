---
type: adr
id: 0001
title: Backend and Authentication Stack
status: accepted
date: 2026-06-29
---

# ADR 0001: Backend and Authentication Stack

## Context

The DGLEA Masonic Passport platform needs a backend that supports:

- A modular monolith architecture that can evolve without rewrite.
- Strong typing and maintainable business logic.
- Relational data integrity for lodges, brothers, mentors, progress, and audit trails.
- Server-side identity verification tied to a trusted identity provider.
- District-wide deployment across approximately 45 lodges with limited operations staff.

## Decision

Use **NestJS 10 + TypeScript (strict) + Prisma + PostgreSQL 15+**, with authentication and identity verification provided by **Firebase Authentication and the Firebase Admin SDK**.

### Selected stack

| Layer | Choice | Rationale |
|---|---|---|
| Runtime / framework | NestJS 10 + TypeScript strict | Mature, modular, testable, large ecosystem, excellent for modular monoliths. |
| ORM / migrations | Prisma | Type-safe queries, declarative schema, migration tooling, excellent PostgreSQL support. |
| Database | PostgreSQL 15+ | Open source, reliable, supports JSON audit metadata, row-level security options, well understood by operations volunteers. |
| Authentication | Firebase Authentication | Managed identity provider with email/password, Google, Apple, and phone sign-in; no custom password storage. |
| Token verification | Firebase Admin SDK | Server-side verification of Firebase ID tokens; falls closed on invalid or missing tokens. |
| API documentation | @nestjs/swagger (OpenAPI) | Auto-generated contract from DTOs and decorators; single source of truth. |
| DTO validation | class-validator + class-transformer | Declarative validation aligned with NestJS conventions. |
| Config validation | @nestjs/config + joi | Fail-fast validation of environment variables at bootstrap. |
| Testing | Jest | Native NestJS support; unit, integration, and e2e tests in one toolchain. |
| Local infrastructure | Docker Compose | PostgreSQL and backend service reproducible on any developer machine. |

## Rejected alternatives

| Alternative | Reason for rejection |
|---|---|
| Spring Boot | Strong option, but the existing team and Android client lean toward TypeScript/Node; slower iteration for the MVP. |
| Custom JWT / password auth | Violates security principle; we do not want to store passwords, manage rotation, or handle credential breaches. |
| Keycloak / self-hosted IAM | Additional operational burden for a district volunteer team; Firebase offloads identity operations. |
| GraphQL API | Adds complexity and client tooling overhead; RESTful endpoints match the mobile-first workflow and are easier to cache and audit. |
| Firebase-only auth / client-side claims | Insufficient for server-side permission enforcement; claims alone cannot express lodge/district scope and assignment logic. |

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Vendor lock-in to Firebase Auth | All user records store a `firebase_uid` reference; migration path is to import identities into another provider and update the reference. Business logic never depends on Firebase-specific structures beyond token verification. |
| Firebase project misconfiguration | Verify ID tokens server-side only; reject unsigned tokens; rotate service account keys through environment secrets, never in code. |
| PostgreSQL operational complexity | Docker Compose for local dev; production deployments target managed Postgres with automated backups. |
| Permission model becomes complex | Encapsulate decisions in `PermissionEvaluator`; unit test positive, negative, and cross-scope cases. |
| Audit trail tampering | `audit_events` is append-only; no update endpoint; metadata stored as JSON. |

## Migration options

- **Identity provider change:** Replace `FirebaseAuthGuard` and the Admin SDK initialization with another verifier that populates the same `Request['currentUser']` shape. No controller or service code changes required.
- **Database change:** Prisma abstracts query generation; switching to another supported relational database is primarily a schema/dialect change.
- **Microservices split:** NestJS modules are already organized by business capability; each module can be extracted behind a shared contract when scale requires it.

## Consequences

- Positive: Strong typing, fast local development, managed identity, server-side enforcement, clear audit trail.
- Negative: Team must learn NestJS/Prisma if unfamiliar; Firebase costs must be monitored at district scale.

## Related documents

- `_config/access-policy.md`
- `shared/knowledge/okf/systems/backend-modules.md`
- `backend/README.md`
