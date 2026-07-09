BEGIN;

INSERT INTO districts (id, name, active, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'District Grand Lodge of the Eastern Archipelago', true, NOW(), NOW());

INSERT INTO lodges (id, district_id, lodge_name, lodge_number, meeting_location, active, created_at, updated_at)
VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Singapore Lodge', 'L-001', 'Singapore', true, NOW(), NOW());

INSERT INTO users (id, firebase_uid, display_name, email, status, created_at, updated_at)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'dev-brother-ea', 'Brother EA', 'brother.ea@example.local', 'ACTIVE', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333332', 'dev-lodge-mentor', 'Lodge Mentor', 'lodge.mentor@example.local', 'ACTIVE', NOW(), NOW());

INSERT INTO role_assignments (id, user_id, role, scope_type, scope_id, active_from, created_at)
VALUES
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'BROTHER', 'GLOBAL', NULL, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', 'LODGE_MENTOR', 'LODGE', '22222222-2222-2222-2222-222222222221', NOW(), NOW());

INSERT INTO brother_profiles (id, user_id, lodge_id, current_stage, date_initiated, created_at, updated_at)
VALUES
  ('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'ENTERED_APPRENTICE', '2025-01-15T00:00:00Z', NOW(), NOW());

INSERT INTO mentor_assignments (id, brother_profile_id, mentor_user_id, assignment_type, active_from, created_at)
VALUES
  ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333332', 'PERSONAL_MENTOR', NOW(), NOW());

INSERT INTO passport_templates (id, version, source_reference, active_from, active, created_at, updated_at)
VALUES
  ('77777777-7777-7777-7777-777777777771', '1.0.0', 'DGLEA-PP-SMOKE', '2026-01-01T00:00:00Z', true, NOW(), NOW());

INSERT INTO passport_sections (id, template_id, code, title, sort_order, unlock_stage, created_at)
VALUES
  ('88888888-8888-8888-8888-888888888881', '77777777-7777-7777-7777-777777777771', 'ENTERED_APPRENTICE', 'Entered Apprentice', 1, 'ENTERED_APPRENTICE', NOW());

INSERT INTO milestone_templates (id, section_id, title, description, category, sort_order, requires_review, target_count, created_at)
VALUES
  ('99999999-9999-9999-9999-999999999991', '88888888-8888-8888-8888-888888888881', 'Review permitted First Degree learning topics with mentor', 'Smoke-test milestone', 'learning', 1, true, 1, NOW());

INSERT INTO passport_progress (id, brother_profile_id, milestone_template_id, status, version, draft_note, submitted_at, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '55555555-5555-5555-5555-555555555551', '99999999-9999-9999-9999-999999999991', 'SUBMITTED', 0, 'Smoke-test submission note', NOW(), NOW(), NOW());

COMMIT;
