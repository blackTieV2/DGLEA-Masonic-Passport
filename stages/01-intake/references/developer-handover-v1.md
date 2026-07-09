---
type: reference
title: DGLEA Masonic Passport Developer Handover v1.0
version: "1.0"
date: "2026-06-29"
source: user-provided production build brief
sensitivity: internal
---

# DGLEA Masonic Passport - Frontend and Backend Developer Handover

Version 1.0 - 29 June 2026

This is the developer handover for the DGLEA Masonic Passport app and backend platform.

## 1. Executive summary

The DGLEA Masonic Passport is a digital replacement and extension of the paper-based Masonic Passport used to guide a newly initiated Brother through early Masonic education, mentoring, visits, rituals performed, and progression from Entered Apprentice through Fellow Craft, Master Mason, and Preparing for Office.

The app is not a ritual-book app. It is a structured mentorship, progress-recording, evidence, and visibility system for the Brother, Personal Mentor, Lodge Mentor, Worshipful Master / Lodge leadership, and District Mentor team.

| Area | Summary |
| --- | --- |
| Primary objective | Give each Brother a guided, role-gated digital passport that records what has been completed, what is pending, who reviewed it, and what comes next. |
| Operational objective | Give mentors and Lodge leadership visibility of progress so timing of passing, raising, and later office preparation is evidence-informed. |
| District objective | Give District Mentor users analytics across approximately 45 lodges while enforcing role-based access. |
| Technical objective | Move from a working Android proof-of-flow to a production mobile app plus API backend with authentication, role-based access control, audit trail, notification, offline tolerance, and reporting. |
| Current state | Android project exists under `apps/android`. Prior proof-of-flow has demonstrated sign-in, draft creation, submission, mentor review, rejection, clarification request, resubmission, outcome viewing, sign-out, and account switching. Backend is to be implemented or completed to production standard. |

## 2. Source-of-truth requirements

| Source | Requirement impact |
| --- | --- |
| Masonic Passport 2024 | Primary product domain. Four-stage structure; learning outcomes; mentor sessions; visitations; rituals performed; dates initiated, passed, raised, and completed; personal/lodge mentor sign-off; consolidation totals. |
| UGLE expectation management | Pre-membership expectation flow. The platform should support clear early communication about time commitment, costs, and phased understanding of Craft and Royal Arch without overwhelming enquirers. |
| UGLE enquiry management | Optional / Phase 2 enquiry pipeline. Track enquiries, prompt response within 48 hours, record appropriate early information, avoid intrusive/protected information, manage first and second meetings, sponsor readiness, reporting, and deletion of personal details where someone does not become a member. |
| UGLE motives for joining | Optional interview-support taxonomy. The app can help record high-level motivations such as history/tradition, better man, curiosity, family connection, friend, and social altruism; this should support human conversation, not automate acceptance decisions. |

- **No ritual secrets.** Store only completion indicators, high-level topics, mentor comments, attendance, dates, and evidence notes. Do not store restricted words, grips, signs, passwords, ritual scripts, or detailed answers.
- **Role-based, not open access.** A Brother sees his own passport. Mentors see assigned Brothers. Lodge leadership sees their Lodge. District Mentors see cross-lodge dashboards. Admins manage reference data and access.
- **Human decision support only.** The app supports timing and readiness discussions. It must not auto-decide whether a Brother should be passed, raised, or appointed.
- **Solomon link-out only unless authorised.** The Passport refers Brothers to Solomon. Implement deep links or tracking of registration/completion status only if DGLEA/UGLE approvals and integration details exist.
- **Paper parity first.** The first production release must faithfully digitise the Passport before adding AI, chatbots, certificates, payments, or social features.

| Passport stage | Digital interpretation |
| --- | --- |
| Entered Apprentice | First Degree. Track initiation date, four mentor sessions, four visitations, first-degree learning outcomes, rituals performed, additional items, completion date, and mentor sign-off. |
| Fellow Craft | Second Degree. Track passing date, four mentor sessions, four visitations, second-degree learning outcomes, rituals performed, additional items, completion date, and mentor sign-off. |
| Master Mason | Third Degree and Beyond. Track raising date, four mentor sessions, four visitations, third-degree learning outcomes, DGLEA/HRAC/appendant awareness, rituals performed, completion date, and mentor sign-off. |
| Preparing for Office | Track officer-role education, District Boards, disciplinary procedure awareness, readiness for Steward/Inner Guard, Annual Communication attendance, teamwork/leadership/responsibility/proposing candidates, and mentor sign-off. |

## 3. Current known implementation state

