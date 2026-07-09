import fs from 'node:fs';
import path from 'node:path';
import { newDb } from 'pg-mem';
import { buildHttpServer } from '../../src/app/http-server';
import { composePostgresApp } from '../../src/app/composition';
import type { SqlClient } from '../../src/shared/persistence/sql-client';

class PgMemSqlClient implements SqlClient {
  constructor(private readonly client: { query: (statement: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> }) {}

  async query<TRow = Record<string, unknown>>(statement: string, params?: unknown[]): Promise<{ rows: TRow[] }> {
    const result = await this.client.query(statement, params);
    return { rows: result.rows as TRow[] };
  }
}

async function login(server: ReturnType<typeof buildHttpServer>, email: string): Promise<string> {
  const response = await server.inject({ method: 'POST', url: '/auth/login', payload: { email, password: 'pass' } });
  expect(response.statusCode).toBe(200);
  return response.json().accessToken as string;
}

async function buildPostgresTransportServer() {
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
    ) VALUES ('ti_core_1', 'sec_1', 'ITEM1', 'Know signs', 'LEARNING_OUTCOME', 1, TRUE);
    INSERT INTO learning_outcome_templates (
      id, section_template_id, lodge_id, item_code, title, item_type, display_order, is_district_core
    ) VALUES ('ti_lodge_1', 'sec_1', 'lodge_1', 'ITEM2', 'Lodge supplement item', 'CUSTOM_SUPPLEMENT', 2, FALSE);
  `);

  const server = buildHttpServer(composePostgresApp(new PgMemSqlClient(client)));
  return { server, client };
}

describe('http transport integration', () => {
  it('supports clarification -> resubmit -> verify through HTTP routes', async () => {
    const server = buildHttpServer();

    const brotherToken = await login(server, 'brother@example.org');
    const mentorToken = await login(server, 'mentor@example.org');

    const created = await server.inject({
      method: 'POST',
      url: '/members/mp_1/passport-records',
      headers: { authorization: `Bearer ${brotherToken}` },
      payload: {
        districtId: 'dist_1',
        lodgeId: 'lodge_1',
        sectionTemplateId: 'sec_1',
        templateItemId: 'ti_1',
      },
    });
    const draftId = created.json().id as string;

    await server.inject({ method: 'POST', url: `/passport-records/${draftId}/submit`, headers: { authorization: `Bearer ${brotherToken}` } });

    const mentorNotificationsAfterSubmit = await server.inject({
      method: 'GET',
      url: '/notifications',
      headers: { authorization: `Bearer ${mentorToken}` },
    });
    expect(mentorNotificationsAfterSubmit.statusCode).toBe(200);
    expect(mentorNotificationsAfterSubmit.json().items[0]).toMatchObject({
      type: 'PASSPORT_RECORD_SUBMITTED',
      recordId: draftId,
    });

    const clarified = await server.inject({
      method: 'POST',
      url: `/passport-records/${draftId}/clarification`,
      headers: { authorization: `Bearer ${mentorToken}` },
      payload: { reason: 'Need detail' },
    });
    expect(clarified.statusCode).toBe(200);
    expect(clarified.json().status).toBe('NEEDS_CLARIFICATION');

    const brotherNotificationsAfterClarification = await server.inject({
      method: 'GET',
      url: '/notifications',
      headers: { authorization: `Bearer ${brotherToken}` },
    });
    expect(brotherNotificationsAfterClarification.statusCode).toBe(200);
    expect(brotherNotificationsAfterClarification.json().items[0]).toMatchObject({
      type: 'PASSPORT_RECORD_CLARIFICATION_REQUESTED',
      recordId: draftId,
    });

    const clarifiedResponse = await server.inject({
      method: 'PATCH',
      url: `/passport-records/${draftId}`,
      headers: { authorization: `Bearer ${brotherToken}` },
      payload: { note: 'Uploaded additional details for mentor review' },
    });
    expect(clarifiedResponse.statusCode).toBe(200);
    expect(clarifiedResponse.json().note).toBe('Uploaded additional details for mentor review');

    const resubmitted = await server.inject({ method: 'POST', url: `/passport-records/${draftId}/submit`, headers: { authorization: `Bearer ${brotherToken}` } });
    expect(resubmitted.statusCode).toBe(200);
    expect(resubmitted.json().status).toBe('SUBMITTED');

    const queue = await server.inject({
      method: 'GET',
      url: '/verification-queue',
      headers: { authorization: `Bearer ${mentorToken}` },
    });
    expect(queue.statusCode).toBe(200);
    expect(queue.json().items[0]).toMatchObject({
      passportRecordId: draftId,
      currentStatus: 'SUBMITTED',
      note: 'Uploaded additional details for mentor review',
    });

    const verified = await server.inject({ method: 'POST', url: `/passport-records/${draftId}/verify`, headers: { authorization: `Bearer ${mentorToken}` } });
    expect(verified.statusCode).toBe(200);
    expect(verified.json().status).toBe('VERIFIED');

    const brotherNotificationsAfterVerify = await server.inject({
      method: 'GET',
      url: '/notifications',
      headers: { authorization: `Bearer ${brotherToken}` },
    });
    expect(brotherNotificationsAfterVerify.statusCode).toBe(200);
    expect(brotherNotificationsAfterVerify.json().items[0]).toMatchObject({
      type: 'PASSPORT_RECORD_VERIFIED',
      recordId: draftId,
    });

    const summary = await server.inject({
      method: 'GET',
      url: '/members/mp_1/passport-summary',
      headers: { authorization: `Bearer ${brotherToken}` },
    });
    expect(summary.statusCode).toBe(200);
    expect(summary.json().sections).toHaveLength(4);
    expect(summary.json().sections[0]).toMatchObject({
      sectionCode: 'EA',
      progressState: 'VERIFIED',
      latestRecordId: draftId,
      latestStatus: 'VERIFIED',
    });

    await server.close();
  });

  it('supports override through HTTP transport layer', async () => {
    const server = buildHttpServer();

    const brotherToken = await login(server, 'brother@example.org');
    const mentorToken = await login(server, 'mentor@example.org');

    const created = await server.inject({
      method: 'POST',
      url: '/members/mp_1/passport-records',
      headers: { authorization: `Bearer ${brotherToken}` },
      payload: {
        districtId: 'dist_1',
        lodgeId: 'lodge_1',
        sectionTemplateId: 'sec_1',
        templateItemId: 'ti_1',
      },
    });
    const recordId = created.json().id as string;

    await server.inject({ method: 'POST', url: `/passport-records/${recordId}/submit`, headers: { authorization: `Bearer ${brotherToken}` } });
    const rejected = await server.inject({
      method: 'POST',
      url: `/passport-records/${recordId}/reject`,
      headers: { authorization: `Bearer ${mentorToken}` },
      payload: { reason: 'Insufficient evidence' },
    });
    expect(rejected.statusCode).toBe(200);
    expect(rejected.json().status).toBe('REJECTED');

    const overridden = await server.inject({
      method: 'POST',
      url: `/passport-records/${recordId}/override`,
      headers: { authorization: `Bearer ${mentorToken}` },
      payload: { targetStatus: 'VERIFIED', reason: 'Manual override' },
    });
    expect(overridden.statusCode).toBe(200);
    expect(overridden.json().status).toBe('VERIFIED');

    await server.close();
  });

  it('round-trips lodge supplement metadata through HTTP transport (postgres composition)', async () => {
    const { server, client } = await buildPostgresTransportServer();
    const brotherToken = await login(server, 'brother@example.org');

    const created = await server.inject({
      method: 'POST',
      url: '/members/mp_1/passport-records',
      headers: { authorization: `Bearer ${brotherToken}` },
      payload: {
        districtId: 'dist_1',
        lodgeId: 'lodge_1',
        sectionTemplateId: 'sec_1',
        templateItemId: 'ti_lodge_1',
      },
    });

    expect(created.statusCode).toBe(200);
    expect(created.json()).toMatchObject({
      templateItemId: 'ti_lodge_1',
      templateIsDistrictCore: false,
      templateLodgeId: 'lodge_1',
    });

    const row = await client.query('SELECT title_snapshot, template_item_is_district_core, template_item_lodge_id FROM passport_records WHERE id = $1', [created.json().id]);
    expect(row.rows[0]).toMatchObject({
      title_snapshot: 'Lodge supplement item',
      template_item_is_district_core: false,
      template_item_lodge_id: 'lodge_1',
    });

    await server.close();
    await client.end();
  });
});
