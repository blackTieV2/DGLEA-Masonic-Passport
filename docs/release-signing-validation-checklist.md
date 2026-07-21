# DGLEA Masonic Passport — Release Signing Validation Checklist

Run this checklist after CI signing is configured and before producing a signed release build for pilot or production use.

## Prerequisites

- DGLEA has approved the use of a real release signing key.
- CI secrets are configured and masked.
- Local development still supports unsigned release builds.

## Validation Checklist

| # | Test | Expected Result | Evidence | Result |
|---|------|-----------------|----------|--------|
| 1 | Verify no keystore tracked | `git ls-files | grep -E '\.(jks|keystore)$'` returns nothing | git output | |
| 2 | Verify `.gitignore` covers `*.jks`, `*.keystore`, `signing.properties` | Entries present in root and `apps/android/.gitignore` | `.gitignore` content | |
| 3 | Verify unsigned `assembleRelease` works without secrets | Build succeeds and produces unsigned APK | Gradle output | |
| 4 | Verify signed build only occurs when all four signing inputs are present | Signing config applied only when path, passwords, and alias are set | Gradle output / APK signature | |
| 5 | Verify signing task fails clearly if partial inputs exist | Build fails with a clear error when only some inputs are set | Gradle error output | |
| 6 | Verify CI logs do not print secrets | No keystore password, key password, or alias appears in logs | CI log review | |
| 7 | Verify APK/AAB signature | `apksigner verify --verbose` or equivalent confirms valid signature | apksigner output | |
| 8 | Verify staging/release build does not enable dev-auth | `ALLOW_DEV_AUTH` is `false` in staging and release builds | BuildConfig check | |
| 9 | Verify output artifact is labelled with commit SHA/build variant | Artifact name includes variant and commit reference | Artifact filename / CI metadata | |
| 10 | Verify release artifact is not distributed before approval | No upload or distribution step runs automatically | CI workflow review | |
| 11 | Capture evidence | CI run link, artifact hash, signature verification output, screenshots | File listing | |

## Pass / Fail Criteria

- **PASS:** All items pass and no secrets are exposed.
- **FAIL:** Any item fails, especially secret leakage or invalid signature.
- **BLOCKED:** CI signing is not yet configured.

## Evidence Index

- Release signing readiness: `docs/release-signing-readiness.md`
- Android signing config: `apps/android/app/build.gradle.kts`
- Android README: `apps/android/README.md`
