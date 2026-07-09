---
type: changed-files
title: Android and backend alignment changed files
timestamp: "2026-07-02"
status: complete
---

# Changed Files

## Backend

- `backend/src/common/guards/firebase-auth.guard.spec.ts`
- `backend/src/common/guards/firebase-auth.guard.ts`

## Android

- `apps/android/README.md`
- `apps/android/local.properties`
- `apps/android/app/src/main/java/com/dglea/passport/MainActivity.kt`
- `apps/android/app/src/main/java/com/dglea/passport/data/AppContainer.kt`
- `apps/android/app/src/main/java/com/dglea/passport/data/AuthRepository.kt`
- `apps/android/app/src/main/java/com/dglea/passport/data/MentorRepository.kt`
- `apps/android/app/src/main/java/com/dglea/passport/data/PassportRepository.kt`
- `apps/android/app/src/main/java/com/dglea/passport/data/SessionStore.kt`
- `apps/android/app/src/main/java/com/dglea/passport/network/ApiModels.kt`
- `apps/android/app/src/main/java/com/dglea/passport/network/AuthInterceptor.kt`
- `apps/android/app/src/main/java/com/dglea/passport/network/BackendApi.kt`
- `apps/android/app/src/main/java/com/dglea/passport/network/NetworkClientFactory.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/AuthViewModel.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/MentorViewModel.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/PassportViewModel.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/screens/ConnectScreen.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/screens/MentorVerificationScreen.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/screens/MyPassportScreen.kt`
- `apps/android/app/src/main/java/com/dglea/passport/ui/screens/SignInScreen.kt` deleted
- `apps/android/app/src/test/java/com/dglea/passport/network/NetworkClientFactoryTest.kt`
- `apps/android/app/src/test/java/com/dglea/passport/ui/AuthViewModelTest.kt`
- `apps/android/app/src/test/java/com/dglea/passport/ui/MentorViewModelTest.kt`
- `apps/android/app/src/test/java/com/dglea/passport/ui/PassportViewModelTest.kt`

## Generated during local tooling

- `apps/android/.gradle/8.14.3/checksums/checksums.lock`
- `apps/android/.gradle/8.14.3/checksums/md5-checksums.bin`
- `apps/android/.gradle/8.14.3/checksums/sha1-checksums.bin`
- `apps/android/.gradle/buildOutputCleanup/buildOutputCleanup.lock`
- `apps/android/.gradle/buildOutputCleanup/cache.properties`
- `apps/android/.gradle/buildOutputCleanup/outputFiles.bin` deleted by Gradle cleanup

## Notes

The Android SDK is missing in this environment, so Gradle sync/build could not be completed end-to-end here.
