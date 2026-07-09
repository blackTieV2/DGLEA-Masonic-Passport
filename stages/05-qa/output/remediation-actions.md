---
type: remediation-actions
title: Workspace repair remediation actions
timestamp: "2026-07-01"
status: complete
---

# Remediation Actions

No further workspace repair is required.

Before committing the backend replacement:

1. Review the deletion/replacement boundary and Prisma migration tracking.
2. Run backend type-check, tests, end-to-end tests, build, migration, and seed validation.
3. Run Android tests and debug assembly against the active API contract.
4. Perform permission, cross-lodge access, audit-event, and secret scans.
5. Split commits into reviewable workspace and implementation scopes where practical.
