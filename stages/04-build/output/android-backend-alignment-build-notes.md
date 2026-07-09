---
type: build-notes
title: Android and backend alignment rebuild notes
timestamp: "2026-07-02"
status: complete
---

# Build Notes

This pass aligned the Android client to the current `/api/v1` backend surface and added a small dev-auth bridge for local seeded identities.

Backend changes:

- Added non-production support for `X-Dev-Auth-Firebase-Uid` in the Firebase auth guard and added a guard test proving the app-supplied demo UID wins over any fallback dev user.

Android changes:

- Replaced the old login-and-record API contract with the live `me`, passport, progress, review, and notification endpoints.
- Added session storage for bearer tokens and dev Firebase UIDs.
- Reworked the app container to inject session headers into Retrofit requests.
- Replaced the sign-in screen with a connection screen that can target seeded demo identities.
- Rebuilt Brother and Mentor screens around existing passport progress items and review queue items.
- Updated the unit tests to exercise the new backend shapes and headers.
- Updated the Android README to describe the new dev-connect flow.
- Wired the local workspace to a real Android SDK at `C:\Users\BlackTie\AppData\Local\Android\Sdk`.

Validation:

- `backend` typecheck passed.
- `backend` unit tests passed, including the new auth-guard precedence test.
- `backend` build passed.
- `backend` e2e tests passed.
- Android `./gradlew test` passed.
- Android `./gradlew assembleDebug` passed.
