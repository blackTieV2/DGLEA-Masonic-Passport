-- 0001_initial_schema.up.sql
-- Initial relational schema skeleton for DGLEA Masonic Passport (modular monolith)
-- Notes:
-- - PostgreSQL-oriented SQL
-- - Focused on structure, constraints, and auditability
-- - No production data insertion in this migration

BEGIN;

-- ---------- Shared enums ----------
CREATE TYPE role_code AS ENUM (
  'BROTHER',
  'PERSONAL_MENTOR',
  'LODGE_MENTOR',
  'LODGE_REVIEWER',
  'LODGE_ADMIN',
  'DISTRICT_MENTOR',
  'DISTRICT_ADMIN',
  'SYSTEM_ADMIN'
);

CREATE TYPE scope_type AS ENUM ('SYSTEM', 'DISTRICT', 'LODGE', 'ASSIGNED_MEMBER');

CREATE TYPE mentor_role_type AS ENUM ('PERSONAL_MENTOR', 'LODGE_MENTOR');

CREATE TYPE member_degree_status AS ENUM (
  'ENTERED_APPRENTICE',
  'FELLOW_CRAFT',
  'MASTER_MASON',
  'PREPARING_FOR_OFFICE',
  'INACTIVE',
  'ARCHIVED'
);

CREATE TYPE passport_record_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'NEEDS_CLARIFICATION',
  'VERIFIED',
  'REJECTED',
  'SUPERSEDED',
  'ARCHIVED'
);

CREATE TYPE item_type AS ENUM (
  'LEARNING_OUTCOME',
  'MENTOR_SESSION',
  'VISITATION',
  'RITUAL_PARTICIPATION',
  'MILESTONE',
  'ANNUAL_COMMUNICATION',
  'PREPARING_FOR_OFFICE',
  'CUSTOM_SUPPLEMENT'
);

CREATE TYPE verification_policy AS ENUM (
  'PERSONAL_MENTOR_ONLY',
  'LODGE_MENTOR_ONLY',
  'EITHER_PERSONAL_OR_LODGE',
  'DUAL_VERIFICATION'
);

CREATE TYPE verification_decision_type AS ENUM (
  'SUBMITTED',
  'VERIFIED',
  'REJECTED',
  'REQUESTED_CLARIFICATION',
  'OVERRIDDEN',
  'SUPERSEDED',
  'ARCHIVED'
);

-- ---------- Organisation ----------
CREATE TABLE districts (
  id                  TEXT PRIMARY KEY,
  code                TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lodges (
  id                  TEXT PRIMARY KEY,
  district_id         TEXT NOT NULL REFERENCES districts(id),
  lodge_number        TEXT NOT NULL,
  name                TEXT NOT NULL,
  short_name          TEXT,
  timezone            TEXT NOT NULL DEFAULT 'UTC',
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (district_id, lodge_number)
);

-- ---------- Identity and roles ----------
CREATE TABLE users (
  id                  TEXT PRIMARY KEY,
  email               TEXT NOT NULL UNIQUE,
  mobile_number       TEXT,
  given_name          TEXT,
  family_name         TEXT,
  display_name        TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  last_login_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id                  TEXT PRIMARY KEY,
  code                role_code NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_scope_roles (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id),
  role_id             TEXT NOT NULL REFERENCES roles(id),
  district_id         TEXT REFERENCES districts(id),
  lodge_id            TEXT REFERENCES lodges(id),
  scope_type          scope_type NOT NULL,
  active_from         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active_to           TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (scope_type = 'SYSTEM' AND district_id IS NULL AND lodge_id IS NULL)
    OR (scope_type = 'DISTRICT' AND district_id IS NOT NULL)
    OR (scope_type = 'LODGE' AND lodge_id IS NOT NULL)
    OR scope_type = 'ASSIGNED_MEMBER'
  )
);

-- ---------- Member profile and mentor history ----------
CREATE TABLE member_profiles (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id),
  district_id         TEXT NOT NULL REFERENCES districts(id),
  lodge_id            TEXT NOT NULL REFERENCES lodges(id),
  membership_number   TEXT,
  date_joined_platform DATE,
  degree_status       member_degree_status NOT NULL,
  initiated_at        DATE,
  passed_at           DATE,
  raised_at           DATE,
  solomon_registered_at DATE,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lodge_id)
);

