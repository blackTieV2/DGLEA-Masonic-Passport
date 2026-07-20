# DGLEA Masonic Passport — Staging Firebase Validation Checklist

Run this checklist after the staging Firebase project is created and the staging backend is configured. Record the result and evidence for each item.

## Prerequisites

- Staging Firebase project exists (e.g., `dglea-masonic-passport-staging`).
- Email/Password auth provider is enabled.
- Synthetic test users are created.
- Staging `google-services.json` is downloaded but **not committed**.
- Staging Firebase service account JSON is stored **outside the repository**.
- Backend staging environment variables are set.

## Validation Checklist

| # | Test | Expected Result | Evidence | Result |
|---|------|-----------------|----------|--------|
| 1 | Create staging Firebase project | Project exists with correct name/ID | Firebase Console screenshot | |
| 2 | Enable correct auth provider | Email/Password enabled; others disabled | Auth providers list | |
| 3 | Create controlled synthetic test users only | Test users use fake/anonymised emails | User list | |
| 4 | Download Android `google-services.json` but keep it untracked | File present at `apps/android/app/google-services.json`; git status shows ignored | `git status` output | |
| 5 | Create backend service account but keep JSON outside repo | JSON stored in secure location; not in git | `git ls-files` output | |
| 6 | Configure backend secret injection outside repo | Backend uses `GOOGLE_APPLICATION_CREDENTIALS` or secret manager | Env var list / secret config | |
| 7 | Verify staging token accepted by backend | Valid staging Firebase ID token authenticates | `GET /me` response | |
| 8 | Verify dev token is not accepted if project mismatch should block it | Dev-project token fails against staging backend | Error response | |
| 9 | Verify Android staging APK signs in against staging Firebase | App signs in and loads profile from staging | Screenshot / device test | |
| 10 | Verify no `X-Dev-Auth-Firebase-Uid` in staging | Header-based dev-auth requests are rejected (401) | curl response | |
| 11 | Verify no real member data | Staging Firebase and backend contain only synthetic data | User list / database query | |
| 12 | Verify rollback/disable by disabling test user or staging backend access | Test user can be disabled; backend access can be blocked | Disable/enable log | |
| 13 | Capture evidence | Screenshots, logs, and responses saved for sign-off | File listing | |

## Pass / Fail Criteria

- **PASS:** All items pass and no real member data is present.
- **FAIL:** Any Critical or High-severity item fails.
- **BLOCKED:** Staging Firebase project is not yet created.

## Evidence Index

- Staging Firebase readiness: `docs/staging-firebase-readiness.md`
- Staging backend readiness: `docs/staging-backend-readiness.md`
- Staging environment variables: `docs/staging-environment-variables.md`
- Pilot test script: `docs/pilot-test-script.md`
