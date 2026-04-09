import type { SqlClient } from '../../../shared/persistence/sql-client';
import type { TemplateItemRepository } from '../application/ports';
import type { TemplateItemReference } from '../domain/contracts';

interface TemplateItemRow {
  id: string;
  is_district_core: boolean;
  lodge_id: string | null;
}

export class PostgresTemplateItemRepository implements TemplateItemRepository {
  constructor(private readonly sql: SqlClient) {}

  async getById(templateItemId: string): Promise<TemplateItemReference | null> {
    const result = await this.sql.query<TemplateItemRow>(
      `SELECT id, is_district_core, lodge_id
         FROM learning_outcome_templates
        WHERE id = $1`,
      [templateItemId],
    );

    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    return {
      templateItemId: row.id,
      isDistrictCore: row.is_district_core,
      lodgeId: row.lodge_id ?? undefined,
    };
  }
}
