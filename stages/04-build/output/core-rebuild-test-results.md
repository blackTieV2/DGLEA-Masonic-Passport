---
type: test-results
title: Core rebuild validation results
timestamp: "2026-07-01"
status: partial-pass
---

# Core Rebuild Validation Results

| Check | Result |
|---|---|
| Backend type-check | Pass |
| Backend unit tests | Pass: 24/24 |
| Backend E2E smoke tests | Pass: 2/2 |
| Backend build | Pass |
| Prisma schema validation | Pass |
| Baseline migration generation | Pass; committed artifact created |
| Android Gradle wrapper | Fixed; Gradle 8.14.3 launches and downloads |
| Android tests/build | Blocked locally because no Android SDK is installed/configured |

The Android client contract remains intentionally unaccepted until its auth and endpoint layer is replaced.
