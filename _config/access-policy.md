---
type: config
title: Access Policy
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Access Policy

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

Do not casually rename roles once implementation begins.

## Role capabilities

| Role | Access and actions |
| --- | --- |
| Brother / Mason | Own profile and passport only. Can create drafts, submit progress items, update permitted dates if authorised, respond to clarification, view mentor decisions and comments. |
| Personal Mentor | Assigned Brothers only. Can view and review assigned progress, create mentor-session records, request clarification, verify/reject, recommend readiness, and add mentor notes. |
| Lodge Mentor | All Brothers within own Lodge. Can assign Personal Mentors, view Lodge progress, review or countersign as configured, manage Lodge-specific notes, and export Lodge report. |
| Worshipful Master / Lodge Leadership | Own Lodge dashboards. Read progress and readiness summaries. Cannot access other Lodges. Write permissions limited to acknowledgements, not editing Brother evidence. |
| District Mentor | Cross-lodge dashboards and analytics. Can view aggregate and drill into Lodge/Brother records when required for mentoring governance. Cannot modify Brother submissions unless separately assigned. |
| District Admin | Reference data, Lodge setup, user role assignment, access revocation, templates, notification settings, and audit review. No unrestricted ritual-content powers because ritual content is excluded. |
| System Admin / DevOps | Technical administration only. No ordinary business-level browsing of Brother records outside break-glass support with audit logging. |
| Lodge Membership Officer | Phase 2 only. Manage enquirer records and contact logs for own Lodge, subject to privacy deletion rules. |

## Permission matrix

| Permission | Brother | Personal Mentor | Lodge Mentor | District Mentor | Admin |
| --- | --- | --- | --- | --- | --- |
| View own passport | Y | Y if assigned | Lodge summary / detail | District scoped | Audit only |
| Create progress draft | Y | On behalf if configured | N | N | N |
| Submit progress item | Y | Y on behalf if configured | N | N | N |
| Verify / reject / clarify | N | Y assigned | Y Lodge scope | Optional read-only except governance review | N |
| Assign mentor | N | N | Y Lodge scope | Optional oversight | Y |
| Promote degree/stage status | N | Recommend only | Y if authorised by Lodge workflow | Oversight only | Y technical |
| View cross-lodge analytics | N | N | N | Y | Y technical |
| Manage Lodge reference data | N | N | Y own Lodge | Y District templates | Y |
| Manage enquirers | N | N | Phase 2 if LMO | Aggregate / referral only | Y |

## Scope rules

- **Own record** — a Brother may view and edit only his own passport and permitted profile fields.
- **Assigned** — a Personal Mentor may act only for Brothers assigned to them.
- **Lodge** — Lodge Mentor and Lodge leadership may access all Brothers in their own Lodge only.
- **District** — District Mentor and District Admin may view cross-lodge aggregate and drill down only for mentoring governance or administration.
- **Admin** — admins manage reference data, roles, and audit; they do not have unrestricted mentoring authority.

## Audit requirement

All permission decisions, role assignments, revocations, exports, break-glass access, and failed permission checks must be recorded in the immutable audit trail.
