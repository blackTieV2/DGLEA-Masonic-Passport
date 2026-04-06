# DGLEA Masonic Passport — Product Requirements Document (PRD)

**Document Status:** Draft for product and architecture alignment  
**Version:** 2.1  
**Date:** 2026-04-06  
**Intended Repository Format:** Markdown (`.md`)  
**Primary Delivery Target:** Android-first product with supporting web administration and backend services

---

## 1. Purpose of This Document

This PRD defines the product requirements for the **DGLEA Masonic Passport**, a district-wide mentoring and progression platform intended to digitise the existing paper-based Masonic Passport and support mentoring operations across approximately **45 lodges**.

This document is written to be practical for:
- product planning
- system architecture
- UI/UX design
- backlog creation
- implementation in ChatGPT Codex
- GitHub project tracking

It is intentionally opinionated where necessary. A vague PRD would create ambiguity, poor engineering decisions, and rework.

---

## 2. Critical Review of the Earlier PRD

The earlier PRD was directionally sound, but not yet strong enough for real product delivery. The following weaknesses had to be corrected.

### 2.1 It described an "app" when the project is actually a platform

The original framing leaned too heavily toward a mobile application. That is incomplete.

A district-wide mentoring system across 45 lodges requires:
- a mobile experience for Brothers and mentors
- an administrative interface for lodge and district oversight
- a secure backend
- notifications
- audit trails
- analytics
- role and tenancy controls

**Correction:** This PRD defines the product as an **Android-first platform**, not a mobile-only app.

### 2.2 It underestimated role complexity

The earlier role model focused mainly on:
- Mason
- Personal Mentor
- Lodge Mentor
- District Mentor

That is not enough for production. Lodge leadership and administrative roles materially affect the workflow.

**Correction:** The supported role model now includes:
- Brother / Candidate / Mason
- Personal Mentor
- Lodge Mentor
- Lodge Leadership Reviewer
- Lodge Administrator / Secretary
- District Mentor
- District Administrator / System Administrator

### 2.3 It assumed overly broad visibility

The earlier logic that "everyone can view" is not acceptable for a district-wide product. It creates privacy, governance, and trust problems, especially where mentor notes, readiness judgments, and incomplete submissions are involved.

**Correction:** Visibility is now **role-based** and constrained by lodge and district boundaries.

### 2.4 It treated self-recorded dates as if they were operationally sufficient

A Brother clicking a date is not the same as a verified mentoring record. If this distinction is blurred, the system becomes unreliable and political rather than useful.

**Correction:** The data model now separates:
- draft
- submitted
- verified
- rejected
- superseded

### 2.5 It did not sufficiently protect the product from scope creep

There is a clear danger that the product could drift into:
- ritual management
- esoteric content storage
- social networking
- general lodge administration
- document management

That would dilute the product and slow delivery.

**Correction:** This PRD explicitly defines non-goals and guards the product against expansion into unrelated domains.

### 2.6 It did not clearly distinguish district standards from lodge flexibility

The source material makes clear that the district provides a structured mentoring framework, but lodges retain room to supplement and adapt.

**Correction:** The product must preserve a **district core structure** while allowing **controlled local configuration**.

---

## 3. Product Overview

### 3.1 Product Name

**DGLEA Masonic Passport**

### 3.2 Product Vision

To provide DGLEA with a secure, simple, and trustworthy mentoring platform that:
- digitises the district-approved Masonic Passport
- supports personal and lodge mentoring workflows
- allows lodges to gauge the progress of newer Masons
- gives district leadership meaningful analytics across all participating lodges
- preserves the mentoring intent of the existing paper process rather than replacing it with bureaucracy

### 3.3 Product Positioning

This product is **not** intended to replace:
- the human relationship between mentor and mentee
- lodge culture
- Solomon
- ritual books
- broader lodge administration tools

It is intended to provide **structure, continuity, visibility, and verified progress tracking**.

### 3.4 Technical Delivery Principles

These are product-level delivery constraints intended to prevent the project from drifting into unnecessary architectural complexity.

