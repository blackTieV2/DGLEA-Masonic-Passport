# DGLEA Masonic Passport — Privacy Risk Register

This register captures the principal privacy risks at the current stage of the project. It should be reviewed and updated as controls are implemented.

## Risk Scoring

- **Likelihood:** 1 (rare) to 5 (almost certain)
- **Impact:** 1 (negligible) to 5 (severe)
- **Risk score:** Likelihood × Impact
- **Status:** OPEN, MITIGATED, CLOSED, ACCEPTED

## Risk Register

| ID | Risk | Data affected | Likelihood | Impact | Score | Controls already in place | Gaps / actions | Status |
|----|------|---------------|------------|--------|-------|---------------------------|----------------|--------|
| R1 | Unauthorised access to backend database exposes all personal and progress data. | All backend data | 2 | 5 | 10 | Backend API only; Firebase Auth on endpoints; role/scope checks; DB credentials via env vars. | Document DB access controls, encryption at rest, network rules, and backup security. | OPEN |
| R2 | Firebase Auth misconfiguration allows account takeover or token spoofing. | User identity, sign-in sessions | 2 | 5 | 10 | Firebase project per environment; backend verifies ID tokens; bearer-first guard. | Regular Firebase security review; disable unused sign-in methods; enforce email verification if required. | OPEN |
| R3 | Debug/demo fallback is accidentally enabled in a non-debug build. | All data visible to demo users | 1 | 5 | 5 | Dev-auth gated by `ALLOW_DEV_AUTH=true` and `ENVIRONMENT_NAME="debug"` BuildConfig values; bearer-first guard. | Verify release/staging builds cannot set `ALLOW_DEV_AUTH=true`; add CI check. | OPEN |
| R4 | Mentor notes or progress data are visible to unauthorised users. | Sensitive progress/mentoring records | 2 | 4 | 8 | Permission evaluator restricts profile/progress access by role and scope. | Add automated tests for every role/scope edge case; document access matrix. | OPEN |
| R5 | Exported PDF is shared with unintended recipients. | Brother identity, lodge, progress, notes | 3 | 4 | 12 | PDF generated only for authorised viewers; app uses OS share sheet. | Add watermark, generation timestamp, and Brother/lodge identifier; educate users. | OPEN |
| R6 | Personal data retained longer than necessary. | All personal data | 3 | 3 | 9 | `updatedAt` timestamps on records; no automatic purge. | Define retention periods and deletion schedule; implement purge where appropriate. | OPEN |
| R7 | Member requests deletion but no process exists. | All personal data | 2 | 4 | 8 | `onDelete: Restrict` protects referential integrity. | Design and document right-to-erasure workflow; identify data to be deleted vs. anonymised. | OPEN |
| R8 | Local app cache on device is accessed if device is compromised. | Profile, progress, reference content | 2 | 3 | 6 | Data held in memory; not intentionally persisted to disk. | Document Android OS protections; consider encrypted SharedPreferences if caching is introduced. | OPEN |
| R9 | Audit logs are not reviewed or are accessible to too many people. | Audit events | 2 | 3 | 6 | Audit events stored in DB; backend-only access. | Define who can query audit events; schedule periodic review; protect export of audit data. | OPEN |
| R10 | Third-party subprocessors (Firebase/Google Cloud) process data without DGLEA approval. | All data | 3 | 3 | 9 | Firebase Auth and Google Cloud are standard managed services. | List subprocessors; confirm DGLEA acceptance of terms; document data residency. | OPEN |
| R11 | Pilot testers enter real member data before approval. | All personal data | 3 | 5 | 15 | Pilot documentation forbids real data; debug/demo accounts are synthetic. | Communicate pilot rules; enforce named tester list; review pilot data before migration. | OPEN |
| R12 | Data breach or misconfiguration occurs with no response plan. | All data | 2 | 5 | 10 | Audit events capture many actions. | Define incident response contacts, steps, breach notification rules, and escalation path. | OPEN |

## Risk Priorities

1. **R11 — Real member data entered during pilot.** Score 15. Highest priority; must be prevented through communication, process, and data review.
2. **R5 — Exported PDF shared inappropriately.** Score 12. Mitigate with watermarking and user guidance.
3. **R1, R2, R12 — Unauthorised access / breach response.** Score 10 each. Require documented security controls and incident response.

## Mitigation Roadmap

### Before pilot with synthetic data
- Confirm debug/demo fallback cannot be enabled in staging/release builds.
- Distribute pilot rules to all testers.
- Maintain a controlled tester list.

### Before pilot with any real data
- Approve privacy notice and consent process.
- Confirm role/scope access controls with automated tests.
- Add PDF watermark and timestamp.
- Define retention and deletion policy.
- Approve subprocessor list.

### Before production
- Complete encryption-at-rest and backup security review.
- Implement right-to-erasure workflow.
- Establish incident response process.
- Conduct penetration/security review.
- Obtain formal DGLEA sign-off.

## Evidence Index

- Data inventory: `docs/data-inventory.md`
- Privacy review: `docs/privacy-data-handling-review.md`
- Backend schema: `backend/prisma/schema.prisma`
- Export service: `backend/src/modules/exports/exports.service.ts`
- Auth guard: `backend/src/common/guards/firebase-auth.guard.ts`
