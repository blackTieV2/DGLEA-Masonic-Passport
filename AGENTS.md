# AGENTS.md

## Project Identity

You are working in the repository for **DGLEA Masonic Passport**.

This repository is for a **district-governed mentoring and progression platform** for the District Grand Lodge of the Eastern Archipelago (DGLEA), intended for use across approximately **45 lodges**.

This is **not** just an Android app. It is a platform with:
- Android mobile app
- Web admin portal
- Modular-monolith backend
- Relational database
- Background worker capability
- Notifications
- Reporting and district analytics
- Audit and governance controls

---

## Read These First

Before making architectural or implementation decisions, read these documents:

### Product
- `docs/01-product/DGLEA_Masonic_Passport_PRD_v2_1.md`
- `docs/01-product/DGLEA_Masonic_Passport_SRS_v2_1.md`
- `docs/01-product/DGLEA_Masonic_Passport_MVP_Backlog_Epics_User_Stories_Acceptance_Criteria_v1.md`

### Architecture
- `docs/02-architecture/DGLEA_Masonic_Passport_Technical_Architecture_ADR_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_System_Context_and_Container_Diagrams_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Domain_Model_ERD_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Permissions_Matrix_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Verification_Workflow_State_Diagram_v1.md`

### API
- `docs/03-api/DGLEA_Masonic_Passport_OpenAPI_Contract_Outline_v1.md`

### UX
- `docs/04-ux/DGLEA_Masonic_Passport_Screen_Map_and_Navigation_v1.md`

### Testing
- `docs/05-testing/DGLEA_Masonic_Passport_Test_Strategy_v1.md`

If there is ambiguity, prefer:
1. permissions matrix
2. verification workflow document
3. architecture / ADR document
4. SRS
5. PRD

Do not silently invent major behaviour that contradicts those documents.

---

## Hard Architectural Constraints

These are non-negotiable for v1:

- Use a **modular monolith**
- Do **not** use microservices
- Do **not** use micro frontends
- Keep Android and web admin as separate clients over a shared backend
- Keep business rules in backend application/domain layers
- Use a relational database as the primary system of record
- Enforce role-based access and lodge/district scope in the backend
- Treat verification as an explicit governed workflow
- Preserve historical truth
- Do not destructively overwrite verified records
- Keep district core passport items distinct from lodge supplements
- Keep private mentoring notes segregated from ordinary operational progress data
- Do not store ritual secrets or full ritual text in the platform
- Do not optimise for speculative scale ahead of correctness

---

## Domain Truths You Must Respect

The following are foundational:

- The system supports approximately **45 lodges**
- Lodges exist inside a district-governed structure
- The district core passport has **four sections**:
  1. Entered Apprentice
  2. Fellow Craft
  3. Master Mason and Beyond
  4. Preparing for Office
- Lodge supplements may exist, but must not break district comparability
- A self-submitted record is **not** official progress until verified
- The Lodge Mentor is the operational fallback / override verifier where policy allows
- The District Mentor is primarily an **analytics and oversight role**, not a default daily approver
- Some lodges may not actively use a Personal Mentor for every Brother, so the workflow must not depend exclusively on that role

---

## Core Roles

Use these canonical roles unless a document explicitly extends them:

- `BROTHER`
- `PERSONAL_MENTOR`
- `LODGE_MENTOR`
- `LODGE_REVIEWER`
- `LODGE_ADMIN`
- `DISTRICT_MENTOR`
- `DISTRICT_ADMIN`
- `SYSTEM_ADMIN`

Do not casually rename roles once implementation begins.

---

## Core Workflow States

Use these canonical record workflow states unless the docs are formally revised:

- `DRAFT`
- `SUBMITTED`
- `NEEDS_CLARIFICATION`
- `VERIFIED`
- `REJECTED`
- `OVERRIDDEN`
- `SUPERSEDED`
- `ARCHIVED`

Do not blur these states.
Do not treat `SUBMITTED` as equivalent to `VERIFIED`.

---

## Backend Module Structure

The backend must remain organised by **business capability**.

Use these top-level modules:

