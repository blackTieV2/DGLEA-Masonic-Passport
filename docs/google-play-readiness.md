---
type: reference
title: Google Play Readiness Checklist
---

# Google Play Readiness Checklist

This document tracks the Android app's readiness for distribution on Google Play.

## Target SDK and build format

| Requirement | Status | Notes |
|---|---|---|
| `targetSdkVersion` >= current Google Play target | Required | Must match the latest Play target-SDK policy at time of release. |
| `compileSdkVersion` >= `targetSdkVersion` | Required | Use latest stable Android SDK. |
| Release as Android App Bundle (AAB) | Required | Google Play requires AAB for new apps; APK only for internal testing. |
| Signed AAB with upload key | Required | Store signing key in secure hardware or CI secret store. |
| `versionCode` increments | Required | Automated in CI/CD pipeline. |

## Privacy policy and Data Safety

| Requirement | Status | Notes |
|---|---|---|
| Privacy policy URL | Required | Must cover DGLEA data handling, mentor notes, and retention. |
| Data Safety form | Required | Declare collected data: email, name, phone, progress records, mentor sessions, device IDs. |
| Accurate data usage | Required | Only declare data actually collected; update when features change. |
| Lawful basis for processing | Required | Align with DGLEA privacy notice and local data-protection law. |

## Account deletion

| Requirement | Status | Notes |
|---|---|---|
| In-app account deletion request | Required by Google Play | Initiate deletion workflow; do not hard-delete audit events. |
| Deletion confirmation | Required | Email or in-app confirmation with expected timeframe. |
| Data retention disclosure | Required | Explain what is deleted, anonymised, or retained for audit/legal reasons. |
| Backend deletion endpoint | Required | `DELETE /users/:id/account-request` or equivalent, audited. |

## Permissions

| Permission | Justification | Required? |
|---|---|---|
| `INTERNET` | API communication | Yes |
| `POST_NOTIFICATIONS` | In-app notifications (Android 13+) | Yes |
| Camera / storage | Only if app supports photo evidence; request at runtime | Optional |
| Location | Not required; do not request unless explicitly justified | No |
| Contacts | Not required | No |

## Security

| Requirement | Status | Notes |
|---|---|---|
| Firebase App Check | Recommended | Attest app integrity for backend requests. |
| Play Integrity API | Recommended | Verify genuine device / genuine app for sensitive operations. |
| Certificate pinning | Recommended | Pin to DGLEA backend certificate; fallback documented. |
| Obfuscation (R8/ProGuard) | Required for release | Enable minification and keep rules for serialized DTOs. |
| No hardcoded secrets | Required | Load API keys and config from remote config or build-time env. |
| Clear sensitive cache on sign-out | Required | Wipe tokens, draft cache, and downloaded passport data. |

## Backend integration

| Requirement | Status | Notes |
|---|---|---|
| Firebase Auth ID token refresh | Required | Attach refreshed ID token to every API call. |
| Server-side permission enforcement | Required | Android must never trust local UI to enforce permissions. |
| Safe logging | Required | No token, personal data, or ritual content in logs. |
| Offline-first drafts | Recommended | Queue drafts locally; sync when online; handle conflicts. |

## Store listing

| Requirement | Status | Notes |
|---|---|---|
| App icon and feature graphic | Required | Follow DGLEA brand guidelines. |
| Screenshots / video | Required | Show generic or demo data; no real Brother content. |
| Content rating | Required | Complete Google Play content-rating questionnaire accurately. |
| Target countries | Required | Confirm DGLEA jurisdiction and availability. |

## Pre-launch verification

- [ ] Run Firebase Test Lab / pre-launch report
- [ ] Verify no crash on sign-in, passport load, submit, and review flows
- [ ] Verify TalkBack / accessibility basics
- [ ] Verify account-deletion flow end-to-end
- [ ] Verify Data Safety declarations match actual behavior

## Related documents

- `apps/android/README.md`
- `_config/access-policy.md`
- `docs/04-ux/`