| Area | Known state |
| --- | --- |
| Repository / module | `apps/android`. Open only `apps/android` in Android Studio unless the repository has since been reorganised. |
| Android build | Previously: `./gradlew.bat test` and `./gradlew.bat assembleDebug` succeeded. Debug APK path: `app\build\outputs\apk\debug\app-debug.apk`. Non-fatal warnings existed. |
| Android setup | `ANDROID_HOME`: `C:\Users\alex.maroske\AppData\Local\Android\Sdk`. Expected Gradle wrapper files: `gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.properties`, `gradle/wrapper/gradle-wrapper.jar`. |
| Proof-of-flow demonstrated | Sign in; create draft; submit; mentor verify/reject/request clarification; Brother sees outcome and mentor reason; Brother responds to clarification; resubmits; Mentor sees updated note; sign-out/account switching. |
| Known gap | The app has proved workflow mechanics but does not yet represent the complete Passport product, production backend, analytics, permission model, offline strategy, or deployment model. |

## 4. Product scope and user journeys

| Release | Scope |
| --- | --- |
| MVP / Release 1 | Android app, authentication, role-based dashboards, Brother passport, mentor review workflow, lodge view, district dashboard, admin reference data, backend API, database, audit log, basic notifications, exportable reports. |
| Release 1.1 | Offline-first polish, richer analytics, reminders, evidence attachments, mentor assignment workflows, CSV/PDF exports, improved accessibility, performance hardening. |
| Release 1.2 / Phase 2 | Members Pathway enquiry management module: enquirer intake, first contact SLA, first/second meeting tracking, sponsor readiness, referral/reporting, privacy deletion workflow. |
| Out of scope until authorised | Ritual text repository, automatic progression decisions, social media/community chat, payment processing, regalia store, direct Solomon data integration without approval, candidate acceptance automation. |

| Journey | Required flow |
| --- | --- |
| Brother onboarding | Accept invite or sign in; verify profile; select Lodge; see assigned stage; enter initiation/passing/raising dates as allowed; view current tasks; record sessions/visits/rituals; submit milestone evidence or reflection; respond to clarification. |
| Entered Apprentice journey | Complete first-degree learning outcomes; attend mentoring sessions; record visits and debriefs; log rituals performed; prepare questions and answers for passing; mentor signs off section readiness. |
| Fellow Craft journey | Complete second-degree learning outcomes; record tracing-board discussion at a high level; record lodge furniture/layout learning; log visits/rituals; mentor signs off readiness for raising. |
| Master Mason journey | Complete third-degree learning outcomes; record DGLEA structure awareness, HRAC introduction, appendant awareness, visits and rituals; mentor signs off completion. |
| Preparing for Office journey | Track role-of-officers learning, District Board awareness, disciplinary procedures, Annual Communication attendance, leadership/teamwork tasks, and readiness for Steward or Inner Guard. |
| Mentor review journey | Mentor dashboard; assigned Brothers; filter by overdue, awaiting review, clarification requested; open submission; verify, reject, or request clarification; add reason; track progress. |
| Lodge leadership journey | View Lodge-level progress, Brothers by degree/stage, overdue sections, upcoming readiness points, mentor coverage, and aggregate engagement. |
| District Mentor journey | View cross-lodge analytics across approximately 45 lodges; identify stalled progression, mentor gaps, and lodges needing support; export reports without exposing unnecessary personal detail. |

## 5. Roles, permissions, and data access

| Role | Access and actions |
| --- | --- |
| Brother / Mason | Own profile and passport only. Can create drafts, submit progress items, update permitted dates if authorised, respond to clarification, view mentor decisions and comments. |
| Personal Mentor | Assigned Brothers only. Can view and review assigned progress, create mentor-session records, request clarification, verify/reject, recommend readiness, and add mentor notes. |
| Lodge Mentor | All Brothers within own Lodge. Can assign Personal Mentors, view Lodge progress, review or countersign as configured, manage Lodge-specific notes, and export Lodge report. |
| Worshipful Master / Lodge Leadership | Own Lodge dashboards. Read progress and readiness summaries. Cannot access other Lodges. Write permissions limited to acknowledgements, not editing Brother evidence. |
| District Mentor | Cross-lodge dashboards and analytics. Can view aggregate and drill into Lodge/Brother records when required for mentoring governance. Cannot modify Brother submissions unless separately assigned. |
| District Admin | Reference data, Lodge setup, user role assignment, access revocation, templates, notification settings, and audit review. No unrestricted ritual-content powers because ritual content is excluded. |
| System Admin / DevOps | Technical administration only. No ordinary business-level browsing of Brother records outside break-glass support with audit logging. |
| Lodge Membership Officer | Phase 2 only. Manage enquirer records and contact logs for own Lodge, subject to privacy deletion rules. |

