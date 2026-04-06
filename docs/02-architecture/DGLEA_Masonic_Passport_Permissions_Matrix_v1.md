# DGLEA Masonic Passport — Permissions Matrix

**Document Status:** Draft v1  
**Intended Repository Use:** Save as `.md` in GitHub  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06  

---

## 1. Purpose

This document defines the **authorisation model** for the DGLEA Masonic Passport platform.

It exists to stop ambiguity in the most dangerous part of the system:

- who can see what;
- who can edit what;
- who can verify what;
- who can override what;
- who can see analytics across lodge boundaries;
- who can see private mentoring notes.

This is not a cosmetic document. If the permissions model is weak, the platform will lose trust quickly.

---

## 2. Critical Design Position

The platform is a **district-governed mentoring system with lodge-level tenancy**, not a public collaborative workspace.

Therefore:

- access is **role-based** and **scope-based**;
- lodge access is isolated by default;
- district access is broader, but not unlimited;
- a Brother cannot verify his own progress;
- self-recorded items do not become official until verified;
- private mentoring notes are not district-wide by default.

---

## 3. Scope Model

A user may hold permissions in one or more scopes:

- **Own Record Scope** — only the user’s own record
- **Assigned Brother Scope** — Brothers directly assigned to that mentor
- **Lodge Scope** — all relevant records inside the user’s lodge
- **District Scope** — district-wide analytics and authorised drill-down
- **System Scope** — platform operations, support, and configuration

---

## 4. Role Catalogue

### 4.1 Brother / Candidate / Mason
Primary end user whose passport is being maintained.

### 4.2 Personal Mentor
Assigned mentor for one or more Brothers.

### 4.3 Lodge Mentor
Lodge-level mentoring coordinator and operational fallback verifier.

### 4.4 Lodge Leadership Reviewer
Read-focused lodge leadership role, typically Worshipful Master or delegated reviewer.

### 4.5 Lodge Administrator / Secretary
Lodge-level administrative role for setup, corrections, and configuration.

### 4.6 District Mentor
District oversight role focused on adoption, effectiveness, exceptions, and trends.

### 4.7 District Administrator / System Administrator
District/system governance role for operational support, configuration, and audit administration.

---

## 5. Permission Principles

1. **Least privilege by default**  
   No role should get more access than needed.

2. **Deny by scope unless explicitly allowed**  
   No cross-lodge visibility unless authorised.

3. **Verification is a governed privilege**  
   Submission is easy; verification is restricted.

4. **Private mentoring notes are not general-purpose records**  
   They require tighter visibility than ordinary progress records.

5. **District roles are not default daily approvers**  
   District oversight is primarily analytical and supervisory, not operational.

6. **Administrative power is not the same as mentoring authority**  
   Lodge admin can correct records administratively, but that does not mean routine mentoring sign-off.

---

## 6. Permission Matrix Legend

- **Y** = allowed
- **N** = not allowed
- **L** = allowed only within lodge scope
- **A** = allowed only for assigned Brothers
- **D** = district scope only
- **C** = controlled / exceptional / audited use only

---

## 7. Core Record Permissions Matrix