1. **Modular monolith first.** v1 shall be delivered as a **modular monolith** with clear internal module boundaries aligned to business capabilities.
2. **Separate clients over a shared backend.** The Android app and web administration experience shall be separate clients over a shared backend and shared domain rules.
3. **No microservices in v1.** The product shall **not** begin as a distributed microservice ecosystem.
4. **No micro frontends in v1.** The product shall **not** split the admin or user experience into multiple independently deployed frontend estates.
5. **Feature flags are allowed, but controlled.** Feature flags may be used for pilot lodges, canary rollout, district-only features, and operational rollback of non-critical functions; they must not become a substitute for core authorisation or long-term architecture.
6. **Business-capability boundaries matter.** The initial internal product capabilities should at minimum distinguish Identity & Access, Lodge & District Administration, Passport, Mentor Assignment, Verification Workflow, Notifications, Reporting & Analytics, and Audit.

These constraints are not implementation trivia. They are there to stop Codex or future developers from filling in the blanks with premature distribution and unnecessary operational complexity.

---

## 4. Source-Aligned Product Principles

The following principles are not generic software slogans. They are drawn from the real operating intent of the paper passport and mentor materials.

### 4.1 Mentoring first, software second

The product exists to support mentoring, not to turn mentoring into clerical work.

### 4.2 District standards with lodge flexibility

The district defines the core framework. Lodges may supplement it, but should not break comparability or governance.

### 4.3 Verified progress over vanity metrics

Progress must mean something. Unverified self-clicked activity must not be treated as equal to verified mentoring progress.

### 4.4 Low friction or low adoption

If submitting or verifying an item feels like admin, usage will collapse.

### 4.5 Analytics without inappropriate intrusion

District-level oversight should focus on progress, adoption, exceptions, and health of the programme. It should not default to exposing every raw note from every Brother.

### 4.6 No secret ritual content

The product must remain aligned with the district material, which frames the passport as a structured guide and log book, not a container for secrets or ritual text.

---

## 5. Problem Statement

The current paper-based process provides structure, but it is difficult to manage consistently across 45 lodges. The current model makes it hard to:

- know whether mentoring is actually happening
- identify Brothers who have stalled
- verify progress in a timely way
- preserve continuity when mentors change
- help lodge leadership assess readiness for passing, raising, and early office
- produce district-wide visibility and reporting
- compare programme health across lodges
- maintain trustworthy records over time

The product must solve those problems without becoming intrusive, cumbersome, or doctrinally over-engineered.

---

## 6. Goals

### 6.1 Primary Goals

1. Digitise the district Masonic Passport faithfully.
2. Support both Personal Mentor and Lodge Mentor workflows.
3. Enable trusted submission and verification of progress items.
4. Provide each lodge with a clear view of mentoring progress and readiness.
5. Provide the district with analytics across all participating lodges.
6. Keep the product easy enough for ordinary lodge users, not just technical users.
7. Preserve flexibility for lodges that do not assign Personal Mentors in every case.

### 6.2 Secondary Goals

1. Improve continuity when officers or mentors change.
2. Encourage more regular mentor engagement.
3. Support annual lodge and district reporting.
4. Surface non-participation, bottlenecks, and overdue verification.
5. Lay the foundation for future integration with Solomon or district communications.

---

## 7. Non-Goals

The following are explicitly out of scope for v1 unless later approved as separate workstreams.

1. Storing secret ritual content.
2. Becoming a ritual learning repository.
3. General lodge secretary functions.
4. Finance, dues, and payments.
5. Candidate application processing end-to-end.
6. Messaging or social networking between all users.
7. Full document management.
8. Replacing Solomon.
9. Managing Royal Arch or appendant body progression in v1.
10. Tracking sensitive pastoral, disciplinary, or almoner matters.
11. Delivering v1 as a distributed microservice or micro-frontend architecture.

This matters because product failure often begins when "one useful app" is asked to become "the system for everything."

---

## 8. Target Users and Roles

### 8.1 Brother / Candidate / Mason
The primary end user. Records attendance, mentoring interactions, milestones, and submits progress items for verification.

### 8.2 Personal Mentor
Supports the Brother directly. Reviews and verifies relevant submitted items where lodge policy permits.