| Permission | Brother | Personal Mentor | Lodge Mentor | District Mentor | Admin |
| --- | --- | --- | --- | --- | --- |
| View own passport | Y | Y if assigned | Lodge summary / detail | District scoped | Audit only |
| Create progress draft | Y | On behalf if configured | N | N | N |
| Submit progress item | Y | Y on behalf if configured | N | N | N |
| Verify / reject / clarify | N | Y assigned | Y Lodge scope | Optional read-only except governance review | N |
| Assign mentor | N | N | Y Lodge scope | Optional oversight | Y |
| Promote degree/stage status | N | Recommend only | Y if authorised by Lodge workflow | Oversight only | Y technical |
| View cross-lodge analytics | N | N | N | Y | Y technical |
| Manage Lodge reference data | N | N | Y own Lodge | Y District templates | Y |
| Manage enquirers | N | N | Phase 2 if LMO | Aggregate / referral only | Y |

## 6. Frontend handover

- **Platform.** Android native first. Existing project context points to `apps/android` and successful Gradle build.
- **Language.** Kotlin.
- **UI.** Jetpack Compose is recommended for new production work. Keep existing UI if already implemented, but align screens to the navigation and role model below.
- **Architecture.** MVVM or unidirectional state flow: ViewModel -> UI state -> Composables. Avoid business logic in Composables.
- **Networking.** Retrofit or Ktor client, JSON serialisation, auth interceptor, retry policy, and typed API DTOs.
- **Local storage.** Room database plus DataStore for user/session preferences. Store only non-sensitive cached progress and wipe on sign-out where required.
- **Dependency injection.** Hilt or Koin. Use a single convention throughout.
- **Testing.** Unit tests for ViewModels/use cases, API mappers, offline sync, permission logic, and Compose UI tests for core journeys.

| Area | Screens |
| --- | --- |
| Unauthenticated | Splash, Sign-in, Forgot password / magic link if used, Terms and privacy notice. |
| Brother | Home dashboard, Passport overview, Stage detail, Milestone detail, Add mentor session, Add visitation, Add ritual performed, Submit evidence/reflection, Clarification response, Notifications, Profile. |
| Mentor | Mentor dashboard, Assigned Brothers, Brother passport detail, Review queue, Submission review, Clarification thread, Mentor session creation, Progress notes, Notifications. |
| Lodge | Lodge dashboard, Lodge Brother list, Mentor assignments, Lodge reports, Lodge-specific notes/templates, Readiness summary. |
| District | District dashboard, Lodge comparison, Stage progress analytics, overdue/stalled progress, mentor coverage, export report. |
| Admin | User management, Lodge management, role assignments, reference data, milestone templates, audit log viewer, notification templates. |
| Phase 2 enquiry | Enquiry inbox, Enquiry detail, Contact log, First meeting, Second meeting, Sponsor readiness, Outcome, Data deletion/refer. |

| Screen | Requirements |
| --- | --- |
| Home dashboard | Role-adaptive. Brother sees next action and current stage progress. Mentor sees review queue and assigned Brothers. Lodge sees Lodge progress. District sees aggregate dashboard. |
| Passport overview | Four sections visible but access-gated by rank/stage. Locked future stages visible as roadmap but not editable. Show percent complete by section and next required action. |
| Stage detail | Shows learning outcomes, additional items, mentor sessions, visitations, rituals performed, dates, section completion, mentor sign-off, and Lodge-specific notes. |
| Milestone detail | Milestone title, description, completion status, due/target date if configured, notes, evidence/reflection, verification status, reviewer, review decision history. |
| Mentor session log | Date, mentor, stage, topics covered, private/public note distinction, action items, next session target. No restricted ritual wording. |
| Visitation log | Date, Lodge visited, degree witnessed, mentor/debrief flag, high-level reflection. Do not store tiled content. |
| Ritual performed log | Date, role/ritual type at high level, stage association, optional mentor verification. Do not store wording. |
| Submission review | Verify, reject, request clarification; reason required for reject/clarification; audit entry created; Brother notified. |
| Profile | Name, Lodge, Lodge number, personal mentor, stage/rank, Solomon registration date/status, notification preferences, privacy controls. |
| Analytics dashboard | Counts by stage, stalled progress, overdue reviews, completion trends, mentor assignment coverage, exports. |