| Capability | Brother | Personal Mentor | Lodge Mentor | Lodge Leadership Reviewer | Lodge Admin / Secretary | District Mentor | District Admin / System Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| View own member profile | Y | N | N | N | N | N | C |
| View Brother profile | Own only | A | L | L (summary-focused) | L | D (limited drill-down) | C |
| Edit own profile basics | Limited | N | N | N | L (admin fields) | N | C |
| Edit milestone dates administratively | N | N | L | N | L | N | C |
| Create draft passport entry | Y | Y (mentor-created on behalf where enabled) | Y (mentor-created on behalf where enabled) | N | N | N | C |
| Edit own draft before submission | Y | N | N | N | N | N | C |
| Edit draft created on behalf of Brother | N | A | L | N | N | N | C |
| Submit passport entry for verification | Y | Y (if created on behalf) | Y (if created on behalf) | N | N | N | C |
| View submission status | Own only | A | L | L (summary-focused) | L | D (limited) | C |
| Verify submission | N | A / subject to lodge policy | L / subject to lodge policy | N | N | N | C |
| Reject submission | N | A / subject to lodge policy | L / subject to lodge policy | N | N | N | C |
| Request clarification | N | A / subject to lodge policy | L / subject to lodge policy | N | N | N | C |
| Override verification decision | N | N | L (audited) | N | N | N | C |
| Mark record superseded | N | N | L (audited) | N | L (administrative correction only) | N | C |
| Archive record | N | N | N | N | L (limited) | N | C |
| View lodge dashboard | N | Optional limited lodge view | Y | Y | Y | D | C |
| View district dashboard | N | N | N | N | N | Y | Y |
| Export own progress summary | Y | N | N | N | N | N | C |
| Export lodge summary | N | N | Y | Y (if allowed) | Y | D | C |
| Export district analytics | N | N | N | N | N | Y | Y |
| View audit events | N | N | Limited | N | Limited | Limited summary | Y |
| Manage mentor assignments | N | N | Y | N | Y | N | C |
| Manage lodge supplementary items | N | N | Y | N | Y | N | C |
| Manage district core templates | N | N | N | N | N | N | Y |
| Manage feature flag targeting | N | N | N | N | N | N | Y |

---

## 8. Notes on the Core Matrix

### 8.1 Brother
A Brother can create, edit, and submit his own records, but he cannot verify them.

### 8.2 Personal Mentor
A Personal Mentor should generally operate only within **assigned Brother scope**. He should not automatically see the whole lodge unless he also holds another lodge-level role.

### 8.3 Lodge Mentor
The Lodge Mentor is the principal lodge-wide operational mentor role. He can see all relevant lodge records, verify where policy permits, and act as fallback/override with audit.

### 8.4 Lodge Leadership Reviewer
This role is intentionally **read-focused**. It exists for governance and readiness visibility, not for routine workflow handling.

### 8.5 Lodge Administrator / Secretary
This role handles setup, corrections, and admin support. It is **not** a routine mentoring verifier by default.

### 8.6 District Mentor
District Mentor access should bias toward:
- aggregated analytics;
- exceptions;
- adoption trends;
- limited drill-down where operationally justified.

It should **not** default to private mentoring notes or unrestricted operational detail.

### 8.7 District Admin / System Admin
This is a high-trust operational role. Use should be auditable and controlled.

---

## 9. Private Notes and Sensitive Data Matrix

Not all data should be equally visible.

| Data Type | Brother | Personal Mentor | Lodge Mentor | Lodge Leadership Reviewer | Lodge Admin | District Mentor | District Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Standard progress item | Own only | A | L | L (summary) | L | D (limited) | C |
| Verification note | Own item only where allowed | A | L | Summary only | L | D (limited summary) | C |
| Private mentoring note | Optional own visibility by policy | A | L (if policy allows) | N | N | N by default | C |
| Lodge admin note | N | N | L | N | L | N | C |
| District oversight note | N | N | N | N | N | D | C |
| Audit event detail | N | N | Limited | N | Limited | Limited summary | Y |

### Recommended rule
Private mentoring notes should be visible only to:
- the authoring mentor,
- the Lodge Mentor where policy permits,
- authorised admins only in exceptional audited circumstances.

They should **not** be district-visible by default.

---

## 10. Verification Authority Matrix

This matrix is narrower than the full access matrix because verification is the most sensitive operational action.

| Action | Brother | Personal Mentor | Lodge Mentor | Lodge Leadership Reviewer | Lodge Admin | District Mentor | District Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Verify submission | N | A / lodge policy | L / lodge policy | N | N | N | C |
| Reject submission | N | A / lodge policy | L / lodge policy | N | N | N | C |
| Request clarification | N | A / lodge policy | L / lodge policy | N | N | N | C |
| Override mentor decision | N | N | L (audited) | N | N | N | C |
| Reverse erroneous admin action | N | N | N | N | L (audited, non-routine) | N | C |
| Force-correct corrupted workflow state | N | N | N | N | N | N | Y |

### Recommended default lodge verification policy for MVP
**Either Personal Mentor or Lodge Mentor may verify, with Lodge Mentor override.**

