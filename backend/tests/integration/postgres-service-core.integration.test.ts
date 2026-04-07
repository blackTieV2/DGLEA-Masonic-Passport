import fs from 'node:fs';
import path from 'node:path';
import { newDb } from 'pg-mem';
import type { CurrentUserContext } from '../../src/shared/contracts/authorization';
import { composePostgresApp } from '../../src/app/composition';
import type { SqlClient } from '../../src/shared/persistence/sql-client';
import { ForbiddenError } from '../../src/shared/utilities/errors';

class PgMemSqlClient implements SqlClient {
  constructor(private readonly client: { query: (statement: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> }) {}

  async query<TRow = Record<string, unknown>>(statement: string, params?: unknown[]): Promise<{ rows: TRow[] }> {
    const result = await this.client.query(statement, params);
    return { rows: result.rows as TRow[] };
  }
}

function lodgeMentorContext(): CurrentUserContext {
  return {
    identity: {
      userId: 'usr_mentor',
      email: 'mentor@example.org',
      displayName: 'Mentor',
      status: 'ACTIVE',
    },
    roles: [{ roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', districtId: 'dist_1', lodgeId: 'lodge_1', active: true }],
  };
}

function personalMentorContext(assignedMemberUserIds: string[]): CurrentUserContext {
  return {
    identity: {
      userId: 'usr_personal_mentor',
      email: 'pmentor@example.org',
      displayName: 'Personal Mentor',
      status: 'ACTIVE',
    },
    roles: [{ roleCode: 'PERSONAL_MENTOR', scopeType: 'ASSIGNED_MEMBER', assignedMemberUserIds, active: true }],
  };
}

async function setupPostgresApp() {
  const db = newDb();
  const pg = db.adapters.createPg();
  const client = new pg.Client();
  await client.connect();

  const migrationSql = fs.readFileSync(path.resolve(__dirname, '../../db/migrations/0001_initial_schema.up.sql'), 'utf8');
  await client.query(migrationSql);

  await client.query(`
    INSERT INTO districts (id, code, name) VALUES ('dist_1', 'D1', 'District 1');
    INSERT INTO lodges (id, district_id, lodge_number, name) VALUES ('lodge_1', 'dist_1', '101', 'Lodge 101');
    INSERT INTO users (id, email, display_name) VALUES
      ('usr_member', 'member@example.org', 'Member'),
      ('usr_submitter', 'submitter@example.org', 'Submitter'),
      ('usr_mentor', 'mentor@example.org', 'Mentor'),
      ('usr_personal_mentor', 'pmentor@example.org', 'Personal Mentor');
    INSERT INTO member_profiles (id, user_id, district_id, lodge_id, degree_status)
    VALUES ('mp_1', 'usr_member', 'dist_1', 'lodge_1', 'ENTERED_APPRENTICE');
    INSERT INTO passport_section_templates (id, district_id, code, name, display_order)
    VALUES ('sec_1', 'dist_1', 'EA', 'Entered Apprentice', 1);
    INSERT INTO learning_outcome_templates (
      id, section_template_id, item_code, title, item_type, display_order, is_district_core
    ) VALUES
      ('ti_core_1', 'sec_1', 'ITEM1', 'Know signs', 'LEARNING_OUTCOME', 1, TRUE);
    INSERT INTO learning_outcome_templates (
      id, section_template_id, lodge_id, item_code, title, item_type, display_order, is_district_core
    ) VALUES ('ti_lodge_1', 'sec_1', 'lodge_1', 'ITEM2', 'Lodge supplement item', 'CUSTOM_SUPPLEMENT', 2, FALSE);
  `);

  const sqlClient = new PgMemSqlClient(client);
  const app = composePostgresApp(sqlClient);
  return { client, app };
}

describe('postgres-backed service core', () => {
  it('runs clarification -> resubmit -> verify through postgres repositories', async () => {
    const { client, app } = await setupPostgresApp();

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'dist_1',
      lodgeId: 'lodge_1',
      sectionTemplateId: 'sec_1',
      templateItemId: 'ti_core_1',
      actorUserId: 'usr_submitter',
      note: 'draft note',
    });
    const submitted = await app.passport.submitForVerification({ recordId: draft.id, actorUserId: 'usr_submitter' });
    const clarified = await app.verification.requestClarification({
      recordId: submitted.id,
      reason: 'Need more detail',
      actor: lodgeMentorContext(),
    });

    expect(clarified.status).toBe('NEEDS_CLARIFICATION');

    const resubmitted = await app.passport.submitForVerification({ recordId: submitted.id, actorUserId: 'usr_submitter' });
    const verified = await app.verification.verify({ recordId: resubmitted.id, actor: lodgeMentorContext() });

    expect(verified.status).toBe('VERIFIED');

    await client.end();
  });

  it('persists override decisions and updates record status in postgres path', async () => {
    const { client, app } = await setupPostgresApp();

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1', districtId: 'dist_1', lodgeId: 'lodge_1', sectionTemplateId: 'sec_1', templateItemId: 'ti_core_1', actorUserId: 'usr_submitter',
    });
    const submitted = await app.passport.submitForVerification({ recordId: draft.id, actorUserId: 'usr_submitter' });

    const overridden = await app.verification.override({
      recordId: submitted.id,
      targetStatus: 'REJECTED',
      reason: 'Administrative override',
      actor: lodgeMentorContext(),
    });

    expect(overridden.status).toBe('REJECTED');

    const decisions = await client.query('SELECT decision_type, prior_status, new_status FROM verification_decisions ORDER BY acted_at');
    expect(decisions.rows.at(-1)).toMatchObject({ decision_type: 'OVERRIDDEN', prior_status: 'SUBMITTED', new_status: 'REJECTED' });

    await client.end();
  });