- Use a guided journey rather than a flat checklist. The Brother starts as Entered Apprentice, is later elevated/passed to Fellow Craft, then raised to Master Mason, then progresses toward office preparation.
- Future degree/stage content should be visible enough to show the journey but locked from editing until the Brother reaches that stage.
- Use plain, supportive, mentoring language. Avoid punitive compliance language for normal learning progress.
- Every rejected or clarification-requested item must show what needs to be improved and who asked for it.
- Mentor actions must be quick: one-tap verify, request clarification, reject, or add note, but reason is mandatory for negative or clarification outcomes.
- Show status chips consistently: Not started, Draft, Submitted, Clarification requested, Verified, Rejected, Completed, Locked.
- Use offline indicators: Synced, Pending upload, Conflict, Failed sync.
- Design for older users: clear contrast, larger tap targets, minimal nested menus, readable typography, no icon-only critical actions.

```
apps/android/app/src/main/java/org/dglea/passport/
  core/
    auth/
    network/
    database/
    datastore/
    permissions/
    sync/
    ui/
  feature/
    auth/
    dashboard/
    passport/
    stage/
    milestone/
    mentor/
    lodge/
    district/
    admin/
    enquiry/        # Phase 2
  domain/
    model/
    repository/
    usecase/
  data/
    api/
    dto/
    mapper/
    repository/
    local/
  navigation/
  designsystem/
  notifications/
```

## 7. Backend handover

| Area | Decision / requirement |
| --- | --- |
| API style | REST API with OpenAPI specification. GraphQL is not required for MVP. |
| Runtime | Node.js/NestJS or Kotlin/Spring Boot are both suitable. Choose one and lock conventions. This handover defines modules and contracts independent of framework. |
| Database | PostgreSQL for production. SQLite only for local tests/dev if needed. |
| Authentication | OIDC/OAuth2 where available, or email/password/magic-link with JWT access token and refresh token. All tokens must be revocable. |
| Authorisation | Server-side RBAC plus row-level/scoped checks: own record, assigned Brother, own Lodge, District scope, admin. |
| Files | Object storage for attachments if enabled. Store metadata in DB. Virus scan and content-type allowlist. |
| Notifications | Email and Android push notifications. Queue-based sending preferred; do not block API requests on notification delivery. |
| Audit | Immutable audit events for auth, role changes, mentor decisions, stage promotions, exports, data deletion, admin access, and break-glass access. |
| Reporting | Read-optimised query endpoints or materialised views for District analytics. |

- **Identity module.** Users, sessions, passwords/magic links, token issue/revoke, device sessions.
- **Organisation module.** District, Lodge, Lodge number, Lodge metadata, membership state.
- **Role and permission module.** Role assignments, effective scopes, permission checks, admin invitations.
- **Passport module.** Passport record, stage templates, milestones, progress items, completion calculations.
- **Mentorship module.** Mentor assignments, mentor sessions, review queue, review decisions, clarification workflow.
- **Activity module.** Visitations, rituals performed, Annual Communication attendance, Lodge-specific notes.
- **Progression module.** Stage status, initiation/passing/raising dates, completion dates, readiness recommendation, promotion history.
- **Notification module.** In-app notifications, email, push, reminders, templates, delivery logs.
- **Reporting module.** Lodge and District dashboards, exports, metric snapshots.
- **Enquiry module.** Phase 2 Members Pathway enquiry intake and meeting pipeline.
- **Audit module.** Immutable audit events, export audit, privacy deletion audit.

## 8. Data model

| Entity | Key fields | Purpose |
| --- | --- | --- |
| users | id, display_name, email, phone, status, preferred_name, created_at, updated_at | Human account. Do not overload this table with Lodge-specific membership state. |
| lodges | id, district_id, lodge_name, lodge_number, meeting_location, active | Approximately 45 lodges in the District. |
| role_assignments | id, user_id, role, scope_type, scope_id, active_from, active_to | Supports Brother, Personal Mentor, Lodge Mentor, District Mentor, Admin, LMO. |
| brother_profiles | id, user_id, lodge_id, current_stage, date_initiated, date_passed, date_raised, solomon_registered_on | Masonic profile associated with a user. |
| mentor_assignments | id, brother_profile_id, mentor_user_id, assignment_type, active_from, active_to | Personal Mentor and Lodge Mentor relationships. |
| passport_templates | id, version, active_from, source_reference | Template version, e.g., DGLEA Passport v2.0 Jan 2024. |
| passport_sections | id, template_id, code, title, sort_order, unlock_stage | EA, FC, MM, PREP_OFFICE. |
| milestone_templates | id, section_id, title, description, category, sort_order, requires_review | Learning outcomes and additional items. |
| passport_progress | id, brother_profile_id, milestone_template_id, status, draft_note, submitted_at, completed_at | Brother progress against template milestone. |
| reviews | id, progress_id, reviewer_user_id, decision, reason, created_at | Verify/reject/clarification decisions. |
| mentor_sessions | id, brother_profile_id, mentor_user_id, section_code, session_date, topics_summary, next_actions | High-level session record. |
| visitations | id, brother_profile_id, section_code, lodge_visited, visit_date, degree_observed, debrief_completed, reflection | High-level visit record. |
| ritual_performances | id, brother_profile_id, section_code, ritual_date, ritual_label, verified_by | Counts rituals performed without storing wording. |
| section_signoffs | id, brother_profile_id, section_code, signed_by, signed_at, outcome, note | Section completion sign-off. |
| notifications | id, user_id, type, title, body, read_at, related_resource_type, related_resource_id | In-app notifications. |
| audit_events | id, actor_user_id, action, resource_type, resource_id, scope, metadata_json, created_at | Immutable audit trail. |
| enquiries | id, lodge_id, name, email, phone, age_band_or_age, occupation, interests, reason_for_interest, stage, outcome, delete_after | Phase 2. Collect only appropriate early-stage information. |
| enquiry_contact_logs | id, enquiry_id, contact_type, contacted_at, summary, next_action_date | Phase 2 contact history. |

