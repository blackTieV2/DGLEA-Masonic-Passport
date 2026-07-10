# backend/db

Initial relational database skeleton for the DGLEA Masonic Passport modular monolith.

## Strategy

This schema follows a **single relational system-of-record** approach.

Key design rules enforced by the skeleton:

1. **District core vs lodge supplement distinction is preserved**
   - `learning_outcome_templates.is_district_core`
   - `learning_outcome_templates.lodge_id` + constraint

2. **Record lifecycle status distinction is preserved**
   - `passport_records.status` uses explicit lifecycle enum
   - `passport_records.is_official_progress` is constrained to `VERIFIED`

3. **Auditability is first-class**
   - `verification_decisions` captures state transitions and actors
   - `audit_events` captures cross-cutting operational actions

4. **Mentor assignment history is preserved**
   - `mentor_assignments.active_from` / `active_to`
   - no destructive overwrite implied by schema

5. **Private mentoring notes are segregated**
   - `operational_notes` and `private_mentoring_notes` are separate tables
   - private notes are not collapsed into generic comments

## Folder layout

- `migrations/` — forward/backward schema migrations
- `seeds/` — non-production placeholder seed scripts
- `fixtures/` — test fixture placeholders only

## Files

- `migrations/0001_initial_schema.up.sql`
- `migrations/0001_initial_schema.down.sql`

These files provide an initial, reviewable skeleton and are intentionally conservative.

## Naming conventions

- table names: plural snake_case
- primary keys: `id` (text for now; actual generator to be decided)
- timestamps: `created_at`, `updated_at`
- status/role/type fields: enum-backed where important to workflow integrity

## What is intentionally not included yet

- production data
- performance tuning beyond foundational indexes
- archival/partitioning strategy
- DB triggers for updated_at automation
- irreversible migration policy

Those will be added as implementation matures.
