import type { RoleCode } from '../../../shared/contracts/authorization';
import type { SqlClient } from '../../../shared/persistence/sql-client';
import type { AuditEventWriter, NotificationEventHook } from '../application/ports';
import type { VerificationAuditWriter } from '../../verification-workflow/application/ports';

export class PostgresAuditEventWriter implements AuditEventWriter, VerificationAuditWriter {
  private counter = 0;

  constructor(private readonly sql: SqlClient) {}

  async write(event: {
    eventType:
      | 'PASSPORT_RECORD_CREATED'
      | 'PASSPORT_RECORD_UPDATED'
      | 'PASSPORT_RECORD_SUBMITTED'
      | 'PASSPORT_RECORD_VERIFIED'
      | 'PASSPORT_RECORD_REJECTED'
      | 'PASSPORT_RECORD_CLARIFICATION_REQUESTED'
      | 'PASSPORT_RECORD_OVERRIDDEN';
    entityId: string;
    actorUserId: string;
    priorStatus?: string;
    newStatus: string;
    reason?: string;
    occurredAt: string;
    metadata?: Record<string, string>;
  }): Promise<void> {
    this.counter += 1;
    await this.sql.query(
      `INSERT INTO audit_events (
          id,
          event_type,
          entity_type,
          entity_id,
          actor_user_id,
          actor_role_code,
          prior_state,
          new_state,
          reason,
          metadata_json,
          created_at
        ) VALUES ($1, $2, 'PASSPORT_RECORD', $3, $4, $5, $6, $7, $8, $9::jsonb, $10)`,
      [
        `ae_${this.counter}`,
        event.eventType,
        event.entityId,
        event.actorUserId,
        this.resolveRoleCode(event.eventType),
        event.priorStatus ?? null,
        event.newStatus,
        event.reason ?? null,
        JSON.stringify(event.metadata ?? {}),
        event.occurredAt,
      ],
    );
  }

  private resolveRoleCode(eventType: string): RoleCode {
    if (eventType.includes('VERIFIED') || eventType.includes('REJECTED') || eventType.includes('CLARIFICATION') || eventType.includes('OVERRIDDEN')) {
      return 'LODGE_MENTOR';
    }
    return 'BROTHER';
  }
}

export class PostgresNotificationEventHook implements NotificationEventHook {
  async trigger(_event: {
    type: 'PASSPORT_RECORD_SUBMITTED' | 'PASSPORT_RECORD_VERIFIED' | 'PASSPORT_RECORD_REJECTED' | 'PASSPORT_RECORD_CLARIFICATION_REQUESTED';
    recordId: string;
    recipientUserId?: string;
    recipientRole?: 'MENTOR';
    memberProfileId: string;
    lodgeId: string;
    districtId: string;
    reason?: string;
    occurredAt: string;
  }): Promise<void> {
    // Deferred: notifications persistence/outbox implementation is out of scope for this stabilisation pass.
  }
}