| Enum | Values |
| --- | --- |
| Role | BROTHER, PERSONAL_MENTOR, LODGE_MENTOR, WM_LODGE_LEADERSHIP, DISTRICT_MENTOR, DISTRICT_ADMIN, SYSTEM_ADMIN, LODGE_MEMBERSHIP_OFFICER |
| Stage | ENTERED_APPRENTICE, FELLOW_CRAFT, MASTER_MASON, PREPARING_FOR_OFFICE |
| ProgressStatus | LOCKED, NOT_STARTED, DRAFT, SUBMITTED, CLARIFICATION_REQUESTED, VERIFIED, REJECTED, COMPLETED |
| ReviewDecision | VERIFY, REJECT, REQUEST_CLARIFICATION |
| SubmissionType | MILESTONE, MENTOR_SESSION, VISITATION, RITUAL_PERFORMANCE, SECTION_SIGNOFF |
| EnquiryStage | NEW, CONTACTED, FIRST_MEETING_PLANNED, FIRST_MEETING_COMPLETED, SECOND_MEETING_PLANNED, SECOND_MEETING_COMPLETED, SPONSOR_READY, APPLICATION_READY, DECLINED, REFERRED, CLOSED |
| AuditAction | LOGIN, LOGOUT, CREATE, UPDATE, SUBMIT, REVIEW, ASSIGN_ROLE, REVOKE_ROLE, EXPORT, DELETE, BREAK_GLASS_ACCESS |

## 9. API contract outline

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /auth/login | Sign in and issue tokens. |
| POST | /auth/refresh | Refresh access token. |
| POST | /auth/logout | Revoke refresh token / device session. |
| GET | /me | Current user, roles, scopes, and feature flags. |
| GET | /lodges | List lodges visible to current user. |
| POST | /admin/lodges | Create Lodge. Admin only. |
| GET | /users | Scoped user search for admin/mentor assignment. |
| POST | /users/{id}/roles | Assign role. Admin/Lodge Mentor as allowed. |
| DELETE | /users/{id}/roles/{roleAssignmentId} | Revoke role. |
| GET | /brothers | List Brother profiles visible to current user. |
| POST | /brothers | Create Brother profile / invite user. |
| GET | /brothers/{brotherId} | Read Brother profile with scoped checks. |
| PATCH | /brothers/{brotherId} | Update permitted profile fields. |
| GET | /brothers/{brotherId}/passport | Get full Passport state for Brother. |
| GET | /passport/templates/current | Get active Passport template and milestones. |
| PATCH | /progress/{progressId}/draft | Save draft note/state. |
| POST | /progress/{progressId}/submit | Submit milestone for review. |
| POST | /progress/{progressId}/review | Verify, reject, or request clarification. |
| POST | /progress/{progressId}/clarification-response | Brother responds to clarification. |
| POST | /brothers/{brotherId}/mentor-sessions | Create mentor session record. |
| GET | /brothers/{brotherId}/mentor-sessions | List mentor sessions. |
| POST | /brothers/{brotherId}/visitations | Create visitation record. |
| GET | /brothers/{brotherId}/visitations | List visitations. |
| POST | /brothers/{brotherId}/ritual-performances | Create ritual performed record. |
| GET | /brothers/{brotherId}/ritual-performances | List ritual performed records. |
| POST | /brothers/{brotherId}/sections/{sectionCode}/signoff | Mentor/Lodge sign-off of a Passport section. |
| POST | /brothers/{brotherId}/stage-transition | Record pass/raise/progress-to-office event, with permission. |
| GET | /mentor/review-queue | Items awaiting review for current mentor. |
| GET | /lodge/{lodgeId}/dashboard | Lodge dashboard metrics. |
| GET | /district/dashboard | District analytics across lodges. |
| GET | /reports/lodge/{lodgeId}/export | Generate Lodge report export. |
| GET | /reports/district/export | Generate District report export. |
| GET | /notifications | List current user notifications. |
| PATCH | /notifications/{id}/read | Mark notification as read. |
| GET | /audit | Admin/auditor scoped audit search. |
| POST | /enquiries | Phase 2: create enquiry. |
| GET | /enquiries | Phase 2: list Lodge enquiries. |
| PATCH | /enquiries/{id} | Phase 2: update enquiry stage/outcome. |
| POST | /enquiries/{id}/contact-logs | Phase 2: record contact/meeting. |
| POST | /enquiries/{id}/privacy-delete | Phase 2: delete personal details after outcome where required. |

