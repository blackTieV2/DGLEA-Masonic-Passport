# DGLEA Masonic Passport — OpenAPI Contract Outline

**Document Status:** Draft v1  
**Intended Repository Use:** Save as `.md` in GitHub  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06  

---

## 1. Purpose

This document defines the initial **API contract outline** for the DGLEA Masonic Passport platform.

It is not yet a full OpenAPI YAML file. It is the pre-spec contract that Codex should use to produce the formal OpenAPI definition.

The API design assumes:
- Android mobile client
- web admin client
- shared backend
- backend-enforced authorisation
- explicit verification workflow
- district/lodge scope boundaries

---

## 2. API Design Principles

1. **Backend is authoritative**
2. **Workflow transitions are explicit**
3. **Permissions are enforced server-side**
4. **Submitted and verified states are distinct**
5. **Admin correction paths are separate from normal user flows**
6. **Analytics endpoints are role-scoped**
7. **Private mentoring notes are tightly controlled**

---

## 3. High-Level API Domains

- Authentication and session
- Current user and permissions
- Member profile
- Mentor assignment
- Passport templates
- Passport records
- Verification workflow
- Dashboards and analytics
- Notifications
- Reporting and exports
- Lodge and district administration
- Configuration and feature flags
- Audit

---

## 4. API Versioning

Suggested initial base path:

```text
/api/v1
```

Versioning rule:
- breaking changes require new API version
- additive fields are acceptable within the same version where backwards compatible

---

## 5. Authentication and Session Endpoints

## 5.1 Login
`POST /api/v1/auth/login`

Purpose:
- authenticate user
- issue session or token set

Request body:
```json
{
  "email": "user@example.org",
  "password": "string"
}
```

