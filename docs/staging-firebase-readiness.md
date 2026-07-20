# DGLEA Masonic Passport — Staging Firebase Readiness

**Status:** Configuration plan and readiness checklist for a staging Firebase project  
**Scope:** Firebase Auth, Android `google-services.json`, backend service account, secret handling, validation  
**Date:** 2026-07-20

## Purpose

This document defines the plan for creating and configuring a staging Firebase project for the DGLEA Masonic Passport controlled technical pilot. It is a **pre-creation** plan only. No Firebase project, service account, or `google-services.json` has been created or committed by this document.

## Proposed Project Naming Convention

- **Staging Firebase project:** `dglea-masonic-passport-staging`
- **Development Firebase project (existing):** `dglea-masonic-passport-dev`
- **Production Firebase project (future):** TBD; remains NO-GO until separately approved.

## Separation from Development

- The **development Firebase project** remains for local/debug technical testing only.
- The **staging Firebase project** is required before real staging validation and pilot testing.
- Users, service accounts, and `google-services.json` files must be kept separate between projects.

## Ownership and Administration

- **Owner:** DGLEA IT / infrastructure lead (name TBD).
- **Administrators:** Technical Owner and DGLEA Stakeholder Approver (names TBD).
- **Access control:** Only authorised pilot co-ordinators may create test users.

## Authentication Providers

- **Enabled provider:** Email/Password (unless DGLEA approves an alternative).
- **Disabled:** Anonymous, phone, and social providers until approved.

## Test-User Policy

- Create **synthetic test users only** (e.g., `brother-ea-staging@example.test`).
- Do **not** create users with real names, emails, or phone numbers.
- Document the list of test users and their assigned roles in the pilot issue log.
- Delete test users at the end of the pilot.

## Data Policy

- **No real member data** may be stored in the staging Firebase project or backend until DGLEA privacy approval is completed.
- Firebase Auth stores only email, password hash, UID, and display name for synthetic users.

## Android Package Expectations

- The Android app package name (`com.dglea.passport`) must be registered in the staging Firebase project.
- The staging `google-services.json` must be downloaded and placed at `apps/android/app/google-services.json` **only for staging builds**.
- The file must remain **gitignored and untracked** (already covered by `apps/android/.gitignore`).
- Debug builds may continue to use the dev project's `google-services.json` locally.

## Backend Service Account Expectations

- A service account must be created in the staging Firebase project.
- The service account JSON must be downloaded and stored **outside the repository** (e.g., secure vault, CI secrets, or a non-committed local path).
- The backend must reference it via `GOOGLE_APPLICATION_CREDENTIALS` or an equivalent secret injection mechanism.
- The staging backend must set `FIREBASE_PROJECT_ID=dglea-masonic-passport-staging`.

## Secret Storage Location

| Secret | Location | Committed? |
|--------|----------|------------|
| Staging `google-services.json` | Local developer machine / CI secret | ❌ No |
| Staging Firebase service account JSON | Secure vault / CI secret / local non-repo path | ❌ No |
| Backend `DATABASE_URL` | Hosting platform secret / CI secret | ❌ No |
| Backend `FIREBASE_PROJECT_ID` | Hosting platform environment variable | ❌ No |

## Access Control Expectations

- Staging backend must not enable dev-auth fallback (`ALLOW_DEV_AUTH=false`).
- Staging must use Firebase Bearer-token authentication only.
- Staging Firebase project must restrict user creation to authorised administrators.

## Audit / Logging Expectations

- Backend logs must record authentication failures without exposing tokens.
- Firebase Auth events are available in the Firebase Console audit log (if enabled).
- Backend audit events (`AuditEvent`) must continue to capture mutating actions.

## Disable / Rollback Procedure

1. Disable the staging Firebase project or specific test users.
2. Rotate the staging service account if compromised.
3. Remove or replace `google-services.json` from any staging build.
4. Update the backend `FIREBASE_PROJECT_ID` to disable the staging project.
5. Document the action in the pilot issue log.

## Policy Statements

- The dev Firebase project remains for local/debug technical testing.
- The staging Firebase project is required before real staging validation.
- Staging must not use dev-auth fallback.
- Staging must use Bearer-token Firebase auth only.
- Staging Firebase config files must remain ignored/untracked.
- Production Firebase remains NO-GO until separately approved.

## Go / No-Go Criteria Before Staging Validation

Staging Firebase validation may proceed only when all of the following are true:

- Staging Firebase project exists and is owned/administered by DGLEA.
- Email/Password auth is enabled; other providers are disabled.
- Synthetic test users are created and documented.
- Staging `google-services.json` is present locally but untracked.
- Staging service account JSON is stored securely outside the repo.
- Backend environment variables point to the staging project.
- `ALLOW_DEV_AUTH=false`.
- No real member data has been entered.
- Validation checklist in `docs/staging-firebase-validation-checklist.md` passes.

## Evidence Index

- Staging backend readiness: `docs/staging-backend-readiness.md`
- Staging environment variables: `docs/staging-environment-variables.md`
- Staging Firebase validation checklist: `docs/staging-firebase-validation-checklist.md`
- ADR for staging Firebase: `docs/adr/ADR-0003-staging-firebase-project.md`
- Backend Firebase admin: `backend/src/common/firebase-admin.ts`
- Android README: `apps/android/README.md`
