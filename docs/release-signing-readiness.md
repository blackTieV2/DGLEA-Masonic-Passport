# DGLEA Masonic Passport — Release Signing Readiness

**Status:** Custody plan, CI secret plan, and validation checklist for Android release signing  
**Scope:** Android release APK/AAB signing, keystore custody, CI secret injection, emergency process  
**Date:** 2026-07-20

## Purpose

This document defines the plan for generating, storing, and using a real release signing key for the DGLEA Masonic Passport Android app. It is a **pre-creation** plan only. No real release keystore has been generated, committed, or used by this document.

## Release Keystore Custody Plan

### Ownership

- **Owner:** DGLEA IT / infrastructure lead (name TBD).
- **Custodian:** Technical Owner (name TBD).
- **Approver:** DGLEA Stakeholder Approver (name TBD).

### Storage

- The keystore file (`.jks` or `.keystore`) must be stored **outside the repository**.
- Recommended: secure password manager, hardware security module (HSM), or a managed secret store.
- Local developer copies are allowed only if they are explicitly ignored by `.gitignore` and are not committed.

### Access

- Only the Owner and Custodian may access the keystore.
- Access must be approved by the DGLEA Stakeholder Approver.
- Access should be logged and reviewed periodically.

### Backups

- The keystore must be backed up securely (e.g., encrypted backup in a safe location).
- Backup copies must also be stored outside the repository.
- Recovery from backup must be tested at least once.

### Passwords

- Keystore and key passwords must be stored in a secure password manager or secrets vault.
- Passwords must not be written to files in the repo, printed in logs, or committed.

### Rotation / Key Loss

- If the keystore or password is compromised, rotate credentials immediately.
- Follow the emergency process below.
- DGLEA must decide whether to re-sign with a new key or continue with the existing key (Play Store implications).

### What Must Never Be Committed

- `*.jks`
- `*.keystore`
- `signing.properties`
- Keystore passwords
- Key passwords
- Key aliases (if considered sensitive)
- CI secret values

## Signing by Build Type

| Build type | Signing behaviour | Notes |
|------------|-------------------|-------|
| `debug` | Uses the Android debug keystore automatically | Local development only. |
| `staging` | May use debug signing or a separate staging key | Must not use the production release key. |
| `release` | Unsigned when signing env vars are absent; signed when all four inputs are present | Current implementation in `apps/android/app/build.gradle.kts`. |
| `production` | Uses the real release keystore once approved | **NO-GO** until DGLEA approval. |

## CI Signing Secret Injection Plan

### Existing Gradle Variables

The release signing config in `apps/android/app/build.gradle.kts` reads:

- `DGLEA_ANDROID_KEYSTORE_PATH` / `dglea.android.keystorePath`
- `DGLEA_ANDROID_KEYSTORE_PASSWORD` / `dglea.android.keystorePassword`
- `DGLEA_ANDROID_KEY_ALIAS` / `dglea.android.keyAlias`
- `DGLEA_ANDROID_KEY_PASSWORD` / `dglea.android.keyPassword`

Signing is applied only when all four values are present and non-blank.

### CI Secret Names (Proposed)

Use GitHub Actions secrets (or equivalent):

| GitHub Secret | Maps to Gradle input |
|---------------|----------------------|
| `DGLEA_ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore file; decoded to a temp file in CI |
| `DGLEA_ANDROID_KEYSTORE_PASSWORD` | `DGLEA_ANDROID_KEYSTORE_PASSWORD` |
| `DGLEA_ANDROID_KEY_ALIAS` | `DGLEA_ANDROID_KEY_ALIAS` |
| `DGLEA_ANDROID_KEY_PASSWORD` | `DGLEA_ANDROID_KEY_PASSWORD` |

Alternatively, store the keystore file in a secure artifact repository and download it in CI.

### How CI Obtains Keystore Material

1. Store the keystore as a base64-encoded secret or in a secure file store.
2. In the CI job, decode/download the keystore to a temporary path (e.g., `${{ runner.temp }}/dglea-release.keystore`).
3. Set `DGLEA_ANDROID_KEYSTORE_PATH` to the temporary path.
4. Run `./gradlew :app:assembleRelease`.
5. Delete the temporary file and clear environment variables after the job.

### How Temporary Files Are Created and Removed

- Use `mktemp` or the runner's temp directory.
- Delete files with `rm -f` after the build, even if the build fails.
- Never cache the keystore file between CI runs.

### How Logs Avoid Printing Secrets

- Use `::add-mask::` for passwords in GitHub Actions.
- Do not `echo` or `cat` signing-related variables.
- Do not pass secrets on the command line where they may appear in logs.
- Ensure Gradle output does not print signing configuration.

### How Unsigned Local Release Builds Remain Supported

- Without signing env vars, `./gradlew :app:assembleRelease` produces an unsigned APK.
- This keeps local development and CI validation builds green.
- Unsigned APKs are not suitable for distribution.

### How Signed Release Builds Are Gated / Manual-Only

- Signed release builds should run only on manual workflow dispatch or after explicit approval.
- The CI job should require all four secrets and fail clearly if any are missing.
- Release artifacts should not be uploaded to distribution channels automatically.

## Emergency Process

### Suspected Leaked Keystore or Password

1. Immediately revoke the compromised CI secrets.
2. Rotate keystore and key passwords.
3. Generate a new keystore if the key itself may be compromised.
4. Notify DGLEA Stakeholder Approver and the Pilot Support Owner.
5. Block any pending release distribution.
6. Document the incident and corrective action in the pilot issue log.

### Lost Keystore

1. Attempt to restore from secure backup.
2. If backup is unavailable, generate a new keystore.
3. Update CI secrets with the new keystore material.
4. Notify DGLEA stakeholders; decide whether old signed builds can still be trusted.
5. Document the incident.

### Rotated Signing Credentials

1. Generate new keystore / update passwords.
2. Update CI secrets.
3. Verify a signed build succeeds with the new credentials.
4. Update documentation with the rotation date.
5. Old builds signed with the previous key should be treated as no longer valid for future updates.

### Revoking CI Secrets

- Remove or replace the secret values in GitHub Actions (or the secret store).
- Verify that no CI job logs or artifacts contain the old secret values.

### Blocking Release Distribution

- Do not upload or share release APK/AAB until the incident is resolved.
- Mark the artifact as compromised if it may have been signed with a leaked key.

## Go / No-Go Criteria for Signed Release Builds

Signed release builds may be produced only when all of the following are true:

- DGLEA has approved the use of a real release signing key.
- Keystore custody and access are documented and approved.
- CI secrets are configured and masked.
- Validation checklist in `docs/release-signing-validation-checklist.md` passes.
- Release signing does not enable dev-auth.
- No real member data is included in the build.
- DGLEA Stakeholder Approver has approved distribution.

## Evidence Index

- Android release signing config: `apps/android/app/build.gradle.kts`
- Release signing validation checklist: `docs/release-signing-validation-checklist.md`
- ADR for signing approach: `docs/adr/ADR-0004-android-release-signing.md`
- Production readiness gaps: `docs/production-readiness-gaps.md`
- Pilot readiness: `docs/pilot-readiness.md`