  it('round-trips lodge supplement template metadata and title snapshot', async () => {
    const { client, app } = await setupPostgresApp();

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'dist_1',
      lodgeId: 'lodge_1',
      sectionTemplateId: 'sec_1',
      templateItemId: 'ti_lodge_1',
      actorUserId: 'usr_submitter',
    });

    expect(draft.templateItemId).toBe('ti_lodge_1');

    const row = await client.query('SELECT title_snapshot, template_item_is_district_core, template_item_lodge_id FROM passport_records WHERE id = $1', [draft.id]);
    expect(row.rows[0]).toMatchObject({
      title_snapshot: 'Lodge supplement item',
      template_item_is_district_core: false,
      template_item_lodge_id: 'lodge_1',
    });

    await client.end();
  });

  it('persists note, reviewReason and submittedAt in postgres repository', async () => {
    const { client, app } = await setupPostgresApp();

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'dist_1',
      lodgeId: 'lodge_1',
      sectionTemplateId: 'sec_1',
      templateItemId: 'ti_core_1',
      actorUserId: 'usr_submitter',
      note: 'note value',
    });

    const submitted = await app.passport.submitForVerification({ recordId: draft.id, actorUserId: 'usr_submitter' });
    const clarified = await app.verification.requestClarification({ recordId: submitted.id, reason: 'reason value', actor: lodgeMentorContext() });

    const row = await client.query(
      'SELECT note, review_reason, submitted_at FROM passport_records WHERE id = $1',
      [clarified.id],
    );

    expect(row.rows[0].note).toBe('note value');
    expect(row.rows[0].review_reason).toBe('reason value');
    expect(row.rows[0].submitted_at).toBeTruthy();

    await client.end();
  });

  it('enforces assigned scope against member identity, not created_by_user_id', async () => {
    const { client, app } = await setupPostgresApp();

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'dist_1',
      lodgeId: 'lodge_1',
      sectionTemplateId: 'sec_1',
      templateItemId: 'ti_core_1',
      actorUserId: 'usr_submitter',
    });
    const submitted = await app.passport.submitForVerification({ recordId: draft.id, actorUserId: 'usr_submitter' });

    await expect(
      app.verification.verify({
        recordId: submitted.id,
        actor: personalMentorContext(['usr_submitter']),
      }),
    ).rejects.toThrow(ForbiddenError);

    const verified = await app.verification.verify({
      recordId: submitted.id,
      actor: personalMentorContext(['usr_member']),
    });

    expect(verified.status).toBe('VERIFIED');

    await client.end();
  });
});
