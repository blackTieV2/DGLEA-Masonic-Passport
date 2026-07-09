---
type: acceptance-criteria
title: DGLEA Passport core rebuild acceptance criteria
timestamp: "2026-07-01"
status: approved
---

# Acceptance Criteria

- A clean checkout can start PostgreSQL, apply committed migrations, seed development data, and start the API.
- Android builds through the checked-in Gradle wrapper without system Gradle.
- Firebase-authenticated Brother can access only his own Passport.
- Personal Mentor can access/review only actively assigned Brothers.
- Lodge Mentor can access/review only Brothers in explicitly assigned Lodges, including multiple Lodge scopes without widening.
- District and System roles receive no unintended mutation or ordinary personal-data access.
- Expired and future role assignments grant no access.
- Workflow permits only the documented transitions and rejects locked, verified, stale-version, and concurrent mutations.
- Every accepted mutation writes domain state, append-only decision history, audit event, and notification outbox atomically.
- No arbitrary user lookup, activity IDOR, or HTTP database reset endpoint exists.
- Backend unit, integration, E2E, build, type-check, dependency, and migration checks pass.
- Android repository/ViewModel tests and debug assembly pass.
- Android and backend use one `/api/v1` contract.
- No secrets or restricted ritual wording are committed or logged.