### 8.3 Lodge Mentor
Coordinates mentoring within the lodge. Oversees progress, assignments, verification workflow, and lodge-level reporting.

### 8.4 Lodge Leadership Reviewer
A read-focused role for Worshipful Master and selected lodge leadership who need summary visibility for governance and readiness decisions.

### 8.5 Lodge Administrator / Secretary
Handles member setup, role assignment, lodge-level configuration, record transfer, and administrative corrections.

### 8.6 District Mentor
Views district-wide metrics, lodge-level trends, exceptions, and annual progress indicators.

### 8.7 District Administrator / System Administrator
Manages lodge onboarding, district configuration, support operations, and system governance.

---

## 9. Product Scope

### 9.1 In Scope for v1

- authentication and role assignment
- lodge and district tenancy
- digital passport structure
- Brother submissions
- mentor verification
- lodge-level dashboards
- district-level analytics
- notifications
- audit trail
- exportable reporting
- configurable district core plus controlled lodge extensions

### 9.2 Desirable but Not Required for v1

- Solomon deep links
- templated nudges and reminders
- read-only web dashboard for senior users
- lodge-specific custom sections
- attachment support for evidence
- data export API

---

## 10. Core Product Model

### 10.1 Passport Sections

The product shall preserve the district structure of the passport:

1. **Entered Apprentice**
2. **Fellow Craft**
3. **Master Mason and Beyond**
4. **Preparing for Office**

Each section may contain:
- learning outcomes
- mentor sessions
- visitations
- rituals performed
- additional notes
- completion dates
- mentor attribution
- section completion state

### 10.2 Consolidation Model

The product shall also support a consolidation view showing totals for:
- mentoring sessions
- visitations
- rituals performed
- section completion progress

This is necessary because the paper passport includes a summary/consolidation intent that is operationally useful for both lodge and district visibility.

---

## 11. User Needs

### 11.1 Brother / Candidate Needs

The Brother needs to:
- know what is expected next
- log progress quickly
- see what is complete, pending, or overdue
- understand which mentor is responsible
- feel guided, not judged
- trust that the system reflects his real progress

### 11.2 Personal Mentor Needs

The Personal Mentor needs to:
- see only the Brothers he is responsible for
- review pending submissions quickly
- add comments where helpful
- track whether mentoring is happening consistently
- avoid being buried in admin

### 11.3 Lodge Mentor Needs

The Lodge Mentor needs to:
- see the whole lodge picture
- identify inactive or unsupported Brothers
- intervene where no Personal Mentor is assigned
- monitor pending verifications
- support readiness conversations with lodge leadership
- support annual lodge reporting

### 11.4 District Mentor Needs

The District Mentor needs to:
- see lodge-level participation and progress
- identify weak adoption
- identify overdue verifications and inactive lodges
- compare progress across lodges
- support yearly district reporting
- avoid being pulled into day-to-day operational approvals

---

## 12. Functional Requirements

### 12.1 Identity and Access

The system shall:
- authenticate users securely
- assign roles by lodge and district
- allow a user to hold more than one role if authorised
- enforce role-based permissions
- constrain access to relevant lodge data unless district-level access is explicitly granted

### 12.2 Lodge and District Tenancy

The system shall:
- represent each lodge as a distinct operational unit
- support district-wide reporting across all lodges
- isolate lodge data by default
- allow district roles to view aggregated data across lodges

### 12.3 Member Profile

The system shall store:
- full name
- lodge affiliation
- district affiliation
- current degree stage
- assigned Personal Mentor
- assigned Lodge Mentor
- milestone dates where applicable
- active/inactive status

### 12.4 Passport Record Structure

The system shall support records for:
- learning outcome completion
- mentor sessions
- visitations
- rituals performed
- annual communication attendance
- lodge-specific notes
- section completion
- consolidation totals

### 12.5 Submission Workflow

The system shall allow a Brother to:
- create a new record
- mark a learning item as completed or attended
- submit a record for verification
- edit a draft before submission
- view the status of each submitted item

### 12.6 Verification Workflow

