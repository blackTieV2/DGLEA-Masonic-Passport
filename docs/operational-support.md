# DGLEA Masonic Passport — Operational Support for the Technical Pilot

**Status:** Draft operating model for the controlled technical pilot  
**Scope:** Android app, NestJS backend, Firebase Auth, staging environment (when provisioned)  
**Date:** 2026-07-20

## Purpose

This document defines how the DGLEA Masonic Passport will be supported during a **controlled technical pilot**. It is designed to prevent escalation of issues, protect member data, and stop the pilot quickly if anything goes wrong.

## Pilot Support Model

| Role | Responsibility | Placeholder / example |
|------|----------------|------------------------|
| **Pilot Support Owner** | First point of contact for all pilot issues. Owns the issue log and daily triage. | [Name TBD] |
| **Technical Owner** | Fixes app/backend defects, manages builds, and advises on technical rollback. | [Name TBD] |
| **Privacy / Data Owner** | Assesses privacy impact, decides whether data must be deleted, and liaises with DGLEA data lead. | [Name TBD] |
| **DGLEA Stakeholder Approver** | Approves start/stop of the pilot and any use of real member data. | [Name / body TBD] |

### Escalation Path

1. Pilot user reports issue to **Pilot Support Owner**.
2. Pilot Support Owner logs it and classifies severity.
3. If technical, escalate to **Technical Owner**.
4. If data/privacy-related, escalate to **Privacy / Data Owner**.
5. Any **Critical** issue (real member data, auth bypass, privacy incident) is escalated immediately to **DGLEA Stakeholder Approver** and the pilot may be stopped.

## Response Categories

| Category | Examples | Owner |
|----------|----------|-------|
| Defect | UI bug, crash, incorrect display, workflow failure | Technical Owner |
| Auth / access | Cannot sign in, wrong user shown, auth bypass | Technical Owner + Privacy/Data Owner |
| Data quality | Wrong progress, wrong lodge, stale data | Technical Owner |
| Privacy / data | Real member data entered, PDF shared, suspected leak | Privacy / Data Owner |
| Environment / config | Staging URL wrong, backend down, build wrong variant | Technical Owner |
| Process | Missing sign-off, unclear instructions | Pilot Support Owner |

## Issue Severity Levels

| Severity | Definition | Response time | Examples |
|----------|------------|---------------|----------|
| **Critical** | Real member data exposed or entered; auth bypass outside debug; privacy incident; staging/release points to wrong backend | Immediate (within 1 hour) | Real email/phone in pilot, PDF shared publicly, dev-auth enabled in release |
| **High** | Blocks most pilot users or corrupts progress data | Within 4 hours | Cannot sign in, backend down, wrong member shown |
| **Medium** | Degraded experience with workaround | Within 24 hours | UI layout issue, occasional crash, slow loading |
| **Low** | Cosmetic or minor documentation issue | Next pilot review | Typos, minor alignment, suggestion |

## Support Hours and Limits

- Support is available **during normal working hours** only; this is not a 24/7 production service.
- The pilot uses **debug/staging builds only**; no release or production support is offered.
- Only **synthetic or anonymised data** is supported. Issues involving real member data are escalated immediately.

## Communication Channel

- Primary channel placeholder: `[Insert DGLEA pilot Slack/Teams/email channel]`
- All **Critical** incidents must also be confirmed by phone or in-person where possible.

## Decision Authority for Stopping the Pilot

The **DGLEA Stakeholder Approver** (or, in their absence, the **Pilot Support Owner** acting with the **Privacy / Data Owner**) has authority to stop the pilot immediately.

## Incident Triage Process

For each incident:

1. **Log** the issue in `docs/pilot-issue-log-template.md` with severity, build variant, and privacy impact.
2. **Contain**: stop further use, revoke access, or block the affected account.
3. **Assess**: determine whether it is a defect, config issue, data issue, or privacy issue.
4. **Escalate**: notify the appropriate owner and DGLEA stakeholder if Critical.
5. **Resolve**: apply fix, rollback, or data remediation.
6. **Document**: update the issue log with root cause, resolution, and lessons learned.

### Specific Triage Scenarios

| Scenario | First response | Escalation |
|----------|----------------|------------|
| Login / authentication failure | Verify backend and Firebase status; check build variant. | Technical Owner |
| Firebase account mismatch | Sign out, clear app data, verify Firebase UID mapping. | Technical Owner + Privacy/Data Owner |
| Profile / passport data incorrect | Check source data; confirm backend query and permissions. | Technical Owner |
| Mentor / admin approval workflow issue | Verify role assignments and scope; reproduce in test environment. | Technical Owner |
| PDF export contains wrong or sensitive information | Stop sharing; recall/delete the file if possible; assess privacy impact. | Privacy / Data Owner + Technical Owner |
| Android crash | Capture crash details; reproduce; check logs. | Technical Owner |
| Backend / API unavailable | Check service health, database, and hosting. | Technical Owner |
| Staging URL misconfiguration | Confirm `BuildConfig.API_BASE_URL` for build type; rebuild/reinstall. | Technical Owner |
| Suspected privacy/data incident | Stop the pilot; preserve evidence; escalate to Privacy/Data Owner and DGLEA approver. | Privacy / Data Owner + DGLEA Approver |
| Accidental use of real member data | Stop the pilot; identify scope; delete/anonymise data if approved; document incident. | Privacy / Data Owner + DGLEA Approver |

## Pilot Issue Log

Use the template in `docs/pilot-issue-log-template.md` to record every issue, no matter how small.

## Evidence and Logs

- Keep screenshots, device logs, backend logs, and issue log entries for the duration of the pilot.
- Do not include passwords, tokens, or real member data in logs or screenshots.

## Evidence Index

- Privacy review: `docs/privacy-data-handling-review.md`
- Data inventory: `docs/data-inventory.md`
- Privacy risk register: `docs/privacy-risk-register.md`
- Pilot readiness: `docs/pilot-readiness.md`
- Pilot test script: `docs/pilot-test-script.md`
- Rollback runbook: `docs/rollback-runbook.md`
- Pilot issue log template: `docs/pilot-issue-log-template.md`
