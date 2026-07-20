# DGLEA Masonic Passport — Rollback Runbook

**Status:** Draft rollback procedure for the controlled technical pilot  
**Scope:** Android app, backend API, staging environment, pilot data  
**Date:** 2026-07-20

## Purpose

This runbook describes how to stop the pilot, contain an incident, and roll back to a safe state. It is designed for a **controlled technical pilot** and does not constitute a production disaster-recovery plan.

## When to Roll Back

Roll back when any of the following occur:

- Real member personal data is entered or exposed.
- An exported PDF containing personal or sensitive data is mishandled.
- Auth bypass appears outside debug builds.
- Staging or release builds point to the wrong backend.
- A suspected privacy or data incident is identified.
- A defect prevents the majority of pilot users from completing the pilot test script.

## Rollback Procedure

### 1. Stop Pilot Use

- Announce to all pilot users that the pilot is paused.
- Ask users to stop using the app and not to share any files.
- Disable or block affected test accounts in Firebase if necessary.

### 2. Revoke / Disable Test Access

- If the issue is auth-related, disable the affected Firebase Auth users.
- If the issue is scope-related, review and correct `RoleAssignment` and `MentorAssignment` records.
- Confirm debug/demo fallback is not enabled in staging/release builds.

### 3. Revert Android Build

- If a defect is in the current APK, distribute the previous working APK or revert to the last known good commit.
- Rebuild the debug/staging APK from `main` after the defect is fixed.
- Do not attempt to release a production APK; release signing is not configured.

### 4. Roll Back Backend Deployment (When Staging Exists)

- If a staging backend has been provisioned, roll back to the previous working deployment.
- Confirm `API_BASE_URL` for the staging build matches the intended staging backend.
- If no staging backend exists yet, use the local backend for diagnosis only.

### 5. Preserve Evidence / Logs

- Capture relevant Android logs, backend logs, screenshots, and issue log entries.
- Do not include passwords, tokens, or real member data in evidence.

### 6. Notify Stakeholders

- Notify the Pilot Support Owner, Technical Owner, Privacy / Data Owner, and DGLEA Stakeholder Approver.
- For Critical incidents, notify by phone or in-person if possible.

### 7. Document Corrective Action

- Update the issue log with:
  - Root cause
  - Containment steps taken
  - Fix or rollback applied
  - Data remediation (deletion, anonymisation, correction)
  - Lessons learned

### 8. Criteria for Restart

The pilot may restart only when all of the following are true:

- The root cause is understood and fixed.
- The fix is verified in a test environment.
- Any affected data has been remediated.
- Stakeholders approve restart.
- The pilot issue log has been updated.

## Post-Rollback Verification

- Confirm the app starts and reaches the sign-in screen.
- Confirm sign-in works with a test account.
- Confirm profile/passport data loads correctly.
- Confirm PDF export generates the expected content.
- Confirm logout returns to a usable sign-in screen.

## Evidence Index

- Operational support model: `docs/operational-support.md`
- Privacy review: `docs/privacy-data-handling-review.md`
- Pilot readiness: `docs/pilot-readiness.md`
- Pilot test script: `docs/pilot-test-script.md`
