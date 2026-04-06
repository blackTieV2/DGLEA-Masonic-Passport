import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import type { PassportRecord } from '../../passport/domain/contracts';

export interface VerificationRecordRepository {
  nextId(): string;
  getById(recordId: string): Promise<PassportRecord | null>;
  listByStatus(status: PassportRecord['status']): Promise<PassportRecord[]>;
  save(record: PassportRecord): Promise<void>;
}

export interface VerificationAuditWriter {
  write(event: {
    eventType:
      | 'PASSPORT_RECORD_VERIFIED'
      | 'PASSPORT_RECORD_REJECTED'
      | 'PASSPORT_RECORD_CLARIFICATION_REQUESTED'
      | 'PASSPORT_RECORD_OVERRIDDEN';
    entityId: string;
    actorUserId: string;
    priorStatus: string;
    newStatus: string;
    reason?: string;
    occurredAt: string;
    metadata?: Record<string, string>;
  }): Promise<void>;
}

export interface VerificationClockPort {
  nowIso(): string;
}

export interface VerificationAuthorizationPolicy {
  assertCanReview(record: PassportRecord, actor: CurrentUserContext): void;
  assertCanOverride(record: PassportRecord, actor: CurrentUserContext): void;
}
