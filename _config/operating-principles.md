---
type: config
title: Operating Principles
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Operating Principles

## Hard architectural constraints

These are non-negotiable for v1:

- Use a **modular monolith**.
- Do **not** use microservices.
- Do **not** use micro frontends.
- Keep Android and web admin as separate clients over a shared backend.
- Keep business rules in backend application/domain layers.
- Use a relational database as the primary system of record.
- Enforce role-based access and lodge/district scope in the backend.
- Treat verification as an explicit governed workflow.
- Preserve historical truth.
- Do not destructively overwrite verified records.
- Keep district core passport items distinct from lodge supplements.
- Keep private mentoring notes segregated from ordinary operational progress data.
- Do not store ritual secrets or full ritual text in the platform.
- Do not optimise for speculative scale ahead of correctness.

## Domain truths

- The system supports approximately **45 lodges**.
- Lodges exist inside a district-governed structure.
- The district core passport has **four sections**:
  1. Entered Apprentice
  2. Fellow Craft
  3. Master Mason and Beyond
  4. Preparing for Office
- Lodge supplements may exist, but must not break district comparability.
- A self-submitted record is **not** official progress until verified.
- The Lodge Mentor is the operational fallback / override verifier where policy allows.
- The District Mentor is primarily an **analytics and oversight role**, not a default daily approver.
- Some lodges may not actively use a Personal Mentor for every Brother, so the workflow must not depend exclusively on that role.

## Change discipline

When making changes:

1. Read the relevant docs first.
2. State assumptions clearly if anything is ambiguous.
3. Prefer minimal, architecture-aligned changes.
4. Keep changes reviewable.
5. Update docs when implementation changes the truth.
6. Do not silently drift away from the agreed architecture.

If contradictions are found:

- List them clearly.
- Propose the smallest viable resolution.
- Do not hide the contradiction in code.

## Feature flags

Feature flags are allowed only as:

- release toggles
- ops toggles
- permission toggles

Every flag must have:

- clear purpose
- owner
- default state
- review/removal date if temporary

Do not use feature flags as permanent substitutes for proper authorisation or design decisions.

## Anti-patterns to avoid

- Do not introduce microservices for v1.
- Do not introduce micro frontends.
- Do not treat admin roles as unrestricted mentoring authority.
- Do not expose district-wide private mentoring notes.
- Do not collapse template data and instance data without clarity.
- Do not collapse draft/submitted/verified states.
- Do not rely on generic CRUD where workflow endpoints are required.
- Do not let controllers become the main home of business rules.
- Do not let the mobile app enforce permissions by itself.
- Do not invent event buses or distributed systems without explicit need.
- Do not rename entities or states casually after implementation starts.

## Preferred build order

1. Freeze canonical names.
2. Formalise OpenAPI.
3. Scaffold backend modules.
4. Scaffold Android and web admin apps.
5. Create DB migrations and seeds.
6. Create test skeletons.
7. Implement auth and scope enforcement.
8. Implement passport draft/submission flow.
9. Implement mentor verification flow.
10. Implement dashboards, reporting, and controlled rollout features.

## Definition of good progress

Good progress means:

- clearer system boundaries
- more consistent naming
- more explicit workflow logic
- stronger permission enforcement
- better tests around important business rules
- cleaner module boundaries
- less ambiguity for future contributors

Not all progress is feature count.

## Final instruction

If forced to choose, always prefer:

> **clarity, correctness, auditability, and maintainability over speed, cleverness, and speculative complexity**
