---
type: remediation-actions
title: Full repository remediation roadmap
timestamp: "2026-07-01"
status: proposed
sensitivity: internal
---

# Full Repository Remediation Roadmap

## Phase 0 — Contain and establish a baseline

1. Do not deploy or load real personal data.
2. Remove the HTTP database-reset endpoint.
3. Restore a standard Gradle wrapper.
4. Split workspace/archive changes from active implementation changes into reviewable commits.
5. Decide whether the current backend is salvaged or replaced; do not preserve it merely because it exists.

## Phase 1 — Lock one executable contract

1. Select the identity flow based on DGLEA operations, not prior code.
2. Define one OpenAPI contract with `/api` versioning and field-minimized responses.
3. Add automated contract validation and Android client compatibility tests.
4. Retire incompatible legacy DTOs and paths.

## Phase 2 — Rebuild persistence and authorization

1. Create a clean baseline migration and commit all future migrations.
2. Replace cascade deletion of governed history with retention-safe state changes.
3. Model active role assignments and exact district/lodge scope predicates.
4. Separate read, create, review, sign-off, transition, reporting, admin, and break-glass permissions.
5. Store private mentoring notes behind a distinct access boundary.

## Phase 3 — Implement the core vertical slice

1. Current-user and own-Passport read.
2. Draft, submit, clarification, reject, and verify with explicit state transitions.
3. Atomic mutation, decision history, audit event, and outbox notification.
4. Assigned-mentor and same-Lodge negative/positive integration tests.
5. Android Firebase/OIDC login and the matching Passport/review screens.

## Phase 4 — Governance and reporting

1. Section completion calculation and sign-off prerequisites.
2. Controlled stage transitions with immutable history.
3. Lodge dashboards and District aggregates with personal drill-down policy.
4. Role assignment, revocation, export audit, and break-glass workflow.

## Phase 5 — Production readiness

1. Upgrade dependencies and clear high-severity advisories.
2. Add rate limits, headers, request limits, log redaction, and production Swagger policy.
3. Add staging/prod infrastructure, secrets management, backups, restore tests, monitoring, and rollback.
4. Complete Android secure storage, backup rules, release signing, accessibility, and offline policy.
5. Build the web admin only after its workflows and contract stabilize.

## Exit Gate

Do not begin pilot use until all Critical and High defects are closed, clean-checkout builds pass, migrations reproduce a blank environment, and cross-scope security tests pass against a real PostgreSQL instance.