Response:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 3600,
  "user": {
    "id": "usr_123",
    "displayName": "John Smith"
  }
}
```

## 5.2 Refresh Token
`POST /api/v1/auth/refresh`

## 5.3 Logout
`POST /api/v1/auth/logout`

## 5.4 Current Session
`GET /api/v1/auth/me`

Response should include:
- user identity
- active roles
- lodge scope
- district scope
- feature flags relevant to user

---

## 6. Current User and Permissions Endpoints

## 6.1 Current User Profile
`GET /api/v1/me`

## 6.2 Current User Permissions Summary
`GET /api/v1/me/permissions`

Response example:
```json
{
  "roles": ["BROTHER", "PERSONAL_MENTOR"],
  "scopes": {
    "lodges": ["lodge_001"],
    "districts": ["district_001"],
    "assignedMemberIds": ["mem_001", "mem_002"]
  },
  "capabilities": [
    "passport.record.create",
    "passport.record.submit",
    "verification.verify.assigned"
  ]
}
```

---

## 7. Member Profile Endpoints

## 7.1 List Members
`GET /api/v1/members`

Query params:
- `lodgeId`
- `degreeStatus`
- `status`
- `mentorUserId`
- `search`
- `page`
- `pageSize`

## 7.2 Get Member
`GET /api/v1/members/{memberId}`

## 7.3 Create Member
`POST /api/v1/members`

## 7.4 Update Member
`PATCH /api/v1/members/{memberId}`

### Important rule
Administrative milestone correction endpoints should not be confused with ordinary profile update.

## 7.5 Update Member Milestones
`PATCH /api/v1/members/{memberId}/milestones`

Body example:
```json
{
  "initiatedAt": "2026-01-01",
  "passedAt": "2026-03-01",
  "raisedAt": null
}
```

---

## 8. Mentor Assignment Endpoints

## 8.1 List Mentor Assignments for Member
`GET /api/v1/members/{memberId}/mentor-assignments`

## 8.2 Create Mentor Assignment
`POST /api/v1/members/{memberId}/mentor-assignments`

Body example:
```json
{
  "mentorUserId": "usr_777",
  "mentorRoleType": "PERSONAL_MENTOR",
  "isPrimary": true
}
```

## 8.3 End Mentor Assignment
`PATCH /api/v1/mentor-assignments/{assignmentId}`

## 8.4 List Assigned Members for Mentor
`GET /api/v1/me/assigned-members`

---

## 9. Passport Template Endpoints

## 9.1 List Passport Sections
`GET /api/v1/passport/sections`

## 9.2 List Template Items for Section
`GET /api/v1/passport/sections/{sectionId}/items`

Query params:
- `includeLodgeSupplements`
- `lodgeId`

## 9.3 Create Lodge Supplement Item
`POST /api/v1/lodges/{lodgeId}/passport/supplements`

## 9.4 Update Lodge Supplement Item
`PATCH /api/v1/lodges/{lodgeId}/passport/supplements/{itemId}`

---

## 10. Passport Record Endpoints

## 10.1 List Passport Records for Member
`GET /api/v1/members/{memberId}/passport-records`

Query params:
- `sectionId`
- `status`
- `recordType`
- `page`
- `pageSize`

## 10.2 Get Passport Record
`GET /api/v1/passport-records/{recordId}`

## 10.3 Create Draft Passport Record
`POST /api/v1/members/{memberId}/passport-records`

Body example:
```json
{
  "sectionId": "sec_ea",
  "learningOutcomeTemplateId": "lot_123",
  "recordType": "LEARNING_OUTCOME",
  "eventDate": "2026-04-06",
  "note": "Completed discussion with mentor"
}
```

## 10.4 Update Draft Passport Record
`PATCH /api/v1/passport-records/{recordId}`

### Rule
This endpoint must reject casual editing of verified records.

## 10.5 Get Record Versions
`GET /api/v1/passport-records/{recordId}/versions`

---

## 11. Verification Workflow Endpoints

## 11.1 Submit Record for Verification
`POST /api/v1/passport-records/{recordId}/submit`

Response example:
```json
{
  "recordId": "pr_123",
  "status": "SUBMITTED",
  "submittedAt": "2026-04-06T10:00:00Z"
}
```

## 11.2 Verify Record
`POST /api/v1/passport-records/{recordId}/verify`

Body example:
```json
{
  "note": "Confirmed with Brother after meeting."
}
```

## 11.3 Reject Record
`POST /api/v1/passport-records/{recordId}/reject`

Body example:
```json
{
  "reason": "Attendance date unclear."
}
```

## 11.4 Request Clarification
`POST /api/v1/passport-records/{recordId}/clarification`

Body example:
```json
{
  "reason": "Please add which lodge was visited."
}
```

## 11.5 Override Decision
`POST /api/v1/passport-records/{recordId}/override`

Body example:
```json
{
  "targetStatus": "VERIFIED",
  "reason": "Lodge Mentor confirmed mentor absence and reviewed evidence."
}
```

## 11.6 Supersede Record
`POST /api/v1/passport-records/{recordId}/supersede`

Body example:
```json
{
  "replacementRecordId": "pr_999",
  "reason": "Corrected duplicated visit record."
}
```

## 11.7 List Pending Verification Queue
`GET /api/v1/verification-queue`

Query params:
- `scope=assigned|lodge|district`
- `status`
- `staleOnly`
- `lodgeId`

---

## 12. Notes Endpoints

## 12.1 Add Operational Note
`POST /api/v1/passport-records/{recordId}/notes`

## 12.2 List Operational Notes
`GET /api/v1/passport-records/{recordId}/notes`

## 12.3 Add Private Mentoring Note
`POST /api/v1/members/{memberId}/private-notes`

## 12.4 List Private Mentoring Notes
`GET /api/v1/members/{memberId}/private-notes`

### Important rule
This endpoint must be tightly permission-checked.

---

## 13. Dashboard and Analytics Endpoints

## 13.1 Brother Dashboard
`GET /api/v1/me/dashboard`

## 13.2 Mentor Dashboard
`GET /api/v1/me/mentor-dashboard`

## 13.3 Lodge Dashboard
`GET /api/v1/lodges/{lodgeId}/dashboard`

## 13.4 District Dashboard
`GET /api/v1/districts/{districtId}/dashboard`

## 13.5 Analytics Drill-Down
`GET /api/v1/districts/{districtId}/analytics`

Query params:
- `lodgeId`
- `metric`
- `from`
- `to`

---

## 14. Notification Endpoints

## 14.1 List My Notifications
`GET /api/v1/me/notifications`

## 14.2 Mark Notification Read
`POST /api/v1/me/notifications/{notificationId}/read`

## 14.3 Notification Preferences
`GET /api/v1/me/notification-preferences`
`PATCH /api/v1/me/notification-preferences`

---

## 15. Reporting and Export Endpoints

## 15.1 Generate Lodge Report
`POST /api/v1/lodges/{lodgeId}/reports`

Body example:
```json
{
  "reportType": "LODGE_PROGRESS_SUMMARY",
  "from": "2026-01-01",
  "to": "2026-12-31"
}
```

## 15.2 Generate District Report
`POST /api/v1/districts/{districtId}/reports`

## 15.3 List Generated Reports
`GET /api/v1/reports`

## 15.4 Download Report Metadata
`GET /api/v1/reports/{reportId}`

---

## 16. Lodge and District Administration Endpoints

## 16.1 List Lodges
`GET /api/v1/lodges`

## 16.2 Get Lodge
`GET /api/v1/lodges/{lodgeId}`

## 16.3 Update Lodge Configuration
`PATCH /api/v1/lodges/{lodgeId}/configuration`

Body example:
```json
{
  "verificationPolicy": "EITHER_PERSONAL_OR_LODGE",
  "privateNotesEnabled": true
}
```

## 16.4 List District Users
`GET /api/v1/districts/{districtId}/users`

## 16.5 Assign User Role
`POST /api/v1/user-scope-roles`

Body example:
```json
{
  "userId": "usr_001",
  "roleCode": "LODGE_MENTOR",
  "lodgeId": "lodge_001"
}
```

---

## 17. Configuration and Feature Flag Endpoints

## 17.1 List Feature Flags
`GET /api/v1/feature-flags`

## 17.2 Create Feature Flag
`POST /api/v1/feature-flags`

## 17.3 Update Feature Flag
`PATCH /api/v1/feature-flags/{flagId}`

## 17.4 Update Feature Flag Targets
`POST /api/v1/feature-flags/{flagId}/targets`

---

## 18. Audit Endpoints

## 18.1 List Audit Events
`GET /api/v1/audit-events`

Query params:
- `entityType`
- `entityId`
- `actorUserId`
- `lodgeId`
- `from`
- `to`

## 18.2 Get Audit Event
`GET /api/v1/audit-events/{eventId}`

### Important rule
Do not expose unrestricted audit access to normal users.

---

## 19. Response Envelope Guidance

Suggested standard response envelope for list endpoints:
```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 200,
  "totalPages": 10
}
```

Suggested error shape:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to verify this record.",
    "details": null
  }
}
```

---

## 20. Common Error Codes

- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `INVALID_STATE_TRANSITION`
- `CONFLICT`
- `FEATURE_DISABLED`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

---

## 21. Example State Transition Rules

### Record verify endpoint must fail when:
- record is not `SUBMITTED` or `NEEDS_CLARIFICATION`
- actor is not an authorised verifier
- feature/policy does not allow this verifier type
- record belongs outside actor scope

### Record update endpoint must fail when:
- record is already `VERIFIED` unless using correction path
- actor lacks edit permissions
- record is archived

---

## 22. Security Requirements for the API

1. all mutating endpoints require authentication
2. all workflow endpoints require role and scope checks
3. all override endpoints require audit capture
4. private note endpoints require stricter checks than normal progress endpoints
5. district analytics endpoints must suppress excluded data classes by default

---

## 23. Codex Follow-On Work

Codex should convert this outline into:
1. formal OpenAPI YAML
2. request/response schemas
3. auth middleware design
4. validation rules
5. API tests

---

## 24. Final API Position

The correct API shape is:

> **Workflow-explicit, permission-aware, server-enforced, and split by domain area rather than by arbitrary controller sprawl.**
