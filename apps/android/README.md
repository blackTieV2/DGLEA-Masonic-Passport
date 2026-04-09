# Android app (`apps/android`)

Thin Android **Brother-role** client for DGLEA Masonic Passport.

This README is intentionally practical for contributors who are **not Android specialists**.

## What this app currently does

This slice intentionally implements only Brother flow:
1. Sign in
2. Fetch current user
3. View **My Passport** summary
4. Create draft passport record
5. Submit draft for verification

### Out of scope (for now)
- Dashboard/analytics views
- Lodge admin workflows
- Mentor workflow UI
- Broad product polish beyond the core Brother path

## Tech stack (minimal, production-minded)
- Kotlin + Jetpack Compose
- MVVM (`ViewModel` + `StateFlow`)
- Retrofit + OkHttp
- Kotlin Coroutines

## Prerequisites

- **Android Studio** (latest stable recommended)
- JDK 17 (Android Studio bundles a compatible JDK in most setups)
- Running DGLEA backend locally (default assumed: `http://localhost:3000`)

## First-time setup (non-specialist path)

### 1) Open project in Android Studio
Open the `apps/android` folder as a Gradle project.

### 2) Configure Android SDK path
Use either approach:

- Android Studio-managed SDK (recommended)
- Or create `apps/android/local.properties` manually:

```properties
sdk.dir=/Users/<you>/Library/Android/sdk
```

Windows example:

```properties
sdk.dir=C:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
```

### 3) Verify Gradle sync
From `apps/android`:

```bash
./gradlew tasks
```

If this fails, the most common cause is missing SDK path (`local.properties`) or missing SDK platform/build tools.

## Running checks

From `apps/android`:

```bash
./gradlew test
```

Build debug APK:

```bash
./gradlew assembleDebug
```

## Run on emulator

1. Start an Android Emulator (AVD Manager).
2. Ensure backend is running on your host machine.
3. For Android emulator networking, app base URL should be `http://10.0.2.2:3000/` (`10.0.2.2` routes from emulator to your host machine `localhost`).
4. Local dev HTTP is explicitly enabled only for `10.0.2.2` via `app/src/main/res/xml/network_security_config.xml`; global cleartext remains disabled.
5. Run app from Android Studio (`app` configuration).

## API endpoints used by this slice
- `POST /auth/login`
- `GET /me`
- `POST /members/{memberId}/passport-records`
- `POST /passport-records/{recordId}/submit`

## Seed/local data notes
- Member profile id can be entered explicitly in this thin slice.
- Default seeded profile used in local flow is commonly `mp_1`.
- Session token persistence is local (SharedPreferences-backed store).
