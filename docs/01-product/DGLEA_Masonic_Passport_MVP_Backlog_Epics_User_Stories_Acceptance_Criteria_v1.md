# DGLEA Masonic Passport — MVP Backlog, Epics, User Stories, and Acceptance Criteria

**Document Status:** Draft v1  
**Intended Repository Use:** Save as `.md` in GitHub  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06  

---

## 1. Purpose

This document defines the **MVP delivery backlog** for the DGLEA Masonic Passport platform.

It is designed to bridge the gap between architecture and implementation.

The goal is not to produce a giant wish list. The goal is to give Codex and engineering a **sane build order** with clear acceptance criteria.

---

## 2. MVP Scope Position

The MVP must prove that the product can:
1. onboard users and roles;
2. maintain district passport structure;
3. allow Brothers to create and submit entries;
4. allow authorised mentors to verify them;
5. provide lodge-level oversight;
6. provide district-level analytics;
7. maintain audit truth.

Anything that does not materially support those goals should be treated cautiously in MVP.

---

## 3. Delivery Philosophy

### 3.1 Build Vertical Slices
Do not build every table and endpoint first and call that progress.  
Build thin end-to-end slices that prove the product works.

### 3.2 Sequence by Risk
Highest-risk areas first:
- identity and scope
- core passport template model
- record creation and submission
- verification workflow
- lodge and district dashboards

### 3.3 Keep the MVP Honest
A “pretty app with no trustworthy workflow” is not success.

---

## 4. Epic Overview

| Epic ID | Epic Name | Priority | Why It Matters |
|---|---|---:|---|
| E1 | Identity and Access | P0 | No safe system without roles and scope |
| E2 | Lodge and District Administration | P0 | Required to onboard 45 lodges properly |
| E3 | Passport Template and Core Data | P0 | The district structure is the product backbone |
| E4 | Passport Record Entry | P0 | Brothers must be able to use the product |
| E5 | Verification Workflow | P0 | Trust and governance depend on it |
| E6 | Notifications | P1 | Prevents stalled workflows |
| E7 | Lodge Dashboards | P1 | Lodge Mentor and leadership need operational visibility |
| E8 | District Analytics | P1 | District-wide oversight is a core project requirement |
| E9 | Audit and Admin Corrections | P1 | Governance and trust requirement |
| E10 | Reporting and Export | P2 | Important, but can follow core workflow proof |
| E11 | Feature Flag and Rollout Controls | P2 | Useful for pilot rollout and safer release |
| E12 | Private Mentoring Notes | P3 | Useful but not essential to first proving the platform |

---

## 5. Epic Details

## E1 — Identity and Access

### Story E1-S1 — User can authenticate
**As a** platform user  
**I want** to sign in securely  
**So that** I can access the platform according to my role.

**Acceptance Criteria**
- user can sign in with valid credentials
- invalid credentials are rejected
- current session exposes user identity and active roles
- access token/session is required for protected routes

### Story E1-S2 — Platform enforces role and scope
**As a** system  
**I want** every request to be checked for role and scope  
**So that** lodge and district boundaries are preserved.

**Acceptance Criteria**
- Brother cannot view other Brothers’ records
- Personal Mentor can only access assigned Brothers unless another role grants more
- Lodge Mentor can only access users in his lodge
- District Mentor can access district analytics but not unrestricted private notes

### Story E1-S3 — Multi-role user support
**As a** user with more than one role  
**I want** my access to reflect all valid roles in scope  
**So that** I can use the platform correctly without duplicate accounts.

**Acceptance Criteria**
- one user can hold multiple active scoped roles
- permission evaluation reflects union of allowed roles, subject to explicit denials
- UI can display current effective capabilities

---

## E2 — Lodge and District Administration

### Story E2-S1 — Admin can create and manage lodges
**As a** District Admin  
**I want** to create and manage lodge records  
**So that** the district structure exists in the system.

**Acceptance Criteria**
- lodge can be created with district association
- lodge can be activated/deactivated
- lodge configuration can be edited

### Story E2-S2 — Lodge Admin can onboard member profiles
**As a** Lodge Admin  
**I want** to create and update member profiles  
**So that** Brothers can start using the passport.

**Acceptance Criteria**
- member profile can be created for a user
- lodge affiliation is mandatory
- degree status is stored
- milestone dates can be updated via controlled admin flow

### Story E2-S3 — Admin can assign mentor roles
**As a** Lodge Admin or District Admin  
**I want** to assign mentor roles  
**So that** the workflow routes correctly.

