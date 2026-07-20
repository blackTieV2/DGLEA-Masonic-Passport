# DGLEA Masonic Passport — Staging Validation Checklist

Run this checklist after the staging backend is provisioned and the Android staging APK is built. Record the result and evidence for each item.

## Prerequisites

- Staging backend URL is live and uses HTTPS.
- Staging Firebase project is configured.
- Staging secrets are injected securely.
- Staging database is migrated and seeded with synthetic/anonymised data only.
- Android `staging` build type `API_BASE_URL` points to the real staging URL.
- Debug build still points to the local backend.

## Validation Checklist

| # | Test | Expected Result | Evidence | Result |
|---|------|-----------------|----------|--------|
| 1 | Backend health endpoint (`GET /health/live` and `/health/ready`) | Returns HTTP 200 | curl response | |
| 2 | Firebase token authentication works | `Authorization: Bearer <valid Firebase ID token>` authenticates | backend log / response | |
| 3 | `GET /api/v1/me` returns current user | Returns the synthetic test user identity | response body | |
| 4 | `GET /api/v1/me/passport` (or equivalent profile/passport endpoint) returns progress | Returns passport sections and progress | response body | |
| 5 | PDF export endpoint generates a document | PDF/HTML contains test user data and is readable | generated file | |
| 6 | Android staging APK connects to staging URL | App signs in and loads profile from staging | screenshot / device test | |
| 7 | Android debug APK still connects to local backend | App signs in via local backend or debug demo account | screenshot / device test | |
| 8 | Android release APK still uses production placeholder | `API_BASE_URL` remains `.invalid` until approved | build config check | |
| 9 | No dev-auth fallback in staging | `X-Dev-Auth-Firebase-Uid` requests are rejected (401) | curl response | |
| 10 | No dev-auth fallback in release | `X-Dev-Auth-Firebase-Uid` requests are rejected (401) | curl response | |
| 11 | No real member data present | Database contains only synthetic/anonymised records | database query / report | |
| 12 | Rollback / disable test | Staging can be disabled and restored safely | rollback log | |
| 13 | Evidence capture | Screenshots, logs, and responses saved for sign-off | file listing | |

## Pass / Fail Criteria

- **PASS:** All items pass and no real member data is present.
- **FAIL:** Any Critical or High-severity item fails.
- **BLOCKED:** Staging infrastructure is not yet provisioned.

## Evidence Index

- Staging readiness plan: `docs/staging-backend-readiness.md`
- Staging environment variables: `docs/staging-environment-variables.md`
- Pilot test script: `docs/pilot-test-script.md`
- Operational support: `docs/operational-support.md`
