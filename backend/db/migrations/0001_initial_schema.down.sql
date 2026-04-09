-- 0001_initial_schema.down.sql

BEGIN;

DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS lodge_configurations;
DROP TABLE IF EXISTS feature_flag_targets;
DROP TABLE IF EXISTS feature_flags;
DROP TABLE IF EXISTS report_snapshots;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS private_mentoring_notes;
DROP TABLE IF EXISTS operational_notes;
DROP TABLE IF EXISTS verification_decisions;
DROP TABLE IF EXISTS passport_record_versions;
DROP TABLE IF EXISTS passport_records;
DROP TABLE IF EXISTS learning_outcome_templates;
DROP TABLE IF EXISTS passport_section_templates;
DROP TABLE IF EXISTS mentor_assignments;
DROP TABLE IF EXISTS member_profiles;
DROP TABLE IF EXISTS user_scope_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS lodges;
DROP TABLE IF EXISTS districts;

DROP TYPE IF EXISTS verification_decision_type;
DROP TYPE IF EXISTS verification_policy;
DROP TYPE IF EXISTS item_type;
DROP TYPE IF EXISTS passport_record_status;
DROP TYPE IF EXISTS member_degree_status;
DROP TYPE IF EXISTS mentor_role_type;
DROP TYPE IF EXISTS scope_type;
DROP TYPE IF EXISTS role_code;

COMMIT;
