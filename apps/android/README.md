# apps/android

Thin Android Brother slice client for DGLEA Masonic Passport.

## Stack choice (minimal + production-minded)
- **Kotlin + Jetpack Compose**: fast UI iteration with explicit state-driven rendering.
- **MVVM (ViewModel + StateFlow)**: keeps network/domain logic out of composables.
- **Retrofit + OkHttp**: small, stable HTTP client stack aligned with existing backend REST API.
- **Coroutines**: straightforward async orchestration for API calls.

## Scope in this slice
Implemented only Brother flow:
1. sign in
2. current user
3. My Passport summary
4. create draft passport record
5. submit draft for verification

## My Passport screen status (explicit)
The current **My Passport** screen is now an MVP-valid Brother summary view:
- four core sections are shown (EA, FC, MM, PFO),
- each section shows progress state and latest/pending status when available,
- a clear create-draft action is preserved in the same screen.

## Out of scope
- dashboards
- district analytics
- lodge admin flows
- broad UX polish
- mentor workflow UI

## Backend API used
- `POST /auth/login`
- `GET /me`
- `POST /members/{memberId}/passport-records`
- `POST /passport-records/{recordId}/submit`

## Notes
- For local emulator, base URL is `http://10.0.2.2:3000/`.
- Member profile id is entered explicitly in this thin slice (defaults to `mp_1` for seeded local flows).
- Session token persistence is backed by SharedPreferences in this stabilisation pass.
