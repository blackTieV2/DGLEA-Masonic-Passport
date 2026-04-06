# DGLEA Masonic Passport — Software Requirements Specification (SRS)

**Document Status:** Draft v2.1  
**Intended Repository Use:** Save as `.md` in GitHub  
**Project:** DGLEA Masonic Passport  
**Prepared for:** District Grand Lodge of the Eastern Archipelago (DGLEA)  
**Platform Context:** Android-first mentoring platform with supporting web administration and backend services

---

## 1. Purpose

This Software Requirements Specification (SRS) defines the functional, non-functional, data, workflow, security, and operational requirements for the **DGLEA Masonic Passport** platform.

The system is intended to digitise the district’s existing **Masonic Passport (Initiates Milestones)** and the lodge mentoring process into a structured, auditable, district-wide platform. The source materials are explicit that the passport is a four-section framework approved by the District Board of General Purposes, that it is intended to help guide and document the progress of the new Mason, that it includes Masonic activities in addition to learning outcomes, and that it helps lodge committees and Worshipful Masters gauge progress, especially in relation to the timing of passing and raising.【50:6†Masonic Passport (2024).pdf†L1-L38】

This document replaces the earlier high-level SRS draft with a more rigorous engineering specification. The earlier draft was directionally useful, but it was too abstract in several places and left too much room for implementation drift. In particular, it did not specify tenancy boundaries tightly enough, did not define lifecycle states in sufficient detail, did not separate self-submitted records from verified records strongly enough, and did not adequately define how district oversight should work without creating unnecessary access to lodge-level personal notes.

---

## 2. Critical Review of the Previous SRS

The previous SRS needed improvement in the following areas:

### 2.1 It treated the product too much like a generic app
The district materials do not describe a casual self-tracking app. They describe a structured mentoring and governance tool that supports the lodge, lodge committee, Worshipful Master, personal mentors, lodge mentors, and district reporting.【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】

### 2.2 It under-specified roles and permissions
The previous draft identified core roles, but it did not define operational boundaries tightly enough. A district-wide system used by 45 lodges cannot rely on broad assumptions such as “everyone can view”; role-based and tenant-aware access controls are required to preserve trust and governance integrity.

### 2.3 It did not define state transitions precisely enough
A Brother’s submission must not be treated as an official progress record until it has been reviewed and verified by an authorised mentor. The source materials make clear that the passport is both a personal record and a tool by which the lodge gauges progress.【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】 The software must therefore distinguish draft, submitted, verified, rejected, and overridden states explicitly.

### 2.4 It did not handle lodge flexibility carefully enough
The passport and handbook both state that the district framework is not exhaustive and that lodge mentors may supplement the learning outcomes with Solomon or existing lodge programmes.【50:2†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】【50:6†Masonic Passport (2024).pdf†L1-L38】 The system must preserve a district-approved core while allowing lodge-level additions without fragmenting the platform.

### 2.5 It did not define reporting obligations strongly enough
The district handbook states that lodge mentors should report activities in the lodge annual report, include the lodge mentor’s report as an item in the summons, and provide yearly reports to the district and the District Grand Master so the district can assess effectiveness and the progress of individual initiates.【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】 That means reporting is not optional product polish; it is a core requirement.

### 2.6 It needed clearer content boundaries
The district note states that the passport contains no secrets or ritual discussion, but rather a summary of what the new Mason should be introduced to.【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】 The system must therefore avoid becoming a repository for ritual text, secret work, or sensitive ceremonial content.

---

## 3. System Overview

### 3.1 Product Summary
The DGLEA Masonic Passport platform shall provide a district-wide digital system for:

- recording the progress of a Brother across the district-approved passport structure;
- supporting personal mentors and lodge mentors in mentoring, verification, and supervision;
- providing lodge-level oversight of progression and readiness;
- providing district-level analytics and annual reporting support;
- preserving a consistent core structure across all lodges while allowing controlled lodge-specific supplementation.

### 3.2 System Type
The system shall be treated as a **multi-component platform**, not merely a mobile application. At minimum, it shall comprise:

- an **Android mobile application** for Brothers, personal mentors, and lodge mentors;
- a **web-based administration interface** for lodge admins, district mentors, and district admins;
- a **backend API layer**;
- a **central database**;
- a **notification subsystem**;
- an **audit and reporting subsystem**.

### 3.3 Operational Scope
The initial operational scope is all DGLEA lodges using the mentoring programme, estimated at approximately **45 lodges**.

### 3.4 Architectural Delivery Constraints
The system shall be delivered as a **modular monolith** for MVP and early production use.

The initial backend shall be organised by business capability, not merely by technical layer. At minimum, the internal module boundary model shall recognise:

- Identity & Access
- Lodge & District Administration
- Passport
- Mentor Assignment
- Verification Workflow
- Notifications
- Reporting & Analytics
- Audit

The system shall not require microservices to satisfy MVP or early-production functional scope.

### 3.5 Application Boundary
The Android application and the web administration client shall be presentation clients, not authoritative owners of business rules.

The shared backend/domain layer shall remain the system of record and the authoritative source for:

- role and permission enforcement;
- tenancy boundaries;
- record lifecycle transitions;
- verification decisions;
- audit trail creation;
- readiness and reporting logic.

No client shall be allowed to implement a conflicting local interpretation of these rules.

### 3.6 Presentation Architecture Constraint
The mobile and web clients shall follow a thin-client presentation approach.

Presentation layers may manage UI state, interaction state, form validation flow, and user guidance, but domain rules shall remain outside view components and outside direct persistence objects.

For mobile delivery, an MVVM-style or equivalent presentation-model approach is the expected baseline.

### 3.7 Deferred Distribution Decisions
The following architectural moves are explicitly deferred unless future evidence justifies them:

- microservices;
- micro frontends;
- a separate backend-for-frontend per client;
- independently deployed analytics services;
- serverless-first decomposition of core workflow logic.

These are not forbidden forever; they are deferred because the current product scope, team shape, and operational scale do not justify their complexity.

---

## 4. Business Context and Grounding Constraints

The following constraints are derived directly from the district source materials and are therefore mandatory design assumptions:

1. The passport is designed in **four sections**, each covering important areas of guidance and additional items for the new Mason.【50:6†Masonic Passport (2024).pdf†L1-L38】
2. The passport includes not only learning outcomes but also **Masonic activities**, mentor sessions, visitations, rituals performed, milestone dates, and a consolidation view.【50:3†Masonic Passport (2024).pdf†L1-L54】【50:15†Masonic Passport (2024).pdf†L1-L44】
3. The lodge mentor is expected to **coordinate mentoring within the lodge**, appoint mentors, and ensure the process works effectively, rather than merely acting as a symbolic office-holder.【50:10†MentorApp - 25-06 (5) LM (3in1) 1-Address to LM-20Jun2018 2013 (2)Role of LM (3) Role of Personal Mentor-Aug 2022.doc†L1-L31】【50:12†MentorApp - 25-06 (5) LM (3in1) 1-Address to LM-20Jun2018 2013 (2)Role of LM (3) Role of Personal Mentor-Aug 2022.doc†L1-L31】
4. Every new Mason is expected to have a **personal mentor**, although the software must still support lodges where a lodge mentor alone handles sign-off or oversight.【50:2†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】
5. Lodge mentors must report activities and progress yearly to the district so that the district can assess mentoring effectiveness and the progress of initiates.【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】
6. The passport is **not exhaustive** and may be supplemented by Solomon or lodge-specific mentoring programmes.【50:2†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】【50:6†Masonic Passport (2024).pdf†L1-L38】
7. The passport is a **log book** and a record of progress, and contains **no secrets or ritual discussion**; the system must therefore preserve that boundary.【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】

---

## 5. Objectives

### 5.1 Primary Objectives
The system shall:

- digitise the district-approved passport structure faithfully;
- support mentorship workflows across all relevant lodge roles;
- provide auditable verification of progress records;
- reduce ambiguity about a Brother’s current progression status;
- support annual lodge and district reporting;
- support district-wide visibility without weakening local lodge governance.

### 5.2 Secondary Objectives
The system should:

- support Solomon-linked self-study pathways;
- improve continuity when mentors change;
- improve onboarding consistency for new Masons;
- encourage timely mentoring and verification rather than passive backlog accumulation.

---

## 6. Non-Goals

The system shall **not** be designed to:

- store full ritual books or secret ritual content;
- function as a general-purpose social network;
- replace existing full lodge administration systems for finance, dues, ballot handling, or summons production;
- act as the sole source of Masonic education beyond the approved passport scope;
- expose private mentoring notes district-wide by default.

---

## 7. User Roles

### 7.1 End-User Roles

#### 7.1.1 Brother / Candidate / Mason
The primary user whose passport record is being maintained.

#### 7.1.2 Personal Mentor
A mentor assigned to an individual Brother to act as friend, guide, and first-line support in the formative stages of his Masonic journey.【50:0†MentorApp - 25-06 (5) LM (3in1) 1-Address to LM-20Jun2018 2013 (2)Role of LM (3) Role of Personal Mentor-Aug 2022.doc†L1-L38】

#### 7.1.3 Lodge Mentor
The lodge-level coordinator responsible for ensuring mentoring is implemented and works effectively, assigning or coordinating mentors, and reporting progress to lodge and district bodies.【50:10†MentorApp - 25-06 (5) LM (3in1) 1-Address to LM-20Jun2018 2013 (2)Role of LM (3) Role of Personal Mentor-Aug 2022.doc†L1-L31】【50:12†MentorApp - 25-06 (5) LM (3in1) 1-Address to LM-20Jun2018 2013 (2)Role of LM (3) Role of Personal Mentor-Aug 2022.doc†L1-L31】

#### 7.1.4 Worshipful Master / Lodge Leadership Reviewer
A lodge-level leadership role requiring readiness visibility but not routine editing control.

### 7.2 Administrative Roles

#### 7.2.1 Lodge Admin / Secretary
Responsible for setup, maintenance, and administrative corrections within a lodge.

#### 7.2.2 District Mentor
A district oversight role primarily concerned with adoption, effectiveness, exceptions, and trends across lodges.

#### 7.2.3 District Admin / System Admin
A system management role responsible for tenant management, support, audits, and configuration.

---

## 8. Tenant Model and Access Boundaries

### 8.1 Tenancy Principle
The system shall operate as a **district platform with lodge-level tenancy boundaries**.

Each user shall belong to one or more organisational scopes:

- District scope
- Lodge scope
- Member assignment scope

### 8.2 Access Principles

1. A Brother shall only access his own passport and related records.
2. A Personal Mentor shall only access records for Brothers assigned to him, unless additionally authorised by lodge role.
3. A Lodge Mentor shall access records for Brothers within his own lodge.
4. A Worshipful Master or Lodge Reviewer shall access summary and readiness views for Brothers in his lodge.
5. A District Mentor shall access district-wide analytics, exception views, and limited drill-down views as explicitly permitted.
6. A District Admin shall access cross-lodge administration and audit interfaces.

### 8.3 Privacy Principle
The system shall distinguish between:

- operational progress records;
- lodge administrative data;
- private mentoring notes.

Private mentoring notes shall not be visible district-wide by default.

---

## 9. Passport Structure Requirements

### 9.1 Mandatory Core Sections
The system shall implement the district passport structure using the following sections:

1. **Entered Apprentice**
2. **Fellow Craft**
3. **Master Mason and Beyond**
4. **Preparing for Office**【50:6†Masonic Passport (2024).pdf†L1-L38】【50:11†Masonic Passport (2024).pdf†L1-L63】【50:15†Masonic Passport (2024).pdf†L1-L44】

### 9.2 Section Contents
Each section shall support, where applicable:

- learning outcomes;
- additional guidance items;
- lodge-specific notes;
- mentor sessions;
- visitations;
- rituals performed;
- section milestone dates;
- section completion date;
- mentor association;
- consolidation counts.

### 9.3 Core Learning Outcomes
The platform shall provide district-approved core learning outcomes derived from the district handbook and passport for each section, including but not limited to:

- meaning and symbolism of each degree;
- grips, words, working tools, and practice salutes where appropriate;
- questions and answers for passing and raising;
- lodge by-laws, support for brethren, lodge layout, furniture, and conduct of business;
- district and grand lodge structure;
- understanding of office, district boards, and readiness for stewardship or inner guard.【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L77】【50:11†Masonic Passport (2024).pdf†L1-L63】【50:15†Masonic Passport (2024).pdf†L1-L44】

### 9.4 Lodge-Specific Extensions
The platform shall allow lodge mentors or authorised lodge admins to add lodge-specific supplementary outcomes or notes without modifying or deleting the district-approved core.

---

## 10. Record Types

The system shall support the following record types as first-class objects:

1. **Member Profile**
2. **Mentor Assignment**
3. **Passport Section Record**
4. **Learning Outcome Record**
5. **Mentor Session Record**
6. **Visitation Record**
7. **Ritual Participation Record**
8. **Milestone Record**
9. **Attendance Record**
10. **Verification Record**
11. **Notification Record**
12. **Audit Record**
13. **Lodge Supplement Record**
14. **Reporting Snapshot Record**

---

## 11. Data Requirements

### 11.1 Member Profile Fields
The system shall store, at minimum:

- unique member ID;
- full name;
- preferred display name;
- lodge name and lodge number;
- district;
- current degree status;
- personal mentor assignment;
- lodge mentor assignment;
- Solomon registration date;
- initiated date;
- passed date;
- raised date;
- active/inactive/archive status.【50:6†Masonic Passport (2024).pdf†L1-L38】【50:11†Masonic Passport (2024).pdf†L1-L63】

### 11.2 Activity Record Fields
Each activity record shall store, at minimum:

- unique activity ID;
- related member ID;
- lodge ID;
- section ID;
- record type;
- title or activity label;
- event date;
- submitted-by user ID;
- submitted timestamp;
- optional note;
- verification state;
- verified-by user ID;
- verified timestamp;
- optional verification note;
- version number;
- soft-delete flag;
- audit linkage.

### 11.3 Lodge Supplement Fields
For lodge-specific additions, the system shall store:

- lodge supplement ID;
- lodge ID;
- section ID;
- supplement type;
- description;
- is-mandatory flag;
- created-by;
- created timestamp;
- active/inactive status.

---

## 12. State Model

### 12.1 Required Record States
All user-submitted progress records shall support the following states:

- `draft`
- `submitted`
- `verified`
- `rejected`
- `needs_clarification`
- `superseded`
- `overridden`
- `archived`

### 12.2 Verification Principle
A record entered by a Brother shall not count as an official progress record until it has reached the `verified` state.

### 12.3 Override Principle
A Lodge Mentor shall be able to override or finalise a decision where lodge policy permits, and the system shall preserve both the original action and the override in the audit trail.

---

## 13. Functional Requirements

### 13.1 User Identity and Authentication

#### FR-1
The system shall support secure sign-in for all user roles.

#### FR-2
The system shall support role assignment at lodge and district level.

#### FR-3
The system shall support assigning a personal mentor and lodge mentor to each Brother profile.

#### FR-4
The system shall support users with multiple roles where authorised.

### 13.2 Passport Management

#### FR-5
The system shall create a passport record for each Brother using the district four-section structure.

#### FR-6
The system shall display district-approved learning outcomes within each section.

#### FR-7
The system shall allow lodge-specific additions to be layered on top of the district core.

#### FR-8
The system shall display section-level progress, pending items, verified items, and completion status.

### 13.3 Submission Workflow

#### FR-9
The system shall allow a Brother to submit completion or attendance against a learning outcome or activity type.

#### FR-10
The system shall allow a Brother to add optional notes to a submission.

#### FR-11
The system shall time-stamp all submissions.

#### FR-12
The system shall generate notifications to the relevant mentor roles upon submission.

### 13.4 Verification Workflow

#### FR-13
The system shall allow an authorised mentor to verify a submission.

#### FR-14
The system shall allow an authorised mentor to reject a submission and provide a reason.

#### FR-15
The system shall allow an authorised mentor to request clarification.

