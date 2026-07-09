---
type: project-brief
title: DGLEA Masonic Passport - Active Project Brief
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: active
sensitivity: internal
---

# Active Project Brief

## Goal

Build the complete role-gated DGLEA Masonic Passport product on top of the existing Android proof-of-flow, with a production backend, audit trail, permissions model, and District-level reporting.

## Context

- Existing Android proof-of-flow in `apps/android` has demonstrated sign-in, draft creation, submission, mentor review, rejection, clarification request, resubmission, outcome viewing, sign-out, and account switching.
- Backend skeleton exists in `backend` but needs to be completed to production standard.
- Web admin portal exists as an initial scaffold in `apps/web-admin`.

## Scope

### In scope for MVP / Release 1

- Android app, authentication, role-based dashboards
- Brother passport, mentor review workflow, lodge view, district dashboard
- Admin reference data, backend API, database, audit log
- Basic notifications, exportable reports

### Release 1.1

- Offline-first polish, richer analytics, reminders, evidence attachments
- Mentor assignment workflows, CSV/PDF exports, accessibility, performance

### Phase 2

- Members Pathway enquiry management module

### Out of scope until authorised

- Ritual text repository, automatic progression decisions, social/chat, payments, regalia store, direct Solomon integration, candidate acceptance automation

## Key constraints

- No ritual secrets stored in the platform.
- Role-based, server-side access control.
- Explicit verification workflow with audit trail.
- Modular monolith, no microservices/micro frontends.
- Relational database as primary system of record.

## Success criteria

- Brother can sign in and view his passport.
- Brother can create, submit, and resubmit progress items.
- Mentor can verify, reject, or request clarification.
- Lodge Mentor can manage Lodge progress and mentor assignments.
- District Mentor can view cross-lodge analytics.
- Critical actions create audit events.
- CI tests pass from clean checkout.
