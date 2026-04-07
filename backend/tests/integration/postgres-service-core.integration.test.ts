import fs from 'node:fs';
import path from 'node:path';
import { newDb } from 'pg-mem';
import type { CurrentUserContext } from '../../src/shared/contracts/authorization';
import { composePostgresApp } from '../../src/app/composition';
import type { SqlClient } from '../../src/shared/persistence/sql-client';

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

describe('postgres-backed service core', () => {
  it('runs passport draft -> submit -> verify happy path through postgres repositories', async () => {
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
        ('usr_brother', 'brother@example.org', 'Brother'),
        ('usr_mentor', 'mentor@example.org', 'Mentor');
      INSERT INTO member_profiles (id, user_id, district_id, lodge_id, degree_status)
      VALUES ('mp_1', 'usr_brother', 'dist_1', 'lodge_1', 'ENTERED_APPRENTICE');
      INSERT INTO passport_section_templates (id, district_id, code, name, display_order)
      VALUES ('sec_1', 'dist_1', 'EA', 'Entered Apprentice', 1);
      INSERT INTO learning_outcome_templates (
        id, section_template_id, item_code, title, item_type, display_order, is_district_core
      ) VALUES ('ti_1', 'sec_1', 'ITEM1', 'Know signs', 'LEARNING_OUTCOME', 1, TRUE);
    `);

    const sqlClient = new PgMemSqlClient(client);
    const app = composePostgresApp(sqlClient);

    const draft = await app.passport.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'dist_1',
      lodgeId: 'lodge_1',
      sectionTemplateId: 'sec_1',
      templateItemId: 'ti_1',
      actorUserId: 'usr_brother',
      note: 'first draft',
    });

    const submitted = await app.passport.submitForVerification({
      recordId: draft.id,
      actorUserId: 'usr_brother',
    });

    const verified = await app.verification.verify({
      recordId: submitted.id,
      actor: lodgeMentorContext(),
    });

    expect(verified.status).toBe('VERIFIED');
    expect(verified.isOfficialProgress).toBe(true);

    const decisions = await client.query('SELECT decision_type, prior_status, new_status FROM verification_decisions ORDER BY acted_at');
    expect(decisions.rows.at(-1)).toMatchObject({
      decision_type: 'VERIFIED',
      prior_status: 'SUBMITTED',
      new_status: 'VERIFIED',
    });

    await client.end();
  });
});