## 10. Workflow and state machines

| Workflow | State model |
| --- | --- |
| Progress item lifecycle | LOCKED -> NOT_STARTED -> DRAFT -> SUBMITTED -> VERIFIED -> COMPLETED. Alternative paths: SUBMITTED -> CLARIFICATION_REQUESTED -> DRAFT -> SUBMITTED; SUBMITTED -> REJECTED -> DRAFT -> SUBMITTED. |
| Stage lifecycle | ENTERED_APPRENTICE active after initiation. FELLOW_CRAFT unlocks after date passed / approved transition. MASTER_MASON unlocks after date raised / approved transition. PREPARING_FOR_OFFICE unlocks after Master Mason section completion or Lodge configuration. |
| Review lifecycle | Submitted item appears in mentor queue. Reviewer must choose verify/reject/clarify. Reject/clarify requires reason. Decision generates audit event and notification. |
| Mentor assignment lifecycle | Assign mentor -> active assignment -> optional reassignment -> inactive old assignment. Preserve historical reviews under original reviewer identity. |
| Enquiry lifecycle | NEW -> CONTACTED within expected SLA -> FIRST_MEETING -> SECOND_MEETING -> SPONSOR_READY/APPLICATION_READY or DECLINED/REFERRED/CLOSED -> privacy deletion where not becoming member. |

- A section is complete only when all mandatory milestones are verified or marked completed by authorised mentor/Lodge role, required session/visit/ritual counts are satisfied or waived by authorised role, and section sign-off is recorded.
- Stage transition should not be a simple client-side button. It must be a backend action with permission check, audit event, date record, and optional Lodge leadership confirmation.
- Counts shown on the consolidation page must be computed from verified records, not manually entered totals, while allowing administrative correction with audit if historical paper records are imported.
- Readiness recommendations must be clearly labelled as recommendations, not automatic decisions.

## 11. Privacy, security, and audit requirements

| Data area | Requirement |
| --- | --- |
| Brother profile | Name, Lodge, mentor, stage/rank dates, Solomon registered date/status, progress data. Avoid collecting unnecessary personal attributes. |
| Mentoring notes | Keep high-level and supportive. Add UI warning: do not enter ritual secrets, health details, political/religious commentary, or irrelevant personal data. |
| Enquirer records | Phase 2 must collect only appropriate early-stage details and avoid intrusive/protected information at first contact. Delete personal details of those who do not become members once outcomes/reporting are complete. |
| Attachments | Optional. Avoid by default for MVP unless there is a clear use case. If enabled, limit file types, size, and visibility. |
| Analytics | District views should use aggregate data by default and limit personal drill-down to authorised mentoring governance need. |

- All APIs authenticated except public health check and explicit public enquiry intake if approved.
- Use HTTPS only in production. Enforce HSTS at edge if web/API domain is used.
- Hash passwords with Argon2id or bcrypt if local passwords are used. Prefer SSO/OIDC if available.
- Short-lived access tokens and revocable refresh tokens. Store tokens securely on Android using encrypted storage.
- Backend permission checks must not rely on hidden UI alone.
- Audit role changes, exports, review decisions, stage transitions, data deletion, admin access, failed permission checks, and support break-glass access.
- Encrypt backups and restrict production database access.
- Add rate limiting for auth, enquiry intake, and public endpoints.
- Provide a support-safe data redaction mode for logs. Never log tokens or private notes.

## 12. Testing and acceptance criteria