The system shall:
- notify the Personal Mentor and Lodge Mentor when a Brother submits an item
- allow either or both mentor roles to verify depending on lodge policy
- allow rejection with reason
- record who verified an item and when
- preserve the full audit history of changes

### 12.7 Lodge Verification Policy

The system shall support configurable verification rules at lodge level, including:
- Personal Mentor only
- Lodge Mentor only
- either Personal Mentor or Lodge Mentor
- dual verification

**Recommended default for v1:** either Personal Mentor or Lodge Mentor, with Lodge Mentor override.

### 12.8 Dashboards

The system shall provide:

#### Brother Dashboard
- section progress
- pending verification
- upcoming next steps
- assigned mentors
- recent activity

#### Personal Mentor Dashboard
- assigned Brothers
- pending submissions
- verification queue
- recent mentoring activity

#### Lodge Mentor Dashboard
- lodge-wide progress overview
- unsupported Brothers
- overdue verification
- inactivity flags
- readiness candidates
- lodge reporting summary

#### District Dashboard
- all participating lodges
- adoption rate
- completion trends
- inactivity hotspots
- overdue verification by lodge
- comparison view across lodges

### 12.9 Notifications

The system shall support:
- new submission alerts
- verification completed
- verification rejected
- reminder for stale pending items
- mentor assignment change
- inactivity reminder

Notification channels may include:
- in-app
- email
- optional push notifications in later release

### 12.10 Reporting

The system shall support:
- per-Brother progress summary
- lodge mentoring summary
- district-wide annual reporting
- export for committee use
- analytics for adoption and compliance

### 12.11 Audit Trail

The system shall record:
- creation
- edit
- submission
- verification
- rejection
- role changes
- administrative overrides
- exports where appropriate

### 12.12 Configuration

The system shall support:
- district-managed core learning outcomes
- lodge-configurable supplementary items
- lodge verification settings
- role assignment controls
- activation/deactivation of lodges and users

---

## 13. Data States

Every progress item shall have a clear state model.

### 13.1 Required States

- `draft`
- `submitted`
- `verified`
- `rejected`
- `superseded`
- `archived` (admin use only)

### 13.2 Why This Matters

A major design trap is to treat the first recorded date as the truth. That is weak product logic. The system must distinguish between:
- what the Brother says happened
- what the mentor has accepted
- what has been corrected or replaced

Without this, the analytics layer becomes untrustworthy.

---

## 14. Permissions Model

### 14.1 Brother
- view own record
- create and edit own drafts
- submit items
- view verification outcomes
- cannot verify own items
- cannot view other Brothers by default

### 14.2 Personal Mentor
- view assigned Brothers
- verify assigned items where allowed
- comment on records
- cannot administer the lodge unless separately assigned

### 14.3 Lodge Mentor
- view all Brothers in lodge
- verify items
- manage mentor assignments
- see lodge dashboards
- intervene where a Personal Mentor is not assigned

### 14.4 Lodge Leadership Reviewer
- view lodge summaries and readiness dashboards
- no routine editing rights by default

### 14.5 Lodge Administrator
- manage lodge members and mappings
- correct records with audit trail
- configure selected lodge settings

### 14.6 District Mentor
- view district dashboards and lodge comparisons
- drill into lodge-level summaries
- should not, by default, see every raw mentor note across all lodges unless policy explicitly permits it

### 14.7 District Administrator / System Administrator
- full administrative access subject to audit and governance

---

## 15. UX Requirements

### 15.1 Core UX Principles

The UI must be:
- simple
- readable
- respectful
- non-technical
- low-friction
- suitable for users with mixed digital comfort

### 15.2 Mobile Behaviour

The mobile workflow should make common actions possible in a few taps:
- log a mentoring session
- submit a completed item
- verify a pending item
- view section status

### 15.3 Tone and Language

The product language should be:
- plain English
- supportive rather than bureaucratic
- free of unnecessary technical jargon
- aligned with the mentoring purpose of the programme

### 15.4 Accessibility

Minimum expectations:
- large tap targets
- good contrast
- clear status indicators
- support for older devices where feasible
- graceful handling of intermittent connectivity

---

## 16. Non-Functional Requirements

