---
type: risks-and-constraints
title: DGLEA Passport core rebuild risks and constraints
timestamp: "2026-07-01"
status: approved
---

# Risks and Constraints

| Risk | Treatment |
|---|---|
| Firebase may not fit DGLEA account operations | Keep provider boundary narrow; confirm tenant/project ownership before production |
| Broad rewrite can stall | Deliver one end-to-end Brother/Mentor slice before dashboards or web admin |
| Current uncommitted tree is difficult to review | Preserve it, then create focused diffs and explicit changed-file reports |
| Migration may need legacy data later | Design import separately; do not distort the clean schema before a real legacy dataset exists |
| Audit immutability cannot rely only on application code | Use DB permissions/triggers in production migration and test them |
| Notifications can add infrastructure prematurely | Use transactional outbox; external delivery follows |
| Product source contains ritual-adjacent wording | Seed only approved high-level milestone labels and warnings |

## Constraints

- Modular monolith, PostgreSQL system of record, separate Android/web clients
- No ritual secrets, automatic progression decisions, or client-side authorization
- Preserve verified history and exact Lodge/District boundaries
- Approximately 45 Lodges; correctness matters more than speculative scale

## Approval Required

Approved by the user on 2026-07-01.