CREATE TABLE mentor_assignments (
  id                  TEXT PRIMARY KEY,
  member_profile_id   TEXT NOT NULL REFERENCES member_profiles(id),
  mentor_user_id      TEXT NOT NULL REFERENCES users(id),
  mentor_role_type    mentor_role_type NOT NULL,
  lodge_id            TEXT NOT NULL REFERENCES lodges(id),
  is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
  active_from         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active_to           TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (active_to IS NULL OR active_to >= active_from)
);

-- ---------- Templates (district core + lodge supplement distinction) ----------
CREATE TABLE passport_section_templates (
  id                  TEXT PRIMARY KEY,
  district_id         TEXT NOT NULL REFERENCES districts(id),
  code                TEXT NOT NULL,
  name                TEXT NOT NULL,
  display_order       INTEGER NOT NULL,
  description         TEXT,
  is_district_core    BOOLEAN NOT NULL DEFAULT TRUE,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (district_id, code)
);

CREATE TABLE learning_outcome_templates (
  id                  TEXT PRIMARY KEY,
  section_template_id TEXT NOT NULL REFERENCES passport_section_templates(id),
  lodge_id            TEXT REFERENCES lodges(id),
  item_code           TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  item_type           item_type NOT NULL,
  display_order       INTEGER NOT NULL,
  verification_required BOOLEAN NOT NULL DEFAULT TRUE,
  is_district_core    BOOLEAN NOT NULL,
  status              TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (is_district_core = TRUE AND lodge_id IS NULL)
    OR (is_district_core = FALSE AND lodge_id IS NOT NULL)
  )
);

-- ---------- Records and lifecycle distinction ----------
CREATE TABLE passport_records (
  id                          TEXT PRIMARY KEY,
  member_profile_id           TEXT NOT NULL REFERENCES member_profiles(id),
  section_template_id         TEXT NOT NULL REFERENCES passport_section_templates(id),
  learning_outcome_template_id TEXT REFERENCES learning_outcome_templates(id),
  record_type                 item_type NOT NULL,
  title_snapshot              TEXT NOT NULL,
  description_snapshot        TEXT,
  template_item_is_district_core BOOLEAN,
  template_item_lodge_id      TEXT,
  event_date                  DATE,
  note                        TEXT,
  review_reason               TEXT,
  submitted_at                TIMESTAMPTZ,
  supersedes_record_id        TEXT,
  status                      passport_record_status NOT NULL DEFAULT 'DRAFT',
  current_version             INTEGER NOT NULL DEFAULT 1,
  is_official_progress        BOOLEAN NOT NULL DEFAULT FALSE,
  lodge_id                    TEXT NOT NULL REFERENCES lodges(id),
  district_id                 TEXT NOT NULL REFERENCES districts(id),
  created_by_user_id          TEXT NOT NULL REFERENCES users(id),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (status = 'VERIFIED' AND is_official_progress = TRUE)
    OR (status <> 'VERIFIED' AND is_official_progress = FALSE)
  )
);

CREATE TABLE passport_record_versions (
  id                  TEXT PRIMARY KEY,
  passport_record_id  TEXT NOT NULL REFERENCES passport_records(id),
  version_number      INTEGER NOT NULL,
  payload_json        JSONB NOT NULL,
  change_reason       TEXT,
  created_by_user_id  TEXT NOT NULL REFERENCES users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (passport_record_id, version_number)
);