### 16.1 Security
The product must implement:
- secure authentication
- encryption in transit
- encryption at rest
- role-based access control
- lodge-based data segmentation
- audit logging

### 16.2 Performance
The system should target:
- normal dashboard load under 3 seconds
- normal submission or verification interaction under 2 seconds, excluding network conditions

### 16.3 Availability
Target uptime should be sufficient for daily operational use and district reporting. Hosted production target should be no less than 99.5% monthly uptime.

### 16.4 Scalability
The system must support all current lodges and future district growth without redesign of the core data model.

### 16.5 Maintainability
The system architecture should allow:
- change to district core outcomes
- lodge-level configuration
- additional roles if needed
- future extension into web administration and integration layers

### 16.6 Data Integrity
All changes to progress items must be attributable, timestamped, and reversible through controlled administrative processes.

---

## 17. Product Boundaries and Governance

### 17.1 District Core vs Lodge Extensions

The district shall control:
- core passport sections
- default learning outcomes
- district-wide terminology
- standard reporting model

Lodges may be allowed to:
- add supplementary non-secret items
- configure selected workflow settings
- choose verification policy from approved options
- record lodge-specific notes

### 17.2 Governance Risk

If lodge customisation is unrestricted, the district loses comparability and the product becomes fragmented.  
If lodge customisation is too tight, adoption suffers.

**Product stance:** controlled extensibility.

---

## 18. Analytics and Reporting Requirements

### 18.1 Lodge Analytics

Each lodge should be able to see:
- number of active Brothers in each stage
- percentage with assigned Personal Mentor
- percentage with recent mentoring activity
- pending verification count
- stalled progress count
- section completion trend

### 18.2 District Analytics

The district should be able to see:
- participating lodges
- active user count
- programme adoption by lodge
- verification turnaround by lodge
- inactive lodges or low-engagement lodges
- section completion trends
- annual progress summary

### 18.3 Anti-Metric Trap

The product must avoid simplistic analytics such as:
- "most clicks"
- "highest number of submissions"
- "largest number of notes"

These may reward noise rather than mentoring quality.

---

## 19. Success Metrics

### 19.1 Adoption Metrics
- percentage of lodges onboarded
- percentage of active Brothers using the system
- percentage of lodges with configured mentor assignments

### 19.2 Workflow Metrics
- median verification turnaround
- percentage of submitted items verified within SLA
- number of Brothers without any mentor assignment
- number of stale pending items

### 19.3 Programme Health Metrics
- percentage of Brothers with recent mentoring activity
- section completion rates by lodge
- year-on-year district participation trend
- lodge reporting completeness

### 19.4 Executive Success Test

The product will be succeeding if:
- lodges actually use it
- mentors do not resent it
- district oversight becomes clearer
- readiness conversations are better informed
- progress records are more trustworthy than paper

---

## 20. MVP Definition

### 20.1 MVP Scope

The MVP shall include:
- authentication
- role assignment
- lodge/district tenancy
- Brother profile
- four passport sections
- submission workflow
- verification workflow
- dashboards for Brother, Personal Mentor, Lodge Mentor, and District Mentor
- notifications
- basic reporting
- audit trail

### 20.2 Explicit MVP Exclusions

The MVP shall not require:
- full Solomon integration
- attachments
- advanced BI tooling
- cross-jurisdiction expansion
- messaging/chat
- offline-first complex sync engine
- appendant body tracking

---

## 21. Release Strategy

### 21.1 Rollout Control Principles

The release strategy shall assume staged delivery across a live district environment rather than a single “big bang” launch.

- **Pilot lodges first.** v1 should begin with a small number of pilot lodges representing different mentoring maturity levels.
- **Canary rollout where useful.** Non-critical features may be released to selected lodges or roles before wider district release.
- **Role- and lodge-scoped enablement.** Feature availability may be controlled by lodge, role, or release cohort where this reduces risk.
- **Rollback must be practical.** Non-critical features introduced under feature flags must have a clear rollback path.
- **Production learning matters.** Phase progression should be informed by real usage, support burden, verification turnaround, and adoption feedback, not optimism.


### 21.2 Phase 1 — Foundation
- identity
- roles
- lodge tenancy
- digital passport structure
- submission and verification workflow