This is the safest default because:
- some lodges may not have an active Personal Mentor in every case;
- the Lodge Mentor remains responsible for ensuring the process works;
- the workflow does not stall when the Personal Mentor is absent.

---

## 11. Administrative Permissions Matrix

| Administrative Capability | Brother | Personal Mentor | Lodge Mentor | Lodge Leadership Reviewer | Lodge Admin | District Mentor | District Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Create Brother profile | N | N | Optional assisted | N | Y | N | Y |
| Assign Personal Mentor | N | N | Y | N | Y | N | Y |
| Assign Lodge Mentor role | N | N | N | N | N | N | Y |
| Activate/deactivate lodge user | N | N | N | N | Y | N | Y |
| Transfer Brother between lodges | N | N | N | N | Limited | N | Y |
| Configure lodge verification policy | N | N | Y | N | Y | N | Y |
| Configure district core learning outcomes | N | N | N | N | N | N | Y |
| Configure lodge supplements | N | N | Y | N | Y | N | Y |
| View support diagnostics | N | N | N | N | Limited | N | Y |
| Access full audit tooling | N | N | N | N | Limited | Limited summary | Y |

---

## 12. API / Backend Enforcement Rules

The permission model shall be enforced in the backend, not trusted to the client.

### Mandatory backend rules
1. A Brother cannot verify his own record.
2. A Personal Mentor cannot verify a Brother he is not assigned to unless he also holds another authorised role.
3. A Lodge Mentor cannot view or act outside his lodge unless separately authorised.
4. A District Mentor cannot access private mentoring notes by default.
5. Any override action must create an audit event.
6. Any administrative correction to a verified record must preserve historical truth.

---

## 13. Suggested Row-Level Security Logic

This is a conceptual guide, not implementation code.

### Brother
Access where:
- `record.member_user_id == current_user.id`

### Personal Mentor
Access where:
- `record.member_id in assigned_member_ids(current_user)`

### Lodge Mentor / Lodge Admin / Lodge Leadership Reviewer
Access where:
- `record.lodge_id in lodge_ids_for_user(current_user)`

### District Mentor
Access where:
- analytics and approved drill-down views are district-authorised
- private mentoring note tables remain excluded by default

### District Admin
Access where:
- authorised by high-trust system role
- audit logging is mandatory

---

## 14. Edge Cases That Must Be Handled

### 14.1 No Personal Mentor Assigned
The Lodge Mentor must remain able to verify and manage the Brother’s workflow.

### 14.2 One User Holds Multiple Roles
Permissions should be the union of authorised roles within scope, subject to explicit denial rules for sensitive data.

### 14.3 Mentor Moves Lodge or Loses Role
Historical audit remains, but active access should end.

### 14.4 Brother Transfers Lodge
Operational scope moves, but historical records must remain preserved and traceable.

### 14.5 Lodge Has a Custom Verification Policy
The engine should respect allowed policy variants without changing the underlying audit model.

---

## 15. Recommended Defaults for MVP

### 15.1 Visibility
- Brother: own records only
- Personal Mentor: assigned Brothers only
- Lodge Mentor: all Brothers in lodge
- Lodge Leadership Reviewer: summary/read-only lodge visibility
- District Mentor: analytics + exception drill-down only
- District Admin: controlled full administrative access

### 15.2 Verification
- default policy: Personal Mentor **or** Lodge Mentor may verify
- Lodge Mentor may override
- all overrides audited

### 15.3 Sensitive Data
- private mentoring notes disabled for district visibility by default
- only operational progress data contributes to district analytics

---

## 16. Explicit Anti-Patterns

Do **not** do the following:

1. do not make everything in the lodge visible to every user in the lodge;
2. do not make district access equivalent to unrestricted raw data access;
3. do not let the mobile app enforce permissions by itself;
4. do not let admin roles silently overwrite verified history;
5. do not use private mentoring notes as district KPI input;
6. do not let verification privileges drift through convenience.

---

## 17. Final Permission Position

The correct permission model for this platform is:

> **Role-based, scope-constrained, lodge-isolated by default, district-visible by exception and analytics, with verification treated as a governed privilege rather than a general edit right.**
