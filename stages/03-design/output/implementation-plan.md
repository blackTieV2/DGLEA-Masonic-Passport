---
type: implementation-plan
title: DGLEA Passport core rebuild implementation plan
timestamp: "2026-07-01"
status: approved
---

# Implementation Plan

1. Establish the baseline: remove dangerous dev HTTP functionality, restore the standard Gradle wrapper, update dependencies, and isolate the active implementation from archived code.
2. Replace the Prisma schema with retention-safe core entities; commit a baseline PostgreSQL migration and deterministic development seed.
3. Implement active scoped authorization and exhaustive positive/negative/cross-scope tests.
4. Implement the Passport workflow with conditional transitions and transactional audit/outbox.
5. Publish the canonical `/api/v1` OpenAPI document and delete or archive competing active contracts only after approval.
6. Replace Android auth/network/DTO layers with Firebase Auth and the canonical API; implement Brother and Mentor core screens.
7. Add PostgreSQL E2E, migration, contract, Android unit, and debug-build checks.
8. Harden runtime configuration, headers, rate limits, logs, secrets, and deployment documentation.
9. Re-audit all Critical and High findings before expanding to stage transitions, activity logs, dashboards, or web admin.

Changes will be made in reviewable slices. Existing source may be replaced, but archival/history files will not be deleted unless separately approved.