### 21.3 Phase 2 — Operational Visibility
- lodge dashboards
- district dashboards
- reporting
- reminders
- audit enhancements

### 21.4 Phase 3 — Optimisation
- controlled lodge extensions
- deeper analytics
- external integrations
- selected UX improvements based on real usage

---

## 22. Product Risks

### 22.1 Adoption Risk
If the workflow is too cumbersome, mentors and Brothers will revert to paper or informal messaging.

### 22.2 Governance Risk
If permissions are too loose, confidence in the platform will collapse.

### 22.3 Data Quality Risk
If self-reported data is treated as verified data, leadership decisions will be made on weak evidence.

### 22.4 Scope Creep Risk
If unrelated lodge functions are added too early, delivery will stall.

### 22.5 Architecture Risk
If this is built as mobile-only without a proper backend/admin model, district use will become unmanageable.

### 22.6 Cultural Risk
If the product feels like surveillance instead of mentorship support, adoption will drop sharply.

---

## 23. Open Questions Requiring Product Decision

These should not be ignored. They are real design decisions, not trivial details.

1. Will each lodge be required to appoint a Personal Mentor for every new Brother in the system?
2. Should Lodge Leadership Reviewer be a separate formal role in v1?
3. What exact data may District Mentors see below lodge-summary level?
4. Are lodge-specific supplementary outcomes approved locally or by district policy?
5. What is the expected SLA for mentor verification?
6. Should section completion require all core outcomes to be verified, or can Lodge Mentor override?
7. How should transferred members between lodges be handled?
8. Will the product support historical back-entry from existing paper passports?
9. Is email mandatory for all users, or must the product support users with limited digital readiness?
10. Will district reporting require exports in a particular format?

These questions are important because unresolved governance questions routinely turn into engineering rework later.

---

## 24. Product Decisions Locked at This Stage

The following decisions are now considered baseline unless later changed intentionally.

1. The product is a **platform**, not merely a mobile app.
2. The experience is **Android-first**, but must support administrative and district workflows outside mobile where needed.
3. Visibility is **role-based**, not universal.
4. Self-submitted records are **not** equal to verified records.
5. Lodge Mentor remains the operational safety net where Personal Mentor is absent.
6. District roles are **analytics-first**, not default operational approvers.
7. The district passport structure is fixed at four core sections.
8. No secret ritual text is to be stored in the product.
9. v1 backend delivery shall be a **modular monolith**.
10. v1 shall use one coherent Android client and one coherent web administration experience over a shared backend.
11. v1 shall not begin with microservices or micro frontends.
12. Feature flags may be used for controlled rollout, but every flag must have an owner and an expected removal or review date.

---

## 25. Recommended Next Deliverables

This PRD should be followed immediately by:
1. a Software Requirements Specification (SRS)
2. a technical architecture document / ADR pack
3. a data model and API contract
4. an implementation backlog organised by business capability
2. a domain model / data model
3. a screen map
4. a permissions matrix
5. a workflow state diagram
6. an MVP backlog with epics and user stories
7. a technical architecture decision record

If those are not produced, the PRD will still leave too much room for interpretation.

---

## 26. Source Basis

This PRD is aligned primarily to the following project source materials:

- **Masonic Passport (2024)**
- **Lodge Mentors Handbook v3.0 (Jan 2024)**
- **District notes and address to Lodge Mentor (2026)**
- **Role of Lodge Mentor / Role of Personal Mentor notes**
- **Solomon for Mentors**

These source materials establish, among other things:
- the four core passport sections
- the mentoring and progress-record intent of the passport
- the district expectation that lodges use the passport or suitable adaptations
- the need for Personal Mentors where possible
- the role of Lodge Mentors in coordinating and assessing mentoring effectiveness
- district reporting expectations
- the value of Solomon as a complementary learning resource

---

## 27. Final Product Position

The correct way to understand this project is:

> **A district-governed mentoring and progression platform, expressed through an Android-first product experience, designed to support the real work of lodge mentoring rather than replace it.**

That framing is the difference between a useful product and a digitised booklet that nobody trusts.

