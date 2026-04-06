# DGLEA Masonic Passport — Test Strategy

**Document Status:** Draft v1  
**Intended Repository Use:** Save as `.md` in GitHub  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06  

---

## 1. Purpose

This document defines the **test strategy** for the DGLEA Masonic Passport platform.

The goal is to keep testing proportionate, meaningful, and aligned to the product’s real risk.

This is not a generic QA checklist. The platform’s highest-value risks are:

- incorrect permissions;
- incorrect lodge/district scope;
- incorrect verification workflow behaviour;
- destructive correction of verified records;
- reporting and analytics that misrepresent progress;
- feature-flag rollout mistakes.

The test strategy therefore prioritises those risks first.

---

## 2. Quality Position

The system should be treated as a **governed workflow platform**, not a casual content app.

That means correctness matters more than visual flourish in the early stages.

The most dangerous failure is not a minor UI quirk.  
It is false or unauthorised progress truth.

---

## 3. Testing Objectives

1. verify that permissions behave correctly;
2. verify that workflow states transition correctly;
3. verify that district/lodge boundaries are preserved;
4. verify that verified truth is auditable and not silently overwritten;
5. verify that analytics and reports reflect correct operational meaning;
6. verify that feature-flag rollout does not create uncontrolled behaviour divergence.

---

## 4. Test Pyramid Position

### 4.1 Recommended Distribution
Bias toward:
- **many unit tests**
- **meaningful integration tests**
- **a smaller number of end-to-end tests for core user journeys**

### 4.2 Why
The platform’s core risk is in business rules.  
That means backend service/domain tests should carry the most weight.

---

## 5. Test Levels

## 5.1 Unit Tests
Purpose:
- validate domain logic and small application behaviours in isolation

Target areas:
- permission evaluators
- workflow transition guards
- readiness calculation helpers
- feature-flag targeting logic
- notification routing rules
- validation rules

## 5.2 Integration Tests
Purpose:
- validate module interactions, persistence, and policy enforcement

Target areas:
- API + DB interaction
- role and scope enforcement
- record submission and verification persistence
- audit event generation
- read model / projection updates
- report generation logic

## 5.3 End-to-End Tests
Purpose:
- validate a small number of critical whole-system journeys

Target journeys:
- Brother creates and submits item
- mentor verifies item
- mentor requests clarification and Brother resubmits
- Lodge Mentor override
- Lodge Admin onboard flow
- District Mentor analytics flow

## 5.4 Exploratory / Manual Testing
Purpose:
- validate UX clarity
- catch role-specific surprises
- verify real navigation and edge cases during pilot rollout

---

## 6. Test Domains

## 6.1 Permissions and Scope Testing
This is the highest-priority domain.

### Must prove:
- Brother cannot access another Brother’s records
- Personal Mentor can access assigned Brothers only
- Lodge Mentor can access only lodge-scoped records
- District Mentor sees analytics scope, not unrestricted private notes
- District Admin access is auditable

### Suggested test matrix
- same-role same-lodge
- same-role different-lodge
- multi-role user
- missing assignment
- expired assignment
- disabled user
- admin override path

---

## 6.2 Verification Workflow Testing
The second highest-priority domain.

### Must prove:
- only valid states can transition
- only authorised actors can trigger those transitions
- verified records become official progress
- rejected records do not count as official progress
- clarification requests preserve history
- override requires reason and audit
- supersede preserves old truth rather than destroying it

### Required state transition coverage
- `draft -> submitted`
- `submitted -> verified`
- `submitted -> rejected`
- `submitted -> needs_clarification`
- `needs_clarification -> submitted`
- `needs_clarification -> verified`
- `rejected -> revised submission path`
- `verified -> superseded`
- `* -> overridden` where allowed

---

## 6.3 Data Integrity Testing

### Must prove:
- district core templates and lodge supplements remain distinguishable
- template changes do not corrupt historical record meaning
- audit event creation is reliable
- record version history is preserved
- stale queue logic is accurate
- reports are generated from correct scope

---

## 6.4 Notification Testing

### Must prove:
- notifications are created on meaningful transitions
- intended recipients are correct
- duplicate notifications are avoided where possible
- failures are visible operationally
- user read state works

---

## 6.5 Analytics and Reporting Testing

### Must prove:
- dashboards show correct counts
- `submitted` is not treated as equivalent to `verified`
- clarification items are not miscounted as failures by default
- district drill-down obeys role limits
- exports reflect correct scope and date ranges

---

## 6.6 Feature Flag Testing

### Must prove:
- default flag state behaves correctly
- targeted lodge/role rollout behaves correctly
- disabled feature fails safely
- old behaviour remains intact when flag is off
- each non-trivial flag has defined coverage expectations

