# ADR-0002: Staging Backend URL

- **Status:** Proposed
- **Date:** 2026-07-20
- **Deciders:** DGLEA IT / infrastructure lead, pilot co-ordinator
- **Consulted:** DGLEA stakeholders, project contributors

## Context

The DGLEA Masonic Passport Android app has three build types: `debug`, `staging`, and `release`. The `staging` build type currently points to a placeholder `API_BASE_URL` of `https://REPLACE-WITH-STAGING-BACKEND.invalid/api/v1/`.

A real staging environment is needed to run a controlled technical pilot with synthetic/anonymised data before any production deployment.

## Decision

1. **Use HTTPS for the staging backend URL.** The staging backend must not be exposed over plain HTTP.
2. **Use a dedicated staging hostname.** The proposed format is `https://api-staging.dglea.example.com/api/v1/`. The exact hostname is pending DGLEA approval and DNS provisioning.
3. **Use a separate Firebase project for staging.** This isolates staging authentication, service accounts, and user data from local development and future production.
4. **Do not enable dev-auth fallback in staging.** `ALLOW_DEV_AUTH` must be `false` for staging and release builds.
5. **Use synthetic/anonymised data only.** No real member data may be entered until DGLEA privacy approval is completed.
6. **Update the Android staging build config** from the `.invalid` placeholder to the real staging URL only after the backend is provisioned and validated.

## Consequences

### Positive

- Provides a safe, isolated environment for pilot testing.
- Enables validation of Firebase auth, backend API, and Android app against a real network endpoint.
- Separates staging data and credentials from local development and production.

### Negative / Risks

- Requires DNS, TLS, hosting, and secret management effort.
- If misconfigured, staging could expose test data or allow unauthorised access.
- The exact hostname may need to change based on DGLEA domain policy.

## Alternatives Considered

| Alternative | Rejected because |
|-------------|------------------|
| Use local backend for the pilot | Does not exercise real network, HTTPS, or device connectivity. |
| Use the production Firebase project for staging | Risks mixing test and production user data and credentials. |
| Use a public IP without HTTPS | Insecure; violates the requirement that staging uses HTTPS. |
| Use a generic cloud hostname without DGLEA approval | May violate branding or domain policies; harder to manage. |

## Notes

- The final hostname must be approved by DGLEA before DNS is provisioned.
- The staging backend URL must be added to the Android `staging` build type `API_BASE_URL` in `apps/android/app/build.gradle.kts`.
- Once staging is live, the staging validation checklist in `docs/staging-validation-checklist.md` must be executed.
