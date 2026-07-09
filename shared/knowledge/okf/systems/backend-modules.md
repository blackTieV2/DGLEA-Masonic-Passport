---
type: concept
title: Backend Modules
description: Business-capability modules for the modular monolith backend
tags: [systems, backend, modules]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Backend Modules

The backend must remain organised by **business capability**, not by technical layer.

## Top-level modules

| Module | Responsibility |
|---|---|
| `identity-access` | Users, sessions, authentication, token revocation. |
| `lodge-district-admin` | District, Lodge, and lodge metadata management. |
| `member-profile` | Brother profiles, stage status, promotion history. |
| `passport` | Passport templates, sections, milestones, progress records. |
| `mentor-assignment` | Mentor assignments and reassignment history. |
| `verification-workflow` | Review queue, decisions, clarification workflow. |
| `notifications` | In-app, email, push notifications and templates. |
| `reporting-analytics` | Lodge and District dashboards, exports, snapshots. |
| `audit` | Immutable audit events and audit queries. |
| `configuration` | Feature flags, reference data, templates. |

## Layering rule

Layering inside modules is fine. Business capability must remain the primary structure.

Avoid top-level organisation that is only:

- controllers
- services
- models
- repositories
