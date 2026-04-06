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
  event_date: string | null;
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
              learning_outcome_template_id, event_date, status, current_version,
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
              learning_outcome_template_id, event_date, status, current_version,
              is_official_progress, created_by_user_id, created_at, updated_at
         FROM passport_records
        WHERE status = $1
        ORDER BY updated_at DESC`,
      [status],
    );

    return result.rows.map((row) => this.mapRowToDomain(row));
  }

  async save(record: PassportRecord): Promise<void> {
    await this.sql.query(
      `INSERT INTO passport_records (
          id, member_profile_id, section_template_id, learning_outcome_template_id,
          record_type, title_snapshot, event_date, status, current_version,
          is_official_progress, lodge_id, district_id, created_by_user_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4,
          'LEARNING_OUTCOME', $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14
        )
        ON CONFLICT (id)
        DO UPDATE SET
          event_date = EXCLUDED.event_date,
          status = EXCLUDED.status,
          current_version = EXCLUDED.current_version,
          is_official_progress = EXCLUDED.is_official_progress,
          updated_at = EXCLUDED.updated_at`,
      [
        record.id,
        record.memberProfileId,
        record.sectionTemplateId,
        record.templateItem.templateItemId,
        record.templateItem.templateItemId,
        record.eventDate ?? null,
        record.status,
        record.currentVersion,
        record.isOfficialProgress,
        record.lodgeId,
        record.districtId,
        record.createdByUserId,
        record.createdAt,
        record.updatedAt,
      ],
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
        isDistrictCore: true,
      },
      eventDate: row.event_date ?? undefined,
      status: row.status,
      currentVersion: row.current_version,
      isOfficialProgress: row.is_official_progress,
      createdByUserId: row.created_by_user_id,
      updatedAt: row.updated_at,
      createdAt: row.created_at,
    };
  }
}