---

## 7. Recommended Test Suites

## 7.1 Backend Unit Test Suites
- permission policy tests
- workflow state machine tests
- verification service tests
- mentor assignment rule tests
- feature-flag evaluation tests
- reporting calculation tests

## 7.2 Backend Integration Test Suites
- auth and current-user tests
- member profile CRUD tests
- submission workflow tests
- verification/rejection/clarification tests
- audit persistence tests
- dashboard projection tests
- feature-flag targeted behaviour tests

## 7.3 Client Tests
### Android
- view model tests
- navigation tests for key flows
- form validation tests
- role-adaptive visibility tests

### Web
- role-based route access tests
- summary/dashboard rendering tests
- admin configuration flow tests

## 7.4 End-to-End Suites
Keep these small and meaningful.

Recommended MVP E2E journeys:
1. Brother sign in -> create draft -> submit
2. Personal Mentor sign in -> verify assigned submission
3. Brother resubmits after clarification
4. Lodge Mentor override
5. Lodge Admin creates member and assigns mentor
6. District Mentor views analytics

---

## 8. Test Data Strategy

### 8.1 Required Seed Data
You need seeded test data for:
- district
- multiple lodges
- users in each role
- assigned mentors
- unassigned Brothers
- district core passport items
- lodge supplement items
- records in every major workflow state

### 8.2 Why
Without realistic fixtures, permission and analytics tests become weak or misleading.

### 8.3 Recommended Fixture Scenarios
- Brother with Personal Mentor
- Brother without Personal Mentor
- Lodge Mentor with many pending items
- multi-role user
- district user with analytics only
- verified/superseded history chain
- stale submissions

---

## 9. Environment Strategy

## 9.1 Local Development
Used for:
- unit tests
- local integration tests
- fast developer feedback

## 9.2 Shared Test / Staging
Used for:
- integration test runs
- E2E smoke tests
- pilot acceptance testing
- release candidate verification

## 9.3 Production
Used only for:
- production smoke checks
- monitoring-based validation
- controlled release verification

---

## 10. Release Testing Strategy

### 10.1 Before Pilot Lodge Release
Must verify:
- auth
- role scope
- submission flow
- verification flow
- notifications
- lodge dashboard
- district analytics basics
- audit logging

### 10.2 Before Wider District Rollout
Must verify:
- feature-flag targeting
- performance under realistic district data
- export/report behaviour
- support/admin correction flow
- lodge configuration handling

---

## 11. Non-Functional Test Areas

## 11.1 Security
- auth/session handling
- permission bypass attempts
- IDOR-style access attempts
- role spoofing attempts
- private note access control

## 11.2 Performance
Focus on:
- dashboard load
- queue load
- report generation
- common list endpoints
- verification action response time

## 11.3 Reliability
Focus on:
- notification job retries
- DB backup/restore confidence
- stale job visibility
- audit persistence under failure conditions

---

## 12. Manual Acceptance Testing by Role

## 12.1 Brother
- can sign in
- can see own passport
- can create and submit item
- can understand next action after clarification or rejection

## 12.2 Personal Mentor
- can see assigned Brothers only
- can review and act on pending items
- can understand workflow outcome clearly

## 12.3 Lodge Mentor
- can manage lodge queue
- can act as fallback verifier
- can override with explicit reason

## 12.4 Lodge Admin
- can onboard Brother
- can assign mentor
- can update lodge configuration safely

## 12.5 District Mentor
- can see meaningful district analytics without overexposed raw detail

---

## 13. Regression Priorities

Every release should at minimum re-run regression around:
1. auth and session
2. role/scope enforcement
3. draft creation
4. submission
5. verify / reject / clarification
6. audit generation
7. dashboard counts
8. feature-flag gated behaviour

---

## 14. Explicit Anti-Patterns

Do **not** do the following:

1. do not rely only on manual UI testing
2. do not treat happy-path verification as sufficient coverage
3. do not skip cross-lodge permission tests
4. do not test feature flags only in the “on” state
5. do not treat exported reports as trusted without validation
6. do not let analytics tests ignore workflow state semantics

---

## 15. Definition of Quality for MVP

The MVP is test-acceptable when:
- core workflows behave correctly
- permissions are trustworthy
- audit truth is preserved
- dashboards are meaningfully correct
- rollout can be controlled safely
- the platform can be piloted without manual data repair becoming routine

---

## 16. Final Test Position

The correct test strategy is:

> **Heavy on backend rule correctness, strong on permissions and workflow coverage, selective on end-to-end flows, and always biased toward proving trust in the system’s operational truth.**
