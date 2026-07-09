# Android app (`apps/android`)

Android client for the DGLEA Masonic Passport backend.

This app is currently wired to the real backend surface under `/api/v1`:

- `GET /me`
- `GET /me/passport`
- `PATCH /progress/{progressId}/draft`
- `POST /progress/{progressId}/submit`
- `POST /progress/{progressId}/clarification-response`
- `GET /mentor/review-queue`
- `POST /progress/{progressId}/review`

## What this app does now

The app is intentionally narrow and role-aware.

Brother flow:

1. Connect with a seeded dev identity or bearer token.
2. Load the current user profile.
3. Load the current passport and progress items.
4. Save a draft note for an existing progress item.
5. Submit a progress item.
6. Respond to clarification requests.

Mentor flow:

1. Connect with a mentor-capable identity.
2. Load the review queue.
3. Verify, reject, or request clarification for submitted items.

## Local development

The app assumes the backend is available on the Android emulator host at:

`http://10.0.2.2:3000/api/v1/`

The screen shown first is a connection screen. Use it to:

- select one of the seeded demo identities
- or paste a bearer token if you are testing against a token-backed backend

The seeded demo identities correspond to the backend seed data:

- `dev-brother-ea`
- `dev-brother-fc`
- `dev-brother-mm`
- `dev-personal-mentor`
- `dev-lodge-mentor`
- `dev-district-mentor`
- `dev-district-admin`

In backend development mode, the app can send `X-Dev-Auth-Firebase-Uid` to load one of those identities directly.

## Prerequisites

- Android Studio
- JDK 17
- Android SDK with API 34 installed

If Gradle complains about the SDK path, set `apps/android/local.properties` or configure the SDK in Android Studio.

## Checks

From `apps/android`:

```bash
./gradlew test
./gradlew assembleDebug
```

## Current status

- Android source is aligned to the current backend routes.
- Local compilation is verified in this environment with the SDK installed at `C:\Users\BlackTie\AppData\Local\Android\Sdk`.
- `./gradlew test` and `./gradlew assembleDebug` both pass from `apps/android`.
- The old login-and-record API contract has been removed from the app sources and tests.