#### FR-16
The system shall allow a Lodge Mentor to finalise or override a verification decision where permitted by lodge policy.

#### FR-17
The system shall preserve all verification actions in the audit trail.

### 13.5 Mentoring Activity Logging

#### FR-18
The system shall support logging mentor sessions.

#### FR-19
The system shall support logging visitations, including debrief status where used by the lodge.

#### FR-20
The system shall support logging rituals performed by section.

#### FR-21
The system shall support attendance records for annual communication and other approved items in the Preparing for Office section.

#### FR-22
The system shall support lodge-specific notes.

### 13.6 Dashboards

#### FR-23
The system shall provide a Brother dashboard showing progress, pending verification items, and next section tasks.

#### FR-24
The system shall provide a Personal Mentor dashboard showing assigned Brothers, pending reviews, and recent activity.

#### FR-25
The system shall provide a Lodge Mentor dashboard showing lodge adoption, overdue reviews, readiness candidates, and reporting status.

#### FR-26
The system shall provide a Worshipful Master / Lodge Reviewer dashboard showing section completion and readiness summaries.

#### FR-27
The system shall provide a District Mentor dashboard showing lodge participation, adoption, activity levels, overdue mentoring indicators, and cross-lodge trends.

### 13.7 Reporting and Export

#### FR-28
The system shall provide lodge-level summary reports suitable for use in annual reports.

#### FR-29
The system shall provide district-level aggregated reporting to support yearly district review.

#### FR-30
The system shall support export of approved report views in human-readable format.

#### FR-31
The system shall allow filtering by lodge, section, role, mentor, status, and time period.

### 13.8 Notification and Reminder Services

#### FR-32
The system shall send in-app notifications when a submission requires mentor review.

#### FR-33
The system shall support reminder notifications for overdue reviews.

#### FR-34
The system shall support reminder notifications for inactivity or incomplete mentoring milestones.

#### FR-35
The system shall support configuration of notification channels, including optional email.

### 13.9 Solomon and Reference Links

#### FR-36
The system shall support storing the date of Solomon registration.

#### FR-37
The system should support deep-linking or linking to approved Solomon resources where configured.【50:6†Masonic Passport (2024).pdf†L1-L38】【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】

### 13.10 Administration

#### FR-38
The system shall allow authorised admins to create and manage lodges.

#### FR-39
The system shall allow authorised admins to assign and change user roles.

#### FR-40
The system shall allow authorised admins to archive or transfer a Brother’s record if he moves lodge.

#### FR-41
The system shall allow authorised admins to manage lodge-specific supplements.

#### FR-42
The system shall allow district admins to configure district-approved core outcomes.

### 13.11 Feature Toggle Requirements

#### FR-43
The system may support **release toggles** for incomplete or staged features.

#### FR-44
The system may support **ops toggles** to disable or degrade non-critical features during operational incidents without changing the core data model.

#### FR-45
The system may support **permission toggles** or rollout toggles for lodge-scoped, district-scoped, or role-scoped feature enablement.

#### FR-46
Every feature toggle shall have, at minimum:
- a unique identifier;
- an owner;
- a documented purpose;
- a default state;
- an expected review or removal date.

#### FR-47
Feature toggles shall not replace the role-based access control model or the tenancy model.

#### FR-48
Any feature delivered behind a toggle shall define minimum rollback behaviour and a minimum test matrix covering the enabled and disabled states where relevant.

---

## 14. Permission Matrix Requirements

### 14.1 Brother
- View: own record only
- Create: own submissions
- Edit: own draft submissions and limited self-notes
- Verify: no
- Export: own view only where permitted

### 14.2 Personal Mentor
- View: assigned Brothers
- Create: mentor notes, mentor session records
- Edit: assigned mentee records as permitted
- Verify: yes, where lodge policy permits
- Override: no by default

### 14.3 Lodge Mentor
- View: all Brothers in own lodge
- Create/Edit: lodge mentoring records, assignments, lodge supplements
- Verify: yes
- Override: yes, where policy permits

### 14.4 Worshipful Master / Lodge Reviewer
- View: lodge summary and readiness views
- Edit: no routine edit rights
- Verify: not by default

