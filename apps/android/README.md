# Android app (`apps/android`)

Thin Android **Brother-role** client for DGLEA Masonic Passport.

This README is intentionally practical for contributors who are **not Android specialists**.

## What this app currently does

This slice currently implements two thin flows:

**Brother flow**
1. Sign in
2. Fetch current user
3. View **My Passport** summary
4. Create draft passport record
5. Submit draft for verification

**Mentor verification flow (minimal)**
1. Sign in as mentor-capable user
2. View pending verification queue
3. Verify a submitted record
4. Reject a submitted record with reason
5. Request clarification with reason

### Out of scope (for now)
- Dashboard/analytics views
- Lodge admin workflows
- Broad mentor dashboard/reporting UI beyond the minimal verification actions
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


## Manual regression checklist (MVP)

Run this quick checklist after local changes:

1. **Brother create/submit**
   - Sign in as `brother@example.org` / `pass`.
   - Refresh summary.
   - Create draft record.
   - Submit draft and confirm status updates.

2. **Mentor verify/reject/clarification**
   - Sign out.
   - Sign in as `mentor@example.org` / `pass`.
   - Refresh verification queue.
   - Verify one submitted record.
   - Reject a submitted record with reason.
   - Request clarification on a submitted record with reason.

3. **Sign-out and account switching**
   - Sign out from mentor screen and confirm return to sign-in screen.
   - Sign in as brother again without reinstalling app.
   - Sign out from brother screen and sign in as mentor again.

4. **Clarification response loop**
   - Mentor requests clarification with reason for submitted record.
   - Brother signs in, refreshes summary, confirms `RESPOND_TO_CLARIFICATION`.
   - Brother confirms/enters clarification record id, saves clarification response note, and resubmits.
   - Mentor refreshes queue and verifies updated brother note is visible.
