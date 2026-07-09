---
type: success-criteria
title: Success Criteria
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: active
sensitivity: internal
---

# Success Criteria

## Functional

1. A Brother signs in and sees only his own active Passport stage and locked future stages.
2. A Brother creates, saves, submits, and resubmits a milestone progress item.
3. A Personal Mentor sees assigned Brothers and no unassigned Brothers unless another role grants access.
4. A Mentor verifies, rejects, or requests clarification; the Brother sees the outcome and reason.
5. The system records mentor sessions, visitations, rituals performed, and section sign-off without storing ritual wording.
6. Lodge Mentor views all Lodge Brothers and assigns/reassigns Personal Mentors.
7. District Mentor views cross-lodge metrics without inappropriate write access.
8. Every review, stage transition, export, and role change creates an audit event.

## Technical

1. Android build passes (`./gradlew.bat assembleDebug`).
2. Backend tests pass from clean checkout.
3. OpenAPI contract is generated and matches Android DTOs.
4. Seed data creates at least two lodges, multiple roles, and sample Brothers in EA/FC/MM states.

## Security and privacy

1. Brother cannot view another Brother's passport.
2. Lodge cannot view another Lodge's data.
3. Mentor cannot review unassigned Brother unless Lodge role permits.
4. No restricted ritual wording or sensitive unnecessary personal data in code, seed, screenshots, or tests.
