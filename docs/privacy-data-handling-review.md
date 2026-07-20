# DGLEA Masonic Passport — Privacy and Data Handling Review

**Status:** Draft review package for DGLEA stakeholders  
**Scope:** Android app, NestJS backend, PostgreSQL database, Firebase Auth, generated PDF exports  
**Date:** 2026-07-18

## Executive Summary

This review assesses whether the DGLEA Masonic Passport handles personal data in a manner suitable for a controlled technical pilot and, ultimately, for production use with real member data.

**Go / no-go recommendation:**

- **GO** for a controlled technical pilot using synthetic or anonymised data.
- **NO-GO** for real member personal data until the gaps listed below are resolved and approved by DGLEA stakeholders.
- **NO-GO** for production deployment.

## What Data Is Stored

See `docs/data-inventory.md` for the full inventory. In summary:

- **User identity:** UUID, Firebase UID, display name, email, optional phone and preferred name.
- **Lodge affiliation:** Lodge, district, meeting location, secretary contact.
- **Progress records:** Degree progress, passport milestones, mentor notes, approval notes, submit/approve/reopen metadata.
- **Mentoring records:** Mentor assignments, session notes, visitations, ritual performances, section sign-offs.
- **Operational/security data:** Audit events, role assignments, notifications.
- **Reference data:** Static Masonic reference pages and passport templates.

## Where Data Is Stored

| Storage location | Data held | Controls |
|------------------|-----------|----------|
| Firebase Authentication | Email, password hash, Firebase UID, display name | Managed by Firebase; backend verifies ID tokens. |
| PostgreSQL database (backend) | All backend models listed above | Backend API access only; role/scope checks enforced. |
| Android app memory / session cache | Profile, progress, reference content | Cleared on logout; not intentionally persisted to disk. |
| Generated PDF/HTML export | Brother identity, lodge, degree progress, notes | Generated on demand; file handling is user-controlled via OS share sheet. |
| Audit log table | Actor, action, resource, metadata | Backend-only access; intended for security review. |

## Who Can Access and Edit Data

| Role / actor | Can view | Can edit / approve |
|--------------|----------|--------------------|
| Brother (own record) | Own profile, own progress, own notifications | Draft progress notes, submit items for review. |
| Personal Mentor | Assigned brother’s profile and progress | Add mentor notes, approve/reject assigned items. |
| Lodge Mentor / Reviewer | Lodge members’ profiles and progress | Review/verify/reject progress items. |
| Lodge Admin / WM / Secretary | Lodge-level dashboards and reports | Correct member data, assign roles, override decisions. |
| District Admin / Mentor | District-level aggregates and reports | District configuration, analytics. |
| System Admin | Audit events, system configuration | User/role management, break-glass access (must be audited). |

Access is enforced server-side by the permission evaluator and Firebase Auth guard. The backend auth guard now verifies `Authorization: Bearer` before any dev-auth fallback.

## What Appears in Exported PDFs

The current PDF export (`exports.service.ts`) includes:

- Brother full name, stage, email, phone (if present).
- Lodge name/number, district, meeting location, secretary contact.
- Degree progress table: degree type, status, mentor notes, approved date, approval notes.

Exported files are generated on demand and are not retained by the backend. Once shared or saved by the user, the file is outside the system’s control.

## Current Controls

- Authentication via Firebase Auth with Bearer-token verification.
- Role and scope checks on backend endpoints.
- Audit event capture for mutating actions.
- `onDelete: Restrict` on key relations to prevent accidental data loss.
- Debug/demo fallback is gated to debug builds and `ALLOW_DEV_AUTH=true`.
- Release signing config reads credentials from environment variables or Gradle properties only.

## Current Gaps

| # | Gap | Risk | Suggested mitigation |
|---|-----|------|----------------------|
| 1 | No documented privacy notice or member consent flow. | Members may not understand how their data is used. | Draft and approve a privacy notice; add in-app consent step if required. |
| 2 | No data retention / deletion policy. | Personal data may be kept indefinitely. | Define retention periods for progress records, audit logs, notifications, and inactive accounts. |
| 3 | No automatic right-to-erasure process. | Members cannot request deletion. | Build a documented deletion workflow with DGLEA approval. |
| 4 | No encryption at rest documented. | Database backups or exports could expose personal data. | Document PostgreSQL encryption at rest and backup security. |
| 5 | No local app data encryption beyond OS. | A lost/stolen device could expose cached profile data. | Document Android OS-level protections; consider encrypted local storage if persistence is added. |
| 6 | PDF exports are not watermarked or expiry-dated. | Shared PDFs could be re-shared without context. | Add generation timestamp, Brother/lodge identifier, and a “generated by DGLEA Passport” watermark. |
| 7 | No documented incident response process. | Data breaches or misconfigurations may not be handled consistently. | Define incident response contacts, steps, and notification rules. |
| 8 | Audit log access is not explicitly restricted in documentation. | Sensitive security data could be misused. | Document who can query audit events and under what conditions. |
| 9 | No backup/restore testing documented. | Data loss could occur. | Document backup schedule, restore drill, and offsite storage security. |
| 10 | No third-party / subprocessors list. | DGLEA may not have visibility into Firebase/Google Cloud terms. | List subprocessors (Firebase Auth, Google Cloud, hosting provider) and confirm DGLEA acceptance. |

## Pilot Data Rules

Until DGLEA stakeholders formally approve this review and close the above gaps:

1. **Synthetic or anonymised data only.** Use test accounts such as “Brother EA” with fake contact details.
2. **No real member personal data.** Do not enter real names, emails, phone numbers, or lodge membership details.
3. **No production use.** Pilot builds must be debug or staging; release builds remain unsigned and point to placeholder URLs.
4. **Controlled tester list.** Maintain a named list of pilot participants and devices.
5. **Issue reporting path.** Pilot participants must know how to report data handling concerns or incidents.
6. **Data deletion after pilot.** Plan to reset or delete pilot data before any real data is introduced.

## Production Data Blockers

Real member data must not be processed until all of the following are resolved:

1. Privacy notice drafted, reviewed, and approved by DGLEA.
2. Member consent process defined (if required).
3. Data retention and deletion policy approved.
4. Encryption at rest and in transit documented and verified.
5. Incident response and breach notification process approved.
6. Audit log access controls documented and enforced.
7. Backup/restore procedure tested and documented.
8. Subprocessor list and data-processing terms agreed.
9. Operational support and escalation contacts defined.
10. Staging and production backend environments provisioned with appropriate security controls.

## Evidence Index

- Pilot readiness package: `docs/pilot-readiness.md`, `docs/pilot-test-script.md`, `docs/production-readiness-gaps.md`
- Data inventory: `docs/data-inventory.md`
- Privacy risk register: `docs/privacy-risk-register.md`
- Backend schema: `backend/prisma/schema.prisma`
- PDF export service: `backend/src/modules/exports/exports.service.ts`
- Auth guard: `backend/src/common/guards/firebase-auth.guard.ts`

## Sign-off

This review is a draft. It requires sign-off from DGLEA stakeholders (e.g., Secretary, Data Protection Lead, District representative) before real member data may be used.

| Role | Name | Date | Approved for real member data? |
|------|------|------|--------------------------------|
| Pilot co-ordinator | | | |
| Lodge Secretary / Data Lead | | | |
| District representative | | | |
