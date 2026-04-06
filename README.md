
````md
# DGLEA Masonic Passport

A district-governed mentoring and progression platform for the District Grand Lodge of the Eastern Archipelago (DGLEA).

## Project Purpose

DGLEA Masonic Passport digitises the district passport and mentoring workflow across approximately 45 lodges.

This is **not** just an Android app. It is a platform consisting of:

- Android mobile app for Brothers and mentors
- Web admin portal for lodge and district oversight
- Modular-monolith backend
- Relational system-of-record database
- Notification and reporting capability
- Audit and district analytics

## Product Position

The platform exists to support:

- Brother progression tracking
- Personal Mentor and Lodge Mentor workflow
- Lodge-level oversight
- District-level analytics and reporting
- Auditable verification of progress records

The platform must preserve the district core passport structure while allowing controlled lodge supplements.

## Hard Architectural Constraints

These are non-negotiable for v1:

- Modular monolith backend
- No microservices
- No micro frontends
- Android app and web admin over a shared backend
- Backend-owned business rules
- Relational database as primary system of record
- Role-based access and lodge/district tenancy enforced in the backend
- Explicit governed verification workflow
- Self-submitted records are **not** official until verified
- Verified records must not be destructively overwritten
- District core items must remain distinct from lodge supplements
- Private mentoring notes must remain segregated from general progress data
- No ritual secrets or full ritual text stored in the platform

## Core User Roles

- Brother / Candidate / Mason
- Personal Mentor
- Lodge Mentor
- Lodge Leadership Reviewer
- Lodge Admin / Secretary
- District Mentor
- District Admin
- System Admin

## Passport Structure

The platform is built around four district core sections:

1. Entered Apprentice
2. Fellow Craft
3. Master Mason and Beyond
4. Preparing for Office

## Repository Structure

```text
docs/        Product, architecture, API, UX, testing, and ops documentation
apps/        Android app and web admin portal
backend/     Modular-monolith backend
shared/      Stable shared contracts, enums, validation, fixtures
infra/       Local/staging/prod infrastructure and scripts
scripts/     Setup, CI, dev, release helper scripts
````

## Key Documentation

### Product

* `docs/01-product/DGLEA_Masonic_Passport_PRD_v2_1.md`
* `docs/01-product/DGLEA_Masonic_Passport_SRS_v2_1.md`
* `docs/01-product/DGLEA_Masonic_Passport_MVP_Backlog_Epics_User_Stories_Acceptance_Criteria_v1.md`

### Architecture

* `docs/02-architecture/DGLEA_Masonic_Passport_Technical_Architecture_ADR_v1.md`
* `docs/02-architecture/DGLEA_Masonic_Passport_System_Context_and_Container_Diagrams_v1.md`
* `docs/02-architecture/DGLEA_Masonic_Passport_Domain_Model_ERD_v1.md`
* `docs/02-architecture/DGLEA_Masonic_Passport_Permissions_Matrix_v1.md`
* `docs/02-architecture/DGLEA_Masonic_Passport_Verification_Workflow_State_Diagram_v1.md`

### API

* `docs/03-api/DGLEA_Masonic_Passport_OpenAPI_Contract_Outline_v1.md`

### UX

* `docs/04-ux/DGLEA_Masonic_Passport_Screen_Map_and_Navigation_v1.md`

### Testing

* `docs/05-testing/DGLEA_Masonic_Passport_Test_Strategy_v1.md`

## Engineering Principles

* Prefer explicit names over clever names
* Build vertical slices, not disconnected layers
* Put business rules in domain/application logic, not controllers or UI
* Preserve historical truth
* Keep permission and workflow logic testable
* Start simple and production-minded
* Do not introduce speculative complexity

## Recommended Build Order

1. Freeze naming and workflow states
2. Formalise OpenAPI
3. Scaffold backend modules
4. Scaffold Android app
5. Scaffold web admin portal
6. Add DB migrations and seed data
7. Add backend unit and integration tests
8. Implement core auth and scope rules
9. Implement passport draft and submission flow
10. Implement mentor verification flow

## Definition of MVP

The MVP is successful when:

* a Brother can sign in and view his passport
* a Lodge Admin can onboard a Brother and assign mentors
* a Brother can create and submit a passport record
* an authorised mentor can verify, reject, or request clarification
* the Lodge Mentor can manage the lodge queue
* the District Mentor can view district analytics
* critical actions are audited
* the system works end-to-end without manual database intervention

## Anti-Patterns to Avoid

* Generic CRUD without workflow meaning
* UI-owned business truth
* Treating submitted as verified
* Admin equals unrestricted mentoring authority
* District-wide exposure of private notes
* Microservices or micro frontends in v1
* Schema drift caused by inconsistent naming

## Status

This repository is in initial implementation setup phase.

The immediate goal is to establish:

* canonical names
* formal API contract
* repo scaffolding
* backend modular boundaries
* test skeletons
* seed data model

before deeper feature implementation begins.

````