| Test type | Acceptance focus |
| --- | --- |
| Unit tests | Permission evaluator, completion calculations, state transitions, DTO mappers, offline sync queue, validation rules. |
| API integration tests | Auth, role scoping, passport load, progress submission, review decisions, stage transitions, reporting, audit events. |
| Android UI tests | Brother submission flow, mentor review flow, clarification resubmission, locked stage behaviour, sign-out/account switching. |
| Security tests | Horizontal access checks: Brother cannot view another Brother; Lodge cannot view another Lodge; mentor cannot review unassigned Brother unless Lodge role permits. |
| Privacy tests | No restricted ritual wording in seeded data; enquirer deletion removes personal details but retains outcome metrics; logs redacted. |
| Performance tests | District dashboard across 45 lodges and realistic Brother volume loads within target response time. |
| Accessibility tests | Large text, contrast, talkback labels, tap targets, keyboard/focus for any web admin interface. |

- A new Brother can sign in and see only his own active Passport stage and locked future stages.
- A Brother can create, save, submit, and resubmit a milestone progress item.
- A Personal Mentor can see assigned Brothers and no unassigned Brothers unless another role grants access.
- A Mentor can verify, reject, or request clarification, and the Brother sees the outcome and reason.
- The system records mentor sessions, visitations, rituals performed, and section sign-off without storing ritual wording.
- Lodge Mentor can view all Lodge Brothers and assign/reassign Personal Mentors.
- District Mentor can view cross-lodge metrics across all lodges without inappropriate write access.
- Every review, stage transition, export, and role change creates an audit event.
- Android build and backend CI tests pass from a clean checkout.
- Seed data can create at least two lodges, multiple roles, and sample Brothers in EA/FC/MM states for demo.

## 13. Local development setup

| Variable | Purpose |
| --- | --- |
| DATABASE_URL | PostgreSQL connection string. |
| JWT_ACCESS_SECRET / JWT_REFRESH_SECRET | Token signing secrets if JWT used. |
| OIDC_ISSUER / CLIENT_ID / CLIENT_SECRET | Only if using OIDC/SSO. |
| REDIS_URL | Queue/cache if notifications or jobs use Redis. |
| SMTP_HOST / SMTP_USER / SMTP_PASSWORD | Email notification delivery. |
| PUSH_PROVIDER_* | Android push notifications if enabled. |
| OBJECT_STORAGE_* | Attachment storage if enabled. |
| AUDIT_RETENTION_DAYS | Audit retention policy setting. |

## 14. Deployment and operations

| Operational area | Requirement |
| --- | --- |
| Environments | local, dev, test/staging, production. Do not connect Android dev builds to production by default. |
| Database migrations | Use versioned migrations. No manual production schema changes. |
| Backups | Daily encrypted PostgreSQL backup, tested restore procedure, retention policy agreed by DGLEA. |
| Monitoring | Health endpoint, API latency, error rate, auth failures, job queue failures, notification failures. |
| Logging | Structured logs with request_id. No tokens, secrets, ritual detail, or private note leakage. |
| Release gates | Automated tests pass, migration tested, seed/demo verified, permission test suite pass, audit logging verified. |
| Incident response | Ability to revoke sessions, disable user, revoke role, export audit events, and rotate secrets. |

## 15. Backlog and next-build sequence

| Priority | Item | Definition of done |
| --- | --- | --- |
| P0-1 | Repository audit | Confirm current Android code state, Gradle wrapper, package names, existing screens, mock data, tests, and build output. |
| P0-2 | Domain model lock | Implement canonical enums, Passport template seed, section/milestone mapping from DGLEA Passport. |
| P0-3 | Backend skeleton | Create API service, database, migrations, auth, role assignment, seed data, OpenAPI generation. |
| P0-4 | RBAC test suite | Implement server-side permission matrix tests before broad UI work. |
| P1-1 | Brother passport screens | Passport overview, stage detail, milestone detail, draft/submit/resubmit. |
| P1-2 | Mentor review screens | Review queue, verify/reject/clarify, Brother progress detail. |
| P1-3 | Core logs | Mentor sessions, visitations, rituals performed, section sign-off. |
| P1-4 | Stage transitions | Initiated/passed/raised dates and controlled stage unlock workflow. |
| P1-5 | Notifications | In-app and email/push for review outcomes, clarification, overdue reviews. |
| P2-1 | Lodge dashboard | Lodge progress, mentor coverage, stalled Brothers, reports. |
| P2-2 | District dashboard | Cross-lodge analytics, exports, trend views, filters. |
| P2-3 | Offline sync | Room cache, sync queue, conflict handling, sign-out wipe policy. |
| P3-1 | Enquiry module | Members Pathway enquiry intake and contact flow with privacy deletion. |
| P3-2 | Reporting exports | CSV/PDF exports for Lodge and District leadership. |

