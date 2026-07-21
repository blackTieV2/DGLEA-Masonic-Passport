# ADR-0004: Android Release Signing Approach

- **Status:** Proposed
- **Date:** 2026-07-20
- **Deciders:** DGLEA IT / infrastructure lead, pilot co-ordinator
- **Consulted:** DGLEA stakeholders, project contributors

## Context

The DGLEA Masonic Passport Android app needs a safe way to sign release builds for future production distribution. The current Gradle configuration already supports release signing via environment variables or Gradle project properties, but no real keystore exists and no CI signing process is defined.

Committing keystores or passwords to the repository is not acceptable. Local unsigned release builds must remain possible so developers and CI can validate the build without secrets.

## Decision

1. **Do not commit keystores, passwords, or signing properties.** All signing material stays outside the repository.
2. **Use a dedicated release keystore** once DGLEA approves production signing. Do not reuse the debug keystore.
3. **Inject signing credentials in CI** via GitHub Actions secrets (or equivalent), mapping to the existing Gradle variables:
   - `DGLEA_ANDROID_KEYSTORE_PATH` / `dglea.android.keystorePath`
   - `DGLEA_ANDROID_KEYSTORE_PASSWORD` / `dglea.android.keystorePassword`
   - `DGLEA_ANDROID_KEY_ALIAS` / `dglea.android.keyAlias`
   - `DGLEA_ANDROID_KEY_PASSWORD` / `dglea.android.keyPassword`
4. **Support unsigned release builds** when signing inputs are absent. This keeps local development and CI validation builds working.
5. **Apply signing only when all four inputs are present.** Partial inputs should cause a clear failure.
6. **Gate signed release builds** behind manual workflow dispatch or explicit approval; do not automatically distribute signed artifacts.
7. **Mask secrets in CI logs** and clean up temporary keystore files after each job.

## Consequences

### Positive

- No signing secrets are committed to the repository.
- Local developers can still build unsigned release APKs.
- CI can produce signed artifacts securely when configured.
- Clear separation between debug, staging, release, and production signing.

### Negative / Risks

- Requires DGLEA to generate, store, and manage a real keystore securely.
- CI secret management adds operational overhead.
- If the keystore is lost or compromised, future app updates may be blocked until a new key is established.

## Alternatives Considered

| Alternative | Rejected because |
|-------------|------------------|
| Commit the keystore to the repo | Exposes signing material to anyone with repo access. |
| Use the debug keystore for release | Insecure; debug keys are widely known and not suitable for production. |
| Use only manual signing on a developer machine | Not repeatable; no audit trail; hard to secure. |
| Use Play App Signing only | Play App Signing is not currently enabled; we still need an upload key. |

## Notes

- The current Gradle implementation in `apps/android/app/build.gradle.kts` already supports this approach.
- The validation checklist in `docs/release-signing-validation-checklist.md` must be run before producing a signed release build.
- Production signing remains NO-GO until DGLEA approval.