### 14.5 District Mentor
- View: district analytics and approved drill-down views
- Edit: no routine operational editing
- Verify: no routine verification

### 14.6 District Admin / System Admin
- View/Edit: system configuration, tenancy, audits, support tools
- Operational verification: no by default unless explicitly delegated

---

## 15. Workflow Requirements

### 15.1 Standard Submission Workflow
1. Brother selects an item or activity.
2. Brother enters event date and optional note.
3. System stores the record as `submitted`.
4. System notifies the relevant Personal Mentor and/or Lodge Mentor.
5. Authorised mentor reviews and marks the record as `verified`, `rejected`, or `needs_clarification`.
6. System updates dashboards and audit trail.

### 15.2 Lodge Without Personal Mentor Workflow
Where a lodge does not actively use personal mentors, the system shall allow the Lodge Mentor to receive and act on submissions directly.

### 15.3 Clarification Workflow
If clarification is requested, the Brother shall be notified and allowed to respond without losing the original submission history.

### 15.4 Section Completion Workflow
A section shall only be marked complete when:

- required district core outcomes are completed and verified;
- required lodge-specific mandatory outcomes, if any, are completed and verified;
- required milestone dates are present;
- section completion is approved according to lodge policy.

---

## 16. Reporting Requirements

### 16.1 Lodge Reporting
The system shall support generation of:

- lodge mentoring activity summaries;
- pending verification lists;
- section completion summaries;
- annual reporting summaries aligned with the lodge mentor’s reporting obligations.【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】

### 16.2 District Reporting
The system shall support generation of:

- adoption by lodge;
- active Brothers by lodge and section;
- overdue mentoring and verification trends;
- yearly lodge participation metrics;
- progress summaries for district oversight.

### 16.3 Readiness Views
The system shall support lodge-level readiness views for leadership use, particularly to aid judgement about progression timing and office readiness, without pretending to replace human judgement.【50:6†Masonic Passport (2024).pdf†L1-L38】【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】

---

## 17. Non-Functional Requirements

### 17.1 Security

#### NFR-1
The system shall enforce role-based access control.

#### NFR-2
The system shall enforce lodge-level tenancy isolation.

#### NFR-3
The system shall encrypt data in transit.

#### NFR-4
The system shall encrypt sensitive data at rest.

#### NFR-5
The system shall maintain immutable audit records for critical actions.

### 17.2 Performance

#### NFR-6
Under normal load, standard dashboard requests should complete within 3 seconds.

#### NFR-7
Under normal load, submission and verification actions should complete within 2 seconds excluding network delay.

### 17.3 Availability and Reliability

#### NFR-8
The production service should target monthly uptime of at least 99.5%.

#### NFR-9
The system shall support automated backup and restore procedures.

#### NFR-10
The system shall preserve record history during update and correction workflows.

### 17.4 Scalability

#### NFR-11
The system shall support at least all current DGLEA lodges and allow future lodge expansion without redesign.

#### NFR-12
The system shall support concurrent district-wide reporting periods without major service degradation.

### 17.5 Usability

#### NFR-13
The mobile UX shall be optimised for low-friction, tap-efficient use.

#### NFR-14
The system shall favour clear plain-language labels over technical jargon.

#### NFR-15
The system shall make the difference between submitted and verified records visually obvious.

### 17.6 Maintainability

#### NFR-16
The platform shall support configuration of district core outcomes without requiring a full code rewrite.

#### NFR-17
The platform shall support lodge-level supplements through configuration rather than code forks.

#### NFR-18
The backend shall expose versioned APIs for client compatibility.

### 17.7 Architecture and Testability

#### NFR-19
The backend shall preserve clear internal module boundaries aligned to business capabilities.

#### NFR-20
Shared business rules shall execute in backend/domain services rather than being duplicated independently across clients.

#### NFR-21
The system shall allow feature toggles to be enumerated, audited, and reviewed without inspecting source code manually.

#### NFR-22
The test strategy shall account for enabled and disabled states of active feature toggles where behaviour changes materially.