1. Clone/open repository and confirm clean Android build from `apps/android`.
2. Document current screens and code modules; remove or clearly mark mock-only code.
3. Create backend repository/module and selected framework decision record.
4. Implement PostgreSQL schema migrations for users, lodges, roles, brother_profiles, passport templates, progress, reviews, and audit_events.
5. Seed DGLEA Passport v2.0 template with EA, FC, MM, and Preparing for Office sections.
6. Implement `/auth/login`, `/me`, `/brothers`, `/brothers/{id}/passport`, progress submit, and review endpoints.
7. Write RBAC integration tests for Brother, Personal Mentor, Lodge Mentor, District Mentor, and Admin.
8. Connect Android app to dev API behind repository interfaces; preserve local mock mode for UI development only.
9. Build Brother passport overview and stage detail from backend data.
10. Build Mentor review queue and review action flow with audit/notification hooks.

## 16. Handover checklist

| Checklist item | Acceptance |
| --- | --- |
| Repository access | New dev has Git access, branch policy, issue tracker, and current README. |
| Android build | New dev can run tests and assemble debug APK on Windows. |
| Backend build | New dev can run API, migrations, seed, and tests locally. |
| OpenAPI | Generated/openapi.json is available and matches Android DTOs. |
| Seed users | Demo users exist for Brother, Personal Mentor, Lodge Mentor, District Mentor, and Admin. |
| Data seed | DGLEA Passport template seeded and visible through API. |
| RBAC | Permission test suite passes, including negative cross-lodge tests. |
| Audit | Review, role, export, stage transition, and privacy deletion events are recorded. |
| Secrets | .env.example provided; no secrets committed. |
| Privacy | No restricted ritual wording or sensitive unnecessary personal data in code, seed data, screenshots, or tests. |
| Deployment | Documented dev/stage/prod deployment steps and rollback plan. |

## 17. Appendices

| Section | Group | Seed milestone content |
| --- | --- | --- |
| EA | Learning outcomes | Explain meaning and symbolism of First Degree; reconfirm grip and word / working tools / salutes at high level; learn questions and answers for passing; learn lodge bylaws/support for brethren; arrange visit to 1st degree with debriefing. |
| EA | Additional | Officers, jewels, collars, aprons; summons, agenda, ballots, notice of motion; conduct of business; introduction to charity. |
| FC | Learning outcomes | Explain meaning and symbolism of Second Degree; reconfirm grip and word / working tools / salutes / tracing board at high level; learn questions and answers for raising; Lodge layout, furniture, jewels, pedestal, gavels, carpet, letter G, tassels, Lodge banner. |
| FC | Additional | Lodge history, mother lodge, milestones; special functions; Masonic etiquette, toasts, dress, demeanour; visit other constitution with mentor and debrief. |
| MM | Learning outcomes | Explain meaning and symbolism of Third Degree; reconfirm grip and word / working tools / salutes at high level; ritual book; understand DGLEA structure; introduction to HRAC and how to join; awareness of other appendant degrees. |
| MM | Additional | Understand role of District and Grand Lodge; visiting other constitutions, especially third degree, with debrief. |
| OFFICE | Learning outcomes | Role of each Lodge Officer; Stewards Lodge and Research Lodge; District Board of Benevolence; District Board of General Purposes; Masonic disciplinary procedures; readiness for Steward or Inner Guard. |
| OFFICE | Additional | Learn to work in a team; learn to lead; learn to take responsibility; propose candidates; attendance at Annual Communication. |

Recommended in-app warning: Record only high-level mentoring progress, dates, attendance, reflections, and administrative notes. Do not enter restricted ritual wording, passwords, signs, grips, detailed ritual answers, health details, political views, or other unnecessary personal information.

### Open decisions

- Final backend framework: NestJS/Node.js or Kotlin/Spring Boot?
- Identity provider: local auth, Microsoft/Google OIDC, Lodge-issued magic link, or another DGLEA mechanism?
- Production hosting: cloud, existing district infrastructure, or managed platform?
- Whether Lodge leadership roles include Worshipful Master, Secretary, or a generic Lodge leadership role in MVP.
- Whether Brothers may self-enter initiation/passing/raising dates or only mentors/admins may update them.
- Exact retention period for inactive Brother records and enquirer records under applicable privacy requirements.
- Whether attachments are required in MVP or deferred.
- Whether the app needs multilingual support for District lodges.
- Whether Solomon registration should be self-declared, mentor-verified, or integrated through an authorised API.

### References

- District Grand Lodge of the Eastern Archipelago, Masonic Passport (Initiates Milestones), Second Edition, January 2024.
- UGLE Members Pathway, Expectation Management from the First Point of Contact, April 2025.
- UGLE Members Pathway, Enquiry Management, April 2025.
- UGLE Members Pathway, Motives for Joining Freemasonry, April 2025.
- Recovered project context: existing Android project under `apps/android` and previously proven Brother/Mentor workflow.
