# ADR-0003: Staging Firebase Project

- **Status:** Proposed
- **Date:** 2026-07-20
- **Deciders:** DGLEA IT / infrastructure lead, pilot co-ordinator
- **Consulted:** DGLEA stakeholders, project contributors

## Context

The DGLEA Masonic Passport currently uses a development Firebase project (`dglea-masonic-passport-dev`) for local/debug technical testing. A controlled technical pilot requires a real staging environment with isolated authentication and data.

The backend verifies Firebase ID tokens using the Firebase Admin SDK and a service account. The Android app uses `google-services.json` to connect to the correct Firebase project.

## Decision

1. **Create a separate staging Firebase project** named `dglea-masonic-passport-staging`.
2. **Keep the development Firebase project** for local/debug testing only.
3. **Enable Email/Password authentication** on the staging project; disable other providers unless approved.
4. **Use synthetic test users only** on the staging project. No real member data until DGLEA privacy approval.
5. **Store staging Firebase credentials outside the repository.** `google-services.json` and service account JSON must remain untracked and gitignored.
6. **Use Firebase Bearer-token authentication only** in staging. Do not enable dev-auth fallback.
7. **Defer production Firebase project creation** until separately approved. Production remains NO-GO.

## Consequences

### Positive

- Isolates staging authentication and user data from development and production.
- Allows safe pilot testing with synthetic data.
- Aligns with the requirement that staging secrets live outside the repo.
- Provides a clear rollback path: disable test users or rotate service account.

### Negative / Risks

- Requires DGLEA to provision and administer an additional Firebase project.
- Service account and `google-services.json` must be managed securely by developers/CI.
- If misconfigured, staging could accept tokens from the wrong project or allow dev-auth fallback.

## Alternatives Considered

| Alternative | Rejected because |
|-------------|------------------|
| Use the dev Firebase project for staging | Mixes development and staging users/credentials; harder to secure and audit. |
| Use one Firebase project for staging and production | Mixes pilot and production data; violates separation requirements. |
| Use a custom auth provider instead of Firebase | Adds unnecessary complexity; Firebase Auth is already integrated. |
| Commit `google-services.json` and service account to the repo | Exposes credentials; violates security policy. |

## Notes

- The staging Firebase project ID must be set in the backend via `FIREBASE_PROJECT_ID`.
- The backend service account JSON must be injected via `GOOGLE_APPLICATION_CREDENTIALS` or a secrets manager.
- The Android `google-services.json` must be placed at `apps/android/app/google-services.json` only for staging builds and must not be committed.
- Once the staging Firebase project is created, run the validation checklist in `docs/staging-firebase-validation-checklist.md`.
