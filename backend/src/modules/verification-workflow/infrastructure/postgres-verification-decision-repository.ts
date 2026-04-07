import type { SqlClient } from '../../../shared/persistence/sql-client';
import type { VerificationDecisionRepository } from '../application/ports';

export class PostgresVerificationDecisionRepository implements VerificationDecisionRepository {
  private counter = 0;

  constructor(private readonly sql: SqlClient) {}

  async append(decision: {
    decisionType: 'VERIFIED' | 'REJECTED' | 'REQUESTED_CLARIFICATION' | 'OVERRIDDEN';
    passportRecordId: string;
    priorStatus: string;
    newStatus: string;
    decisionReason?: string;
    actorUserId: string;
    actorRoleCode: string;
    actedAt: string;
  }): Promise<void> {
    this.counter += 1;
    await this.sql.query(
      `INSERT INTO verification_decisions (
          id,
          passport_record_id,
          decision_type,
          prior_status,
          new_status,
          decision_reason,
          actor_user_id,
          actor_role_code,
          acted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        `vd_${this.counter}`,
        decision.passportRecordId,
        decision.decisionType,
        decision.priorStatus,
        decision.newStatus,
        decision.decisionReason ?? null,
        decision.actorUserId,
        decision.actorRoleCode,
        decision.actedAt,
      ],
    );
  }
}
