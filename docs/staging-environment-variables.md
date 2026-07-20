# DGLEA Masonic Passport — Staging Environment Variables

This document lists the environment variables and configuration required for a real staging backend. It is based on the current backend configuration (`backend/src/config/app-config.module.ts`) and local `docker-compose.yml`.

## Required Variables

| Variable | Required for staging | Value / guidance | Secret? |
|----------|----------------------|------------------|---------|
| `NODE_ENV` | Yes | `staging` (preferred) or `production` if the config schema is restricted. Document choice. | No |
| `PORT` | Yes | Port the backend listens on (default `3000`); the hosting platform may override. | No |
| `DATABASE_URL` | Yes | PostgreSQL connection string for the staging database. | **Yes** |
| `FIREBASE_PROJECT_ID` | Yes | Project ID of the staging Firebase project (e.g., `dglea-masonic-passport-staging`). | No |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes | Filesystem path to the staging Firebase service account JSON, or injected via a secrets manager as a JSON string. | **Yes** |

## Auth / Development Override Variables

| Variable | Required for staging | Value / guidance | Secret? |
|----------|----------------------|------------------|---------|
| `ALLOW_DEV_AUTH` | Yes | Must be `false`. | No |
| `DEV_AUTH_USER_ID` | No | Must be unset / not used. | No |

## Optional / Platform-Specific Variables

| Variable | Required for staging | Value / guidance | Secret? |
|----------|----------------------|------------------|---------|
| `DATABASE_URL_TEST` | No | Only needed for integration tests in CI; point to a dedicated test database. | **Yes** |
| `SEED_BYPASS_PRODUCTION` | No | Must remain `false` / unset. | No |
| CORS / origin settings | Conditional | Not currently implemented in `backend/src/main.ts`. If a web admin client is added, document allowed origins. | No |
| Log aggregation config | Conditional | Not currently implemented. If external logging is used, document endpoints/keys. | **Yes** |
| PDF/export config | Conditional | No environment-specific PDF config exists; exports are generated on demand. | No |

## Android Staging Build Implications

- `API_BASE_URL` for the `staging` build type in `apps/android/app/build.gradle.kts` must be updated from `REPLACE-WITH-STAGING-BACKEND.invalid/api/v1/` to the real staging URL once provisioned.
- `ALLOW_DEV_AUTH` for staging remains `false`.
- The staging APK must use Firebase Bearer-token authentication; debug/demo fallback is not available.

## Secret Handling Policy

- Staging secrets must live **outside the repository** (e.g., GitHub Actions secrets, hosting platform secrets manager, or a secure vault).
- Never commit `DATABASE_URL`, service account JSON, or API keys to the repo.
- Rotate secrets if they are ever exposed.

## Example Staging Configuration (Non-Committed)

```bash
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgresql://user:password@staging-db.example.com:5432/dglea_passport_staging?schema=public
FIREBASE_PROJECT_ID=dglea-masonic-passport-staging
GOOGLE_APPLICATION_CREDENTIALS=/run/secrets/firebase-staging-service-account.json
ALLOW_DEV_AUTH=false
# DEV_AUTH_USER_ID not set
```

## Evidence

- Backend config module: `backend/src/config/app-config.module.ts`
- Local Docker Compose: `backend/docker-compose.yml`
- Backend env example: `backend/.env.example`
- Android build config: `apps/android/app/build.gradle.kts`