#### NFR-23
The codebase shall be structured to allow future extraction of services only where justified by proven operational need.

### 17.8 Auditability

#### NFR-24
The system shall log all create, edit, verify, reject, override, export, role-change, and admin configuration actions.

#### NFR-25
Audit logs shall record actor, action, object, timestamp, and before/after values where applicable.

---

## 18. Data Retention and Archiving Requirements

### 18.1 Retention Principle
The system shall support retention policies for active, inactive, transferred, and archived records.

### 18.2 Transfer Principle
If a Brother moves lodges, the system shall preserve historical lodge linkage while allowing operational reassignment.

### 18.3 Archive Principle
Archived records shall remain reportable and auditable by authorised roles.

---

## 19. Integration Requirements

### 19.1 Solomon
The system should support reference linking and optional future integration patterns with Solomon, but shall not assume direct API availability without validation.

### 19.2 Notifications
The system shall support push notification delivery for Android and optional email delivery where configured.

### 19.3 Export Interfaces
The system shall support export of report snapshots in standard formats suitable for human review and offline distribution.

---

## 20. Content Boundary Requirements

### 20.1 Ritual Content Restriction
The system shall not store full ritual text, secret ritual prompts, or restricted ceremonial content as part of the passport feature set.

### 20.2 Safe Educational Scope
The system may store district-approved learning outcomes, short guidance labels, and references to approved educational resources, provided these remain within the non-secret, non-ritual scope described by the district materials.【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】

---

## 21. Assumptions and Risks

### 21.1 Assumptions
- DGLEA intends the digital system to preserve the structure of the current paper passport.
- Lodges may vary in operational mentoring practice, especially around whether a personal mentor is always active.
- District reporting across lodges is a required operational use case.

### 21.2 Risks
- premature distribution into microservices or micro frontends;
- feature-flag sprawl without ownership or removal discipline;
- business-rule leakage into clients, creating inconsistent behaviour;
- over-customisation at lodge level that weakens district comparability;
- low adoption if verification is too slow or too bureaucratic.

---

## 22. Acceptance Principles

The system shall be considered fit for MVP acceptance only if all of the following are true:

1. The four district passport sections are implemented.
2. Core district learning outcomes are configurable and displayed correctly.
3. A Brother can submit progress records.
4. Mentors can verify or reject submissions.
5. Lodge-level dashboards work.
6. District-level analytics work across lodge boundaries without violating tenancy rules.
7. Audit logging is operational.
8. Reporting outputs can support lodge and district annual reporting.
9. Submitted records are visibly distinct from verified records.
10. The system does not store ritual secrets or full ritual text.

---

## 23. Recommended MVP Scope

To avoid project sprawl, the MVP should include:

- authentication and role model;
- lodge and member setup;
- personal mentor and lodge mentor assignment;
- four passport sections;
- core learning outcomes;
- submission workflow;
- verification workflow;
- mobile dashboards for Brother and mentors;
- web dashboards for lodge and district oversight;
- basic reporting exports;
- audit logging;
- notification reminders.

The MVP should **exclude** advanced social features, full document management, ritual content storage, and speculative integrations not yet validated.

---

## 24. Final Engineering Position

The engineering position for v2.1 is explicit: build the platform as a **modular monolith** with **business-capability boundaries**, **thin clients**, **shared backend/domain rules**, and **strict tenancy and audit controls**. Do not allow Codex or future contributors to infer a microservice or micro-frontend architecture by default.


This specification deliberately treats the DGLEA Masonic Passport as a **governed mentoring platform**, not a simple checklist app. That is the correct interpretation of the district source material. The passport is designed to document progress, support mentoring, allow lodge leadership to gauge progress, and support district oversight and yearly reporting.【50:6†Masonic Passport (2024).pdf†L1-L38】【50:19†MentorApp - Lodge Mentors Handbook v 3.0 - Jan 2024.pdf†L1-L31】【50:4†MentorApp - 25-06 (7) DGM Address to Lodge Mentor.doc†L1-L36】

Any implementation that collapses these governance, verification, and reporting requirements into a generic self-tracking mobile app will be materially weaker than the district’s actual intent.