**Acceptance Criteria**
- Personal Mentor assignment can be created for a Brother
- Lodge Mentor role can be assigned at lodge scope
- historical assignments remain traceable when ended

---

## E3 — Passport Template and Core Data

### Story E3-S1 — System stores district passport sections
**As a** system  
**I want** to store district-approved sections and items  
**So that** all lodges share a common structure.

**Acceptance Criteria**
- four core sections exist
- section ordering is preserved
- core items are queryable by section

### Story E3-S2 — Lodge can define governed supplements
**As a** Lodge Mentor or Lodge Admin  
**I want** to add lodge-specific supplementary items  
**So that** local lodge needs can be supported without changing the district core.

**Acceptance Criteria**
- supplement items are tied to lodge scope
- district core and lodge supplement items remain distinguishable
- supplement items can appear in member record view where enabled

---

## E4 — Passport Record Entry

### Story E4-S1 — Brother can create draft record
**As a** Brother  
**I want** to create a draft passport record  
**So that** I can capture an item before submitting it for verification.

**Acceptance Criteria**
- Brother can create draft against allowed section/item
- draft is visible to Brother
- draft is not counted as official progress

### Story E4-S2 — Brother can edit draft before submission
**As a** Brother  
**I want** to edit my draft  
**So that** I can correct it before review.

**Acceptance Criteria**
- draft fields can be updated before submission
- version history is preserved where required
- verified records cannot be casually edited via draft update path

### Story E4-S3 — Brother can submit record
**As a** Brother  
**I want** to submit a draft record for review  
**So that** a mentor can verify it.

**Acceptance Criteria**
- submitted record transitions to `SUBMITTED`
- submission timestamp is stored
- relevant mentor queue is updated
- notification event is triggered

---

## E5 — Verification Workflow

### Story E5-S1 — Mentor can verify submitted record
**As a** Personal Mentor or Lodge Mentor  
**I want** to verify a valid submission  
**So that** official progress is recorded.

**Acceptance Criteria**
- authorised mentor can verify eligible record
- record transitions to `VERIFIED`
- verifier identity and timestamp are stored
- official progress counters update

### Story E5-S2 — Mentor can reject submitted record
**As a** Personal Mentor or Lodge Mentor  
**I want** to reject an invalid submission  
**So that** inaccurate records do not count as official progress.

**Acceptance Criteria**
- rejection requires reason
- record transitions to `REJECTED`
- Brother is notified
- rejected record is excluded from verified metrics

### Story E5-S3 — Mentor can request clarification
**As a** Personal Mentor or Lodge Mentor  
**I want** to request clarification  
**So that** ambiguous submissions can be corrected without immediate rejection.

**Acceptance Criteria**
- clarification reason is mandatory
- record transitions to `NEEDS_CLARIFICATION`
- Brother can revise and resubmit

### Story E5-S4 — Lodge Mentor can override decision
**As a** Lodge Mentor  
**I want** to override an incorrect or stalled workflow decision  
**So that** the process does not break when a mentor is absent or wrong.

**Acceptance Criteria**
- override requires reason
- override action is audited
- original decision history is preserved
- final state is explicit

---

## E6 — Notifications

### Story E6-S1 — System notifies mentors of new submissions
**As a** Personal Mentor or Lodge Mentor  
**I want** to receive a notification when a Brother submits a record  
**So that** I can review it promptly.

**Acceptance Criteria**
- new submission creates notification event
- notification appears in-app
- email/push channel is configurable where enabled

### Story E6-S2 — System notifies Brother of workflow outcome
**As a** Brother  
**I want** to be notified when my record is verified, rejected, or needs clarification  
**So that** I know what to do next.

**Acceptance Criteria**
- verification, rejection, and clarification transitions create notification
- notification links user to relevant record

---

## E7 — Lodge Dashboards

### Story E7-S1 — Lodge Mentor sees lodge health dashboard
**As a** Lodge Mentor  
**I want** a dashboard of member progress and pending items  
**So that** I can manage mentoring effectively.

**Acceptance Criteria**
- dashboard shows pending verification count
- dashboard shows stale submissions
- dashboard shows member progress summaries
- dashboard is lodge-scoped

### Story E7-S2 — Lodge Leadership Reviewer sees summary view
**As a** Lodge Leadership Reviewer  
**I want** a read-focused summary dashboard  
**So that** I can monitor readiness without editing operational data.

**Acceptance Criteria**
- view is read-only
- exposes summary metrics and member readiness indicators
- private mentoring notes remain hidden

