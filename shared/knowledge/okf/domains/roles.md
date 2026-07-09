---
type: concept
title: Canonical User Roles
description: Role definitions for the DGLEA Masonic Passport platform
tags: [domain, roles, rbac]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Canonical User Roles

## Core roles

Use these canonical roles unless a document explicitly extends them:

- `BROTHER`
- `PERSONAL_MENTOR`
- `LODGE_MENTOR`
- `LODGE_REVIEWER`
- `LODGE_ADMIN`
- `DISTRICT_MENTOR`
- `DISTRICT_ADMIN`
- `SYSTEM_ADMIN`

## Role descriptions

| Role | Scope | Primary purpose |
|---|---|---|
| `BROTHER` | Own profile and passport | Create drafts, submit progress, view outcomes. |
| `PERSONAL_MENTOR` | Assigned Brothers | Review progress, mentor sessions, request clarification, verify/reject. |
| `LODGE_MENTOR` | Own Lodge | Assign Personal Mentors, review Lodge progress, export Lodge reports. |
| `LODGE_REVIEWER` | Own Lodge | Read-only Lodge oversight and readiness summaries. |
| `LODGE_ADMIN` | Own Lodge | Lodge reference data and local user management. |
| `DISTRICT_MENTOR` | District-wide | Cross-lodge analytics and mentoring governance. |
| `DISTRICT_ADMIN` | District-wide | Reference data, templates, role assignment, audit review. |
| `SYSTEM_ADMIN` | Technical | Infrastructure, break-glass support with audit logging. |

## Notes

- Roles are assigned through `role_assignments` with `scope_type` and `scope_id`.
- A user may hold multiple roles with different scopes.
- Do not casually rename roles once implementation begins.
