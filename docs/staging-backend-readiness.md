# DGLEA Masonic Passport — Staging Backend Readiness

**Status:** Provisioning plan and readiness checklist for a real staging environment  
**Scope:** Backend API, database, Firebase Auth staging project, Android staging build  
**Date:** 2026-07-20

## Purpose

This document defines the plan for provisioning a real staging backend URL and environment. It is a **pre-deployment** plan only. No infrastructure, DNS records, or staging secrets have been created or provisioned by this document.

## Proposed Staging Backend URL

**Placeholder proposal:** `https://api-staging.dglea.example.com/api/v1/`

- The exact hostname is not yet approved or provisioned.
- The URL must use **HTTPS**.
- Once provisioned, the Android `staging` build type will be updated from the current `.invalid` placeholder to the real staging URL.

## Ownership of Staging Environment

- **Owner:** DGLEA IT / infrastructure lead (name TBD).
- **Operational responsibility:** Deployments, monitoring, backups, access control, and secret management.
- **Data responsibility:** DGLEA privacy/data owner (name TBD).

## Hosting / Infrastructure Decision

The hosting platform is **still pending**. Candidates include:

- Docker container on a cloud VM or container service.
- Managed Kubernetes / container platform.
- Managed backend-as-a-service (less likely because the backend is a NestJS app).

A decision is required before the staging URL can be provisioned.

## DNS / TLS Requirements

- DNS A/AAAA/CNAME record for the staging hostname.
- TLS certificate for the staging hostname (e.g., Let's Encrypt, managed certificate, or CA-signed certificate).
- Redirect from HTTP to HTTPS if applicable.

## Firebase Project Relationship

- **Recommended:** Use a **separate Firebase project** for staging (e.g., `dglea-masonic-passport-staging`).
- This isolates staging authentication, service accounts, and user data from local development and any future production project.
- The backend requires the staging project's service account JSON, injected securely outside the repository.

## Backend Environment Variables Required

See `docs/staging-environment-variables.md` for the full inventory. Key variables:

- `NODE_ENV=staging` (or `production` if NODE_ENV only supports development/test/production; document choice).
- `DATABASE_URL` pointing to the staging PostgreSQL instance.
- `FIREBASE_PROJECT_ID` for the staging Firebase project.
- `GOOGLE_APPLICATION_CREDENTIALS` path to the staging service account JSON (or equivalent secret injection).
- `ALLOW_DEV_AUTH=false`
- `DEV_AUTH_USER_ID` unset / not used.
- Optional: CORS/origin settings if the backend is configured for browser access.
- Optional: logging/audit configuration if external log aggregation is used.

## Database / Storage Requirements

- A dedicated staging PostgreSQL database.
- Schema managed by Prisma migrations.
- No real member data until privacy approval is completed.
- Backups configured with a documented retention period.

## Logging / Audit Expectations

- Application logs must capture errors and security-relevant events without secrets.
- Audit events are stored in the `AuditEvent` table; access must be restricted.
- Optional: aggregate logs to a central system for monitoring.

## Backup / Restore Expectations

- Daily backups of the staging database.
- Documented restore procedure tested at least once.
- Retention period agreed with DGLEA (suggested 7–30 days for staging).

## Access Control Expectations

- Only authorised pilot/test accounts may access staging.
- Role and scope permissions must mirror the intended production policy.
- Debug/dev-auth fallback must be disabled (`ALLOW_DEV_AUTH=false`).

## Data Rules

- **Synthetic or anonymised data only** until DGLEA privacy approval is completed.
- No real member names, emails, phone numbers, or lodge membership details.
- Test accounts must be documented and controlled.

## Rollback / Disable Process

1. Stop accepting new sign-ins by disabling Firebase Auth users or blocking at the network level.
2. Redirect the staging URL to a maintenance page or return a `503 Service Unavailable`.
3. Revoke or rotate staging secrets if compromised.
4. Document the incident in the pilot issue log.
5. Re-enable only after root cause is fixed and stakeholders approve.

## Go / No-Go Criteria Before Staging Is Used

Staging may be used for pilot testing only when all of the following are true:

- Hosting platform and DNS/TLS are provisioned.
- Separate staging Firebase project exists and is configured.
- Backend environment variables are set securely.
- Database is migrated and backed up.
- `ALLOW_DEV_AUTH=false`.
- No real member data has been entered.
- Validation checklist in `docs/staging-validation-checklist.md` passes.
- DGLEA stakeholders approve.

## Evidence Index

- Staging environment variables: `docs/staging-environment-variables.md`
- Staging validation checklist: `docs/staging-validation-checklist.md`
- ADR for staging URL: `docs/adr/ADR-0001-staging-backend-url.md`
- Pilot readiness: `docs/pilot-readiness.md`
- Privacy review: `docs/privacy-data-handling-review.md`
- Operational support: `docs/operational-support.md`
- Backend config: `backend/src/config/app-config.module.ts`
- Android environment config: `apps/android/app/build.gradle.kts`
