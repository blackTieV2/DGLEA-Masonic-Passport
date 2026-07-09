---
type: defects
title: Full repository defect register
timestamp: "2026-07-01"
status: open
sensitivity: internal
---

# Full Repository Defect Register

| ID | Severity | Area | Summary | Release blocker |
|---|---|---|---|---|
| C1 | Critical | Privacy/API | Activity-list IDOR exposes mentoring and private-note data | Yes |
| C2 | Critical | Privacy/API | Arbitrary authenticated user lookup | Yes |
| C3 | Critical | Authorization | District/multi-Lodge/expired-role scope widening | Yes |
| C4 | Critical | Operations | Authenticated non-production database reset endpoint | Yes |
| C5 | Critical | Integration | Android and backend API/auth contracts are incompatible | Yes |
| C6 | Critical | Persistence | No deployable Prisma migration; migrations ignored | Yes |
| H1 | High | Workflow | Locked/submitted progress can revert to draft | Yes |
| H2 | High | Audit | Mutations and required audits are non-atomic | Yes |
| H3 | High | Concurrency | Contradictory concurrent reviews can succeed | Yes |
| H4 | High | Data | Cascade deletion destroys governed history | Yes |
| H5 | High | Authorization | Read access grants write access | Yes |
| H6 | High | Domain | Stage/sign-off prerequisites not enforced | Yes |
| H7 | High | Privacy | System Admin has ordinary business browsing | Yes |
| H8 | High | Privacy | Private notes lack true segregation | Yes |
| H9 | High | Dependencies | Production dependency vulnerabilities | Yes |
| H10 | High | Tests | E2E suite does not bootstrap or cover core risk | Yes |
| H11 | High | Android | Checked-in Gradle wrapper is nonfunctional | Yes |
| H12 | High | Contract | Three incompatible API definitions | Yes |

Medium findings are detailed in the full audit report. No defects were remediated during this read-only audit.