- `identity-access`
- `lodge-district-admin`
- `member-profile`
- `passport`
- `mentor-assignment`
- `verification-workflow`
- `notifications`
- `reporting-analytics`
- `audit`
- `configuration`

Avoid top-level organisation that is only:
- controllers
- services
- models
- repositories

Layering inside modules is fine. Business capability must remain the primary structure.

---

## Coding Rules

### General
- Prefer explicit names over clever names
- Keep code production-minded
- Keep code typed where the language supports it
- Keep files and modules small enough to be understood
- Write code that is easy to test
- Avoid unnecessary abstraction
- Avoid speculative infrastructure

### Business Logic
- Put business rules in domain/application layers
- Do not put important workflow logic primarily in controllers
- Do not put important workflow logic primarily in UI code
- Make state transitions explicit
- Make permission decisions explicit
- Make audit events explicit

### Persistence
- Preserve historical truth
- Avoid destructive updates to verified data
- Keep audit trails first-class
- Keep district core vs lodge supplement distinction explicit in the schema
- Keep private mentoring notes separate from normal workflow records

### API
- Keep APIs explicit and domain-oriented
- Prefer workflow endpoints over vague generic update behaviour
- Enforce permissions server-side
- Use consistent error shapes
- Keep naming aligned with the OpenAPI contract and glossary

### UI
- Android is task-focused
- Web admin is administration- and oversight-focused
- Do not let the UI become the source of truth
- Do not expose irrelevant actions to roles that cannot use them

---

## Testing Expectations

Bias toward:
- unit tests for business rules
- integration tests for workflow and persistence
- a smaller set of meaningful end-to-end tests

The highest-priority test areas are:
1. permissions and scope
2. verification workflow state transitions
3. audit generation
4. district/lodge boundary enforcement
5. reporting and analytics correctness
6. feature-flag targeting

When implementing a new feature, add or update tests for:
- allowed behaviour
- denied behaviour
- invalid workflow state transitions
- cross-scope access attempts
- audit implications where relevant

---

## Feature Flags

Feature flags are allowed, but must be governed.

Allowed categories:
- release toggles
- ops toggles
- permission toggles

Every feature flag must have:
- clear purpose
- owner
- default state
- review/removal date if temporary

Do not allow feature flags to become permanent substitutes for proper authorisation or design decisions.

---

## Change Discipline

When making changes:

1. Read the relevant docs first
2. State your assumptions clearly if anything is ambiguous
3. Prefer minimal, architecture-aligned changes
4. Keep changes reviewable
5. Update docs when implementation changes the truth
6. Do not silently drift away from the agreed architecture

If you find contradictions:
- list them clearly
- propose the smallest viable resolution
- do not hide the contradiction in code

---

## Anti-Patterns to Avoid

Do **not** do the following:

- do not introduce microservices for v1
- do not introduce micro frontends
- do not treat admin roles as unrestricted mentoring authority
- do not expose district-wide private mentoring notes
- do not collapse template data and instance data without clarity
- do not collapse draft/submitted/verified states
- do not rely on generic CRUD where workflow endpoints are required
- do not let controllers become the main home of business rules
- do not let the mobile app enforce permissions by itself
- do not invent event buses or distributed systems without explicit need
- do not rename entities or states casually after implementation starts

---

## Preferred Build Order

When starting from documentation into code, prefer this order:

1. freeze canonical names
2. formalise OpenAPI
3. scaffold backend modules
4. scaffold Android and web admin apps
5. create DB migrations and seeds
6. create test skeletons
7. implement auth and scope enforcement
8. implement passport draft/submission flow
9. implement mentor verification flow
10. implement dashboards, reporting, and controlled rollout features

---

## Definition of Good Progress

Good progress means:
- clearer system boundaries
- more consistent naming
- more explicit workflow logic
- stronger permission enforcement
- better tests around important business rules
- cleaner module boundaries
- less ambiguity for future contributors

Not all progress is feature count.

---

## Final Instruction

If forced to choose, always prefer:

> **clarity, correctness, auditability, and maintainability over speed, cleverness, and speculative complexity**