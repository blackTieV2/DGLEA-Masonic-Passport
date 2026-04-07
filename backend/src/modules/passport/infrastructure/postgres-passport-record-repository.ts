import type { SqlClient } from '../../../shared/persistence/sql-client';
import type { PassportRecordRepository } from '../application/ports';
import type { PassportRecord } from '../domain/contracts';

interface PassportRecordRow {
  id: string;
  member_profile_id: string;
  district_id: string;
  lodge_id: string;
  section_template_id: string;
  learning_outcome_template_id: string | null;
  template_item_is_district_core: boolean | null;
  template_item_lodge_id: string | null;
  event_date: string | null;
  note: string | null;
  review_reason: string | null;
  submitted_at: string | null;
  supersedes_record_id: string | null;
  status: PassportRecord['status'];
  current_version: number;
  is_official_progress: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export class PostgresPassportRecordRepository implements PassportRecordRepository {
  private counter = 0;

  constructor(private readonly sql: SqlClient) {}

  nextId(): string {
    this.counter += 1;
    return `pr_${this.counter}`;
  }

  async getById(id: string): Promise<PassportRecord | null> {
    const result = await this.sql.query<PassportRecordRow>(
      `SELECT id, member_profile_id, district_id, lodge_id, section_template_id,
              learning_outcome_template_id, template_item_is_district_core, template_item_lodge_id,
              event_date, note, review_reason, submitted_at, supersedes_record_id, status, current_version,
              is_official_progress, created_by_user_id, created_at, updated_at
         FROM passport_records
        WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? this.mapRowToDomain(result.rows[0]) : null;
  }

  async listByStatus(status: PassportRecord['status']): Promise<PassportRecord[]> {
    const result = await this.sql.query<PassportRecordRow>(
      `SELECT id, member_profile_id, district_id, lodge_id, section_template_id,
              learning_outcome_template_id, template_item_is_district_core, template_item_lodge_id,
              event_date, note, review_reason, submitted_at, supersedes_record_id, status, current_version,
              is_official_progress, created_by_user_id, created_at, updated_at
         FROM passport_records
        WHERE status = $1
        ORDER BY updated_at DESC`,
      [status],
    );

    return result.rows.map((row) => this.mapRowToDomain(row));
  }

  async getMemberUserIdByMemberProfileId(memberProfileId: string): Promise<string | null> {
    const result = await this.sql.query<{ user_id: string }>(
      `SELECT user_id
         FROM member_profiles
        WHERE id = $1`,
      [memberProfileId],
    );
    return result.rows[0]?.user_id ?? null;
  }

  async save(record: PassportRecord): Promise<void> {
    const templateTitleResult = await this.sql.query<{ title: string }>(
      `SELECT title
         FROM learning_outcome_templates
        WHERE id = $1`,
      [record.templateItem.templateItemId],
    );
    const titleSnapshot = templateTitleResult.rows[0]?.title ?? record.templateItem.templateItemId;

    const values = [
      record.id,
      record.memberProfileId,
      record.sectionTemplateId,
      record.templateItem.templateItemId,
      titleSnapshot,
      record.templateItem.isDistrictCore,
      record.templateItem.lodgeId ?? null,
      record.eventDate ?? null,
      record.note ?? null,
      record.reviewReason ?? null,
      record.submittedAt ?? null,
      record.supersedesRecordId ?? null,
      record.status,
      record.currentVersion,
      record.isOfficialProgress,
      record.lodgeId,
      record.districtId,
      record.createdByUserId,
      record.createdAt,
      record.updatedAt,
    ];

    const existing = await this.getById(record.id);
    if (!existing) {
      await this.sql.query(
        `INSERT INTO passport_records (
            id, member_profile_id, section_template_id, learning_outcome_template_id,
            record_type, title_snapshot, template_item_is_district_core, template_item_lodge_id,
            event_date, note, review_reason, submitted_at, supersedes_record_id, status, current_version,
            is_official_progress, lodge_id, district_id, created_by_user_id, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4,
            'LEARNING_OUTCOME', $5,
            $6, $7,
            $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20
          )`,
        values,
      );
      return;
    }

    await this.sql.query(
      `UPDATE passport_records
          SET title_snapshot = $5,
              template_item_is_district_core = $6,
              template_item_lodge_id = $7,
              event_date = $8,
              note = $9,
              review_reason = $10,
              submitted_at = $11,
              supersedes_record_id = $12,
              status = $13,
              current_version = $14,
              is_official_progress = $15,
              updated_at = $20
        WHERE id = $1`,
      values,
    );
  }

  private mapRowToDomain(row: PassportRecordRow): PassportRecord {
    return {
      id: row.id,
      memberProfileId: row.member_profile_id,
      districtId: row.district_id,
      lodgeId: row.lodge_id,
      sectionTemplateId: row.section_template_id,
      templateItem: {
        templateItemId: row.learning_outcome_template_id ?? 'unknown_template_item',
        isDistrictCore: row.template_item_is_district_core ?? true,
        lodgeId: row.template_item_lodge_id ?? undefined,
      },
      note: row.note ?? undefined,
      eventDate: row.event_date ?? undefined,
      reviewReason: row.review_reason ?? undefined,
      submittedAt: row.submitted_at ?? undefined,
      supersedesRecordId: row.supersedes_record_id ?? undefined,
      status: row.status,
      currentVersion: row.current_version,
      isOfficialProgress: row.is_official_progress,
      createdByUserId: row.created_by_user_id,
      updatedAt: row.updated_at,
      createdAt: row.created_at,
    };
  }
}
