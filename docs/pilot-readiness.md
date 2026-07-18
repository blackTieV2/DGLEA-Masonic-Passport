# DGLEA Masonic Passport — Pilot Readiness

This document describes the readiness of the DGLEA Masonic Passport Android app and backend for a **controlled pilot demonstration**. It is **not** a production-go approval.

## Scope

- Android app: Firebase email/password sign-in, profile/passport view, reference content, PDF export/download/share, logout.
- Backend: NestJS API with Firebase Auth Bearer verification, dev-auth fallback for local debug only.
- Target audience: pilot co-ordinator, Lodge Secretary, Mentor, and anyone evaluating the app for broader rollout.

## Pilot Readiness Checklist

| Item | Status | Notes / Evidence |
|------|--------|------------------|
| Android Firebase sign-in implemented | ✅ Ready | Real Firebase email/password sign-in merged (PR #46). |
| Backend Firebase Bearer auth verified | ✅ Ready | `Authorization: Bearer` path verified; guard ordering defect fixed and merged (PR #47). |
| Profile / passport loading | ✅ Ready | Profile and degree-progress endpoints exercised via Android and backend tests. |
| PDF export / download / share | ✅ Ready | Backend PDF export endpoint and Android PDF download merged (PRs #41, #42). |
| Reference content available | ✅ Ready | Static reference content endpoint and Android UI merged (PR #40). |
| Logout returns to usable sign-in screen | ✅ Ready | Logout loading-state regression fixed and merged (PR #49). |
| Launcher icon in place | ✅ Ready | DGLEA-branded adaptive launcher icon merged (PR #50). |
| Environment config explicit per build type | ✅ Ready | Debug/staging/release URLs and `ALLOW_DEV_AUTH` flags configured (PR #51). |
| Release signing config safe | ✅ Ready | Signing reads from env vars / Gradle properties only; no secrets committed (PR #52). |
| Debug demo account limitation | ⚠️ Limitation | Demo account fallback exists **only** in debug builds and requires `ALLOW_DEV_AUTH=true`. It must not be used for real members in pilot. |
| Staging backend URL provisioned | ❌ Blocked | Placeholder `.invalid` URL is in place; real staging backend not yet provisioned. |
| Release keystore generated and stored | ❌ Blocked | No release keystore exists; CI signing secret injection not configured. |
| Production deployment performed | ❌ Blocked / N/A | No production deployment has been performed and none is approved by this document. |

## Go / No-Go Matrix

| Area | Status for Pilot | Rationale |
|------|------------------|-----------|
| Android app usability | READY FOR PILOT | Polished sign-in UX, safe-area handling, branded splash/launcher icon (PRs #48, #50). |
| Authentication | READY WITH LIMITATION | Real Firebase auth works; debug fallback is debug-only and must be disabled/removed for any non-debug pilot device. |
| Backend API | READY FOR PILOT | Bearer-first Firebase auth merged and verified (PR #47); backend smoke tests exist. |
| Firebase configuration | READY WITH LIMITATION | Config files (`google-services.json`) must be supplied per environment and never committed. |
| Local demo flow | READY WITH LIMITATION | Useful for local development only; not a real-member authentication path. |
| Staging environment | BLOCKED | Real staging backend URL and environment not provisioned. |
| Release signing | BLOCKED | Keystore not generated; CI secret injection not configured. A signed release APK cannot be produced yet. |
| Data / privacy | NOT PRODUCTION READY | Privacy notice, data retention policy, and member consent process have not been reviewed or approved. |
| Admin workflows | READY WITH LIMITATION | Backend role checks exist; admin UI is not part of the pilot scope. |
| Lodge Secretary workflow | READY WITH LIMITATION | Approval workflow exists in API; Secretary-facing UI is limited to the app’s current screens. |
| Mentor approval workflow | READY WITH LIMITATION | Mentor sign-off flow exists in API and app; operational process not yet defined. |
| PDF export | READY FOR PILOT | Export and download work; verify generated PDF contents with real member data before wider use. |
| Operational support | NOT PRODUCTION READY | No runbook, support channel, or incident response defined for pilot. |
| Rollback / recovery | NOT PRODUCTION READY | No documented rollback plan or database backup/recovery procedure for pilot data. |
| User training | NOT PRODUCTION READY | No training material or help content has been produced. |

## Known Limitations

1. **Staging backend is a placeholder.** The `staging` build type points to `REPLACE-WITH-STAGING-BACKEND.invalid`. A real staging environment must be provisioned before any non-local pilot.
2. **Release signing is not configured.** Without a real keystore and CI secrets, only unsigned release APKs or debug APKs can be built.
3. **Debug demo account must not be used for real members.** It is gated to `debug` builds and `ALLOW_DEV_AUTH=true`.
4. **Privacy and data handling review is outstanding.** The pilot must not process real personal data until this is completed.
5. **No operational support or rollback plan.** A pilot should have a named support contact and a way to recover from mistakes.
6. **Official DGLEA crest/artwork is not final.** The current launcher icon and branding are MVP placeholders.
7. **User training/help content is not available.** Pilot users will need in-person guidance or a separate help sheet.

## Evidence Index

- Firebase E2E smoke test result: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/firebase-e2e-uid-mapping-smoke-result.md`
- Auth guard bearer-first fix result: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/firebase-auth-guard-bearer-first-result.md`
- PR #47 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/pr-47-review-merge-verify-result.md`
- Android UX readiness result: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/android-ux-production-readiness-result.md`
- PR #48 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/pr-48-review-merge-verify-result.md`
- Android logout loading fix result: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/android-logout-loading-fix-result.md`
- PR #49 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/pr-49-review-merge-verify-result.md`
- Android launcher icon result: `projects/dglea-masonic-passport-digitisation/stages/18-android-launcher-icon/output/android-launcher-icon-readiness-result.md`
- PR #50 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/18-android-launcher-icon/output/pr-50-review-merge-verify-result.md`
- Android environment config result: `projects/dglea-masonic-passport-digitisation/stages/19-android-environment-config/output/android-environment-config-readiness-result.md`
- PR #51 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/19-android-environment-config/output/pr-51-review-merge-verify-result.md`
- Android release signing result: `projects/dglea-masonic-passport-digitisation/stages/20-android-release-signing/output/android-release-signing-readiness-result.md`
- PR #52 review/merge/verify: `projects/dglea-masonic-passport-digitisation/stages/20-android-release-signing/output/pr-52-review-merge-verify-result.md`

## Recommended Pilot Use

A pilot should be run only on **debug/staging builds in a controlled environment** until the production blockers in `docs/production-readiness-gaps.md` are resolved. Prefer local demo accounts only for development and testing, never for real member data.
