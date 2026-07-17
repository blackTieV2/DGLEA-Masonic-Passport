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

## Environment and backend URLs

The backend base URL is selected at build time via `BuildConfig.API_BASE_URL`:

| Build type | Default `API_BASE_URL` | `ALLOW_DEV_AUTH` | Purpose |
|------------|------------------------|------------------|---------|
| `debug`    | `http://10.0.2.2:3000/api/v1/` | `true`  | Local emulator → Docker backend on the host |
| `staging`  | `https://REPLACE-WITH-STAGING-BACKEND.invalid/api/v1/` | `false` | Internal/pilot testing against a real staging backend |
| `release`  | `https://REPLACE-WITH-PRODUCTION-BACKEND.invalid/api/v1/` | `false` | Production release |

- Debug is the only build type that permits the local demo-identity fallback (`X-Dev-Auth-Firebase-Uid`).
- Staging and release require real Firebase Bearer-token authentication.
- Placeholder URLs use the `.invalid` TLD so they cannot accidentally resolve to a real host.
- Before distributing a staging build, replace `REPLACE-WITH-STAGING-BACKEND.invalid` with the provisioned staging host in `app/build.gradle.kts`.
- Before distributing a release build, replace `REPLACE-WITH-PRODUCTION-BACKEND.invalid` with the approved production host and configure a release signing key.

No backend URLs or credentials are committed in this repository.

## Local development

The app assumes the backend is available on the Android emulator host at:

`http://10.0.2.2:3000/api/v1/`

Start the Docker backend from the project root (see `backend/docker-compose.yml`) and then run:

```bash
cd apps/android
./gradlew :app:assembleDebug
./gradlew :app:installDebug
```

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

In backend development mode, the app can send `X-Dev-Auth-Firebase-Uid` to load one of those identities directly. This is controlled by `BuildConfig.ALLOW_DEV_AUTH` and is enabled only in debug builds.

## Firebase setup (scaffolding only)

The Firebase Auth SDK and Google Services Gradle plugin are wired into the
build, but **no sign-in behaviour is active yet** — the demo identity selector
above remains the only auth path. Email/password sign-in arrives in slice 16B.

The Google Services plugin is applied only when the Firebase config file is
present:

- place your project file at `apps/android/app/google-services.json`
- the file is gitignored and must never be committed
- supply it locally from the Firebase console, and later via a CI secret

Without the file, debug builds compile and run exactly as before (Firebase is
simply not initialised, and nothing calls it yet).

## Prerequisites

- Android Studio
- JDK 17
- Android SDK with API 34 installed

If Gradle complains about the SDK path, set `apps/android/local.properties` or configure the SDK in Android Studio.


## Release signing

Release APK signing is configured to read credentials from environment variables or Gradle project properties. **No keystore, password, alias, or signing secret is committed to this repository.**

Supported inputs (all four must be provided to sign a release build):

| Environment variable | Gradle project property | Purpose |
|----------------------|-------------------------|---------|
| `DGLEA_ANDROID_KEYSTORE_PATH` | `dglea.android.keystorePath` | Absolute or relative path to the keystore file |
| `DGLEA_ANDROID_KEYSTORE_PASSWORD` | `dglea.android.keystorePassword` | Keystore password |
| `DGLEA_ANDROID_KEY_ALIAS` | `dglea.android.keyAlias` | Key alias |
| `DGLEA_ANDROID_KEY_PASSWORD` | `dglea.android.keyPassword` | Key password |

When credentials are absent, `./gradlew :app:assembleRelease` still succeeds and produces an **unsigned** release APK. This keeps CI and local builds green while preventing accidental commits of signing material.

To create and use a local release keystore later:

```bash
# Generate a keystore (do this once on a secure machine; never commit the file)
keytool -genkey -v -keystore dglea-release.keystore -alias dglea -keyalg RSA -keysize 2048 -validity 10000

# Build a signed release APK
export DGLEA_ANDROID_KEYSTORE_PATH="$(pwd)/dglea-release.keystore"
export DGLEA_ANDROID_KEYSTORE_PASSWORD="your-keystore-password"
export DGLEA_ANDROID_KEY_ALIAS="dglea"
export DGLEA_ANDROID_KEY_PASSWORD="your-key-password"
./gradlew :app:assembleRelease
```

Alternatively, set the Gradle project properties in `~/.gradle/gradle.properties` or on the command line with `-P`.

⚠️ Never commit `*.jks`, `*.keystore`, `signing.properties`, or any password. These are already gitignored.

## Checks

From `apps/android`:

```bash
./gradlew :app:test
./gradlew :app:assembleDebug
./gradlew :app:assembleStaging
./gradlew :app:assembleRelease
```

`assembleRelease` does not require signing credentials; it will be unsigned when they are absent.

## Current status

- Android source is aligned to the current backend routes.
- Local compilation is verified in this environment with the SDK installed at `C:\Users\BlackTie\AppData\Local\Android\Sdk`.
- `./gradlew test` and `./gradlew assembleDebug` both pass from `apps/android`.
- The old login-and-record API contract has been removed from the app sources and tests.