---

## E8 — District Analytics

### Story E8-S1 — District Mentor sees district analytics
**As a** District Mentor  
**I want** district-wide analytics  
**So that** I can assess adoption and effectiveness across lodges.

**Acceptance Criteria**
- district dashboard shows all lodge metrics
- drill-down is limited to authorised operational detail
- private notes excluded by default

### Story E8-S2 — District can identify stalled lodges or workflows
**As a** District Mentor  
**I want** to see adoption and exception signals  
**So that** the district can support lodges that are not progressing.

**Acceptance Criteria**
- dashboard highlights low-activity lodges
- dashboard highlights stale verification patterns
- time filters exist

---

## E9 — Audit and Admin Corrections

### Story E9-S1 — System audits every critical workflow action
**As a** District Admin  
**I want** auditable workflow history  
**So that** trust and traceability are preserved.

**Acceptance Criteria**
- submission, verification, rejection, clarification, override, and correction all create audit events
- audit event captures actor, role, timestamp, prior state, new state

### Story E9-S2 — Admin can perform controlled correction
**As a** Lodge Admin or District Admin  
**I want** a controlled correction path  
**So that** factual mistakes can be fixed without erasing history.

**Acceptance Criteria**
- verified record is not destructively overwritten
- correction path results in `SUPERSEDED` or equivalent governed outcome
- audit preserved

---

## E10 — Reporting and Export

### Story E10-S1 — Lodge can export progress summary
**As a** Lodge Mentor or Lodge Admin  
**I want** a lodge report export  
**So that** I can support committee and annual review needs.

**Acceptance Criteria**
- report generation is lodge-scoped
- generated report is stored as a report snapshot
- only authorised roles can access the export

### Story E10-S2 — District can export district summary
**As a** District Mentor  
**I want** district report export  
**So that** district-level oversight can be supported.

**Acceptance Criteria**
- district report aggregates cross-lodge data
- role-based access enforced

---

## E11 — Feature Flag and Rollout Controls

### Story E11-S1 — System supports role/lodge feature targeting
**As a** District Admin  
**I want** to enable features for selected lodges or roles  
**So that** rollout can be controlled safely.

**Acceptance Criteria**
- feature can be targeted by lodge or role
- default state is defined
- feature targeting is auditable

### Story E11-S2 — Feature flags are governed
**As a** system owner  
**I want** feature flags to have ownership and expiry discipline  
**So that** the system does not accumulate flag cruft.

**Acceptance Criteria**
- each flag has owner, purpose, and review/removal date
- flag type is recorded

---

## E12 — Private Mentoring Notes

### Story E12-S1 — Mentor can create private mentoring note
**As a** mentor  
**I want** to record private mentoring notes  
**So that** I can preserve context not suitable for general visibility.

**Acceptance Criteria**
- note visibility is restricted
- district-wide default access is denied
- note is not included in district KPI aggregates by default

---

## 6. Recommended Build Sequence

### Phase 1 — Platform skeleton
- E1 Identity and Access
- E2 Lodge and District Administration
- E3 Passport Template and Core Data

### Phase 2 — Core user journey
- E4 Passport Record Entry
- E5 Verification Workflow

### Phase 3 — Operational usefulness
- E6 Notifications
- E7 Lodge Dashboards
- E9 Audit and Admin Corrections

### Phase 4 — District readiness
- E8 District Analytics
- E10 Reporting and Export
- E11 Feature Flag and Rollout Controls

### Phase 5 — Controlled enhancements
- E12 Private Mentoring Notes

---

## 7. Definition of Done for MVP

The MVP is done when:
1. a Brother can sign in and see his passport;
2. a Lodge Admin can onboard a Brother and assign mentors;
3. a Brother can create and submit a passport entry;
4. a mentor can verify, reject, or request clarification;
5. the Lodge Mentor can see pending/stale items across the lodge;
6. the district can see cross-lodge analytics;
7. all critical actions are audited;
8. the system runs end-to-end without manual database intervention.

---

## 8. Explicit Non-MVP Items

These should not delay MVP unless a strong operational reason emerges:
- deep Solomon integration
- offline-first sync
- attachments/evidence files
- public API exposure
- microservice extraction
- micro frontend decomposition
- advanced experimentation frameworks

---

## 9. Final Backlog Position

The correct MVP backlog is:

> **A sequence of end-to-end vertical slices that proves the system can onboard users, capture governed progress, verify it properly, and provide lodge and district oversight without architectural guesswork.**
