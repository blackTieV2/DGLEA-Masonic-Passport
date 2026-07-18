# DGLEA Masonic Passport — Production Readiness Gaps

This document lists the blockers and gaps that must be resolved before the DGLEA Masonic Passport can be considered ready for a production release or a pilot involving real member data.

## Production Blockers

The following items are **hard blockers** for production release. They are acceptable to defer for a controlled technical pilot, but must be addressed before any real member data is processed or before the app is distributed outside the pilot team.

| # | Blocker | Why it blocks production | Suggested resolution |
|---|---------|--------------------------|----------------------|
| 1 | Real staging backend URL not provisioned | The `staging` build points to `REPLACE-WITH-STAGING-BACKEND.invalid`. There is no environment for UAT or pilot testing outside local development. | Provision a staging Firebase project and backend deployment; update the staging `API_BASE_URL`. |
| 2 | Production backend URL not approved | The `release` build points to `REPLACE-WITH-PRODUCTION-BACKEND.invalid`. No production hosting plan exists. | Agree production hosting, provision infrastructure, and update the release `API_BASE_URL`. |
| 3 | Release keystore not generated or securely stored | The app cannot produce a signed release APK. Play Store / sideload distribution requires a signing key. | Generate a release keystore on a secure machine, store it in a secrets manager, and configure CI to inject it. |
| 4 | CI signing secret injection not configured | Even with a keystore, CI cannot sign release builds automatically because the `DGLEA_ANDROID_*` secrets are not available. | Add secrets to CI and wire them into the Gradle build. |
| 5 | Official DGLEA crest / artwork not final | The current launcher icon and branding are MVP placeholders. | Obtain final approved artwork and update adaptive icon resources. |
| 6 | Pilot user acceptance not completed | The pilot test script has not been executed with representative users. | Run the script in `docs/pilot-test-script.md` with Lodge Secretary, Mentor, and candidate representatives. |
| 7 | Privacy / data handling review not completed | No privacy notice, data retention policy, or member consent process has been reviewed. | Legal/privacy review; add in-app notice and consent flow if required. |
| 8 | Operational support process not defined | No support channel, runbook, or incident response exists for production issues. | Define a support contact, escalation path, and basic runbook. |

## Additional Gaps (Not Hard Blockers for a Controlled Pilot)

These items should be tracked and closed before full rollout, but do not prevent a closely supervised pilot with synthetic or anonymised data.

| # | Gap | Impact | Suggested action |
|---|-----|--------|------------------|
| 9 | Rollback / recovery procedure undocumented | A bad deployment or data error could be hard to recover from. | Document database backup/restore and app rollback steps. |
| 10 | User training material absent | Pilot users may be confused by features or flows. | Create a short help sheet or in-app guidance. |
| 11 | Admin UI not built | Lodge Secretary / admin tasks currently require API access or direct database interaction. | Build admin screens or document admin API usage. |
| 12 | Analytics / crash reporting not configured | Production issues may go unnoticed. | Add privacy-compliant crash reporting and basic analytics. |
| 13 | Automated end-to-end tests on device farms not run | Device-specific issues may be missed. | Run Firebase Test Lab or similar against representative devices. |
| 14 | Accessibility audit not completed | Some users may have difficulty using the app. | Conduct an accessibility review and address contrast, labels, and navigation. |

## Evidence Index

Validation records are stored in the AI-Workbench project:

- Firebase E2E smoke test: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/firebase-e2e-uid-mapping-smoke-result.md`
- Auth guard fix: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/firebase-auth-guard-bearer-first-result.md`
- PR #47 merge verification: `projects/dglea-masonic-passport-digitisation/stages/16-android-firebase-sign-in/output/pr-47-review-merge-verify-result.md`
- Android UX readiness: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/android-ux-production-readiness-result.md`
- PR #48 merge verification: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/pr-48-review-merge-verify-result.md`
- Android logout loading fix: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/android-logout-loading-fix-result.md`
- PR #49 merge verification: `projects/dglea-masonic-passport-digitisation/stages/17-android-ux-readiness/output/pr-49-review-merge-verify-result.md`
- Android launcher icon: `projects/dglea-masonic-passport-digitisation/stages/18-android-launcher-icon/output/android-launcher-icon-readiness-result.md`
- PR #50 merge verification: `projects/dglea-masonic-passport-digitisation/stages/18-android-launcher-icon/output/pr-50-review-merge-verify-result.md`
- Android environment config: `projects/dglea-masonic-passport-digitisation/stages/19-android-environment-config/output/android-environment-config-readiness-result.md`
- PR #51 merge verification: `projects/dglea-masonic-passport-digitisation/stages/19-android-environment-config/output/pr-51-review-merge-verify-result.md`
- Android release signing: `projects/dglea-masonic-passport-digitisation/stages/20-android-release-signing/output/android-release-signing-readiness-result.md`
- PR #52 merge verification: `projects/dglea-masonic-passport-digitisation/stages/20-android-release-signing/output/pr-52-review-merge-verify-result.md`

## Next Steps

1. Resolve production blockers in priority order.
2. Execute the pilot test script (`docs/pilot-test-script.md`) with the pilot group.
3. Update this document and `docs/pilot-readiness.md` as blockers are cleared.