CREATE TABLE verification_decisions (
  id                  TEXT PRIMARY KEY,
  passport_record_id  TEXT NOT NULL REFERENCES passport_records(id),
  decision_type       verification_decision_type NOT NULL,
  prior_status        passport_record_status,
  new_status          passport_record_status NOT NULL,
  decision_reason     TEXT,
  actor_user_id       TEXT NOT NULL REFERENCES users(id),
  actor_role_code     role_code NOT NULL,
  acted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Notes (do not collapse private mentoring notes) ----------
CREATE TABLE operational_notes (
  id                  TEXT PRIMARY KEY,
  passport_record_id  TEXT NOT NULL REFERENCES passport_records(id),
  author_user_id      TEXT NOT NULL REFERENCES users(id),
  note_type           TEXT NOT NULL,
  content             TEXT NOT NULL,
  visibility_scope    TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE private_mentoring_notes (
  id                  TEXT PRIMARY KEY,
  member_profile_id   TEXT NOT NULL REFERENCES member_profiles(id),
  author_user_id      TEXT NOT NULL REFERENCES users(id),
  lodge_id            TEXT NOT NULL REFERENCES lodges(id),
  content             TEXT NOT NULL,
  visibility_policy   TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Notifications ----------
CREATE TABLE notifications (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id),
  notification_type   TEXT NOT NULL,
  channel             TEXT NOT NULL,
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id   TEXT,
  status              TEXT NOT NULL,
  scheduled_at        TIMESTAMPTZ,
  sent_at             TIMESTAMPTZ,
  read_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Reporting ----------
CREATE TABLE report_snapshots (
  id                  TEXT PRIMARY KEY,
  report_type         TEXT NOT NULL,
  scope_type          TEXT NOT NULL,
  scope_id            TEXT NOT NULL,
  generated_by_user_id TEXT NOT NULL REFERENCES users(id),
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_uri            TEXT,
  parameters_json     JSONB NOT NULL DEFAULT '{}'::JSONB
);

-- ---------- Configuration / feature flags ----------
CREATE TABLE feature_flags (
  id                  TEXT PRIMARY KEY,
  key                 TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  flag_type           TEXT NOT NULL,
  default_state       BOOLEAN NOT NULL,
  owner_user_id       TEXT REFERENCES users(id),
  description         TEXT,
  expires_at          TIMESTAMPTZ,
  status              TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feature_flag_targets (
  id                  TEXT PRIMARY KEY,
  feature_flag_id     TEXT NOT NULL REFERENCES feature_flags(id),
  target_type         TEXT NOT NULL,
  target_value        TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lodge_configurations (
  id                  TEXT PRIMARY KEY,
  lodge_id            TEXT NOT NULL UNIQUE REFERENCES lodges(id),
  verification_policy verification_policy NOT NULL DEFAULT 'EITHER_PERSONAL_OR_LODGE',
  private_notes_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  custom_items_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_policy_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Auditability ----------
CREATE TABLE audit_events (
  id                  TEXT PRIMARY KEY,
  event_type          TEXT NOT NULL,
  entity_type         TEXT NOT NULL,
  entity_id           TEXT NOT NULL,
  actor_user_id       TEXT REFERENCES users(id),
  actor_role_code     role_code,
  district_id         TEXT REFERENCES districts(id),
  lodge_id            TEXT REFERENCES lodges(id),
  prior_state         TEXT,
  new_state           TEXT,
  reason              TEXT,
  metadata_json       JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- High-value indexes ----------
CREATE UNIQUE INDEX ux_learning_outcome_templates_scope_code
  ON learning_outcome_templates (section_template_id, item_code, COALESCE(lodge_id, 'DISTRICT_CORE'));

CREATE INDEX idx_member_profiles_lodge_id ON member_profiles(lodge_id);
CREATE INDEX idx_member_profiles_district_id ON member_profiles(district_id);
CREATE INDEX idx_mentor_assignments_member_profile_id ON mentor_assignments(member_profile_id);
CREATE INDEX idx_mentor_assignments_mentor_user_id ON mentor_assignments(mentor_user_id);
CREATE INDEX idx_passport_records_member_profile_id ON passport_records(member_profile_id);
CREATE INDEX idx_passport_records_status ON passport_records(status);
CREATE INDEX idx_passport_records_lodge_id ON passport_records(lodge_id);
CREATE INDEX idx_verification_decisions_record_id ON verification_decisions(passport_record_id);
CREATE INDEX idx_private_mentoring_notes_member_profile_id ON private_mentoring_notes(member_profile_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_user_id);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at);

COMMIT;
