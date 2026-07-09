---
type: config
title: Project Identity
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Project Identity

## What this project is

The **DGLEA Masonic Passport** is a district-governed mentoring and progression platform for the **District Grand Lodge of the Eastern Archipelago (DGLEA)**, intended for use across approximately **45 lodges**.

It digitises the paper-based Masonic Passport and supporting mentoring workflow.

## Primary users

- **Brother / Mason** — owns and progresses his own passport
- **Personal Mentor** — guides assigned Brothers and reviews progress
- **Lodge Mentor** — oversees mentoring within a Lodge
- **Worshipful Master / Lodge Leadership** — Lodge-level read-only oversight
- **District Mentor** — cross-lodge analytics and mentoring governance
- **District Admin** — reference data, Lodge setup, role assignment
- **System Admin / DevOps** — technical administration
- **Lodge Membership Officer** — Phase 2 enquiry management

## What the platform tracks

- Mentoring progress, dates, visits, rituals performed, reviews, and readiness indicators
- Mentor sessions, visitations, section sign-offs, and stage transitions
- Audit trail of decisions, role changes, exports, and administrative actions

## What the platform must never store

Restricted ritual wording, signs, grips, passwords, ritual scripts, or detailed ritual answers.

Only high-level completion indicators, topics, dates, attendance, reflections, and administrative notes are stored.

## Scope boundaries

| In scope for MVP | Out of scope until authorised |
|---|---|
| Android app, backend, web admin, auth, RBAC, audit | Ritual text repository |
| Brother passport and mentor review workflow | Automatic progression decisions |
| Lodge and District dashboards / reports | Social media / community chat |
| Notifications and basic exports | Payment processing / regalia store |
| Phase 2 enquiry management | Direct Solomon data integration |

## Source-of-truth documents

1. `docs/02-architecture/DGLEA_Masonic_Passport_Permissions_Matrix_v1.md`
2. `docs/02-architecture/DGLEA_Masonic_Passport_Verification_Workflow_State_Diagram_v1.md`
3. `docs/02-architecture/DGLEA_Masonic_Passport_Technical_Architecture_ADR_v1.md`
4. `docs/01-product/DGLEA_Masonic_Passport_SRS_v2_1.md`
5. `docs/01-product/DGLEA_Masonic_Passport_PRD_v2_1.md`

## Current phase

Backend foundation, Android Brother thin slice, API/runtime alignment, and local developer setup hardening.

## Guiding principle

> Clarity, correctness, auditability, and maintainability over speed, cleverness, and speculative complexity.
