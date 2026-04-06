# DGLEA Masonic Passport — Project Glossary and Canonical Naming

**Document Status:** Draft v1  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06

---

## 1. Purpose

This glossary defines the **canonical names** to be used across product, architecture, API, UX, and testing documentation.

Use this as the source of truth when writing or updating docs.

---

## 2. Canonical Roles

### 2.1 Display Names
- **Brother / Candidate / Mason**
- **Personal Mentor**
- **Lodge Mentor**
- **Lodge Leadership Reviewer** *(typically Worshipful Master or delegated reviewer)*
- **Lodge Administrator / Secretary**
- **District Mentor**
- **District Administrator / System Administrator**

### 2.2 Canonical Role Enum Codes
- `BROTHER`
- `PERSONAL_MENTOR`
- `LODGE_MENTOR`
- `LODGE_REVIEWER`
- `LODGE_ADMIN`
- `DISTRICT_MENTOR`
- `DISTRICT_ADMIN`
- `SYSTEM_ADMIN`

### 2.3 Role Naming Rules
1. Use full display names in user-facing docs.
2. Use enum codes in technical schemas/examples.
3. Do not introduce alternative labels such as “Lodge Reviewer” or “District Admin / System Admin”.

---

## 3. Canonical Entity Names

Use the following entity names consistently in architecture/data/API docs:

- `District`
- `Lodge`
- `User`
- `Role`
- `UserScopeRole`
- `MemberProfile`
- `MentorAssignment`
- `PassportSectionTemplate`
- `LearningOutcomeTemplate`
- `PassportRecord`
- `PassportRecordVersion`
- `VerificationDecision`
- `VerificationQueueItem`
- `Notification`
- `AuditEvent`
- `FeatureFlag`

Entity naming rules:
1. Entity/type names use `PascalCase`.
2. Database columns use `snake_case`.
3. API JSON fields use `camelCase`.

---

## 4. Canonical Workflow States

### 4.1 Enum Codes (Authoritative)
- `DRAFT`
- `SUBMITTED`
- `NEEDS_CLARIFICATION`
- `VERIFIED`
- `REJECTED`
- `OVERRIDDEN`
- `SUPERSEDED`
- `ARCHIVED`

### 4.2 Optional UI Labels
- Draft
- Submitted
- Needs Clarification
- Verified
- Rejected
- Overridden
- Superseded
- Archived

### 4.3 State Naming Rules
1. Use enum codes (`UPPER_SNAKE_CASE`) in API/data/workflow logic.
2. Use human-readable labels only in UI copy.
3. Do not mix camel-case state tokens such as `NeedsClarification` in canonical definitions.

---

## 5. Canonical Module Names (Backend Modular Monolith)

- **Identity & Access**
- **Lodge & District Administration**
- **Passport**
- **Mentor Assignment**
- **Verification Workflow**
- **Notifications**
- **Reporting & Analytics**
- **Audit**
- **Configuration / Feature Flags**

Module naming rules:
1. Use these exact names in architecture docs and planning.
2. Keep module names capability-oriented, not framework-oriented.

---

## 6. API Naming Conventions

### 6.1 Paths and Resources
1. Base path is `/api/v1`.
2. Resource names are plural kebab-case nouns:
   - `/members`
   - `/mentor-assignments`
   - `/passport-records`
   - `/feature-flags`
3. Path parameters are camelCase in braces:
   - `{memberId}`
   - `{recordId}`

### 6.2 Action Endpoints
Use verb sub-resources only for explicit workflow transitions:
- `/passport-records/{recordId}/submit`
- `/passport-records/{recordId}/verify`
- `/passport-records/{recordId}/reject`
- `/passport-records/{recordId}/clarification`
- `/passport-records/{recordId}/override`
- `/passport-records/{recordId}/supersede`

### 6.3 Request/Response Fields
1. JSON field names use `camelCase`.
2. Enum values use `UPPER_SNAKE_CASE`.
3. IDs use stable opaque string identifiers.

---

## 7. Enum Naming Conventions

Use `UPPER_SNAKE_CASE` for all enums, including:
- roles
- workflow states
- item/record types
- feature flag statuses
- audit event categories

Examples:
- `PERSONAL_MENTOR`
- `NEEDS_CLARIFICATION`
- `RITUAL_PARTICIPATION`

---

## 8. Non-Canonical Aliases (Do Not Introduce)

The following are deprecated aliases and should be replaced when encountered:
- “Lodge Reviewer” -> **Lodge Leadership Reviewer**
- “Lodge Admin / Secretary” -> **Lodge Administrator / Secretary**
- “District Admin / System Admin” -> **District Administrator / System Administrator**
- `NeedsClarification` -> `NEEDS_CLARIFICATION`
- lowercase state enums (e.g. `submitted`) in technical/state-machine contexts -> `SUBMITTED`

---

## 9. Change Control

If a new role/entity/state/module name is proposed:
1. update this glossary first;
2. update architecture + API docs in the same change;
3. avoid introducing parallel naming sets.
