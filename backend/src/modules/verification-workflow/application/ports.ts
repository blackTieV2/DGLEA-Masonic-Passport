import type { CurrentUserContext, RoleCode } from '../../../shared/contracts/authorization';
import type { PassportRecord } from '../../passport/domain/contracts';

export interface VerificationRecordRepository {
  getById(recordId: string): Promise<PassportRecord | null>;
  listByStatus(status: PassportRecord['status']): Promise<PassportRecord[]>;
  getMemberUserIdByMemberProfileId(memberProfileId: string): Promise<string | null>;
  save(record: PassportRecord): Promise<void>;
}

export interface VerificationDecisionRepository {
  append(decision: {
    decisionType:
      | 'VERIFIED'
      | 'REJECTED'
      | 'REQUESTED_CLARIFICATION'
      | 'OVERRIDDEN';
    passportRecordId: string;
    priorStatus: PassportRecord['status'];
    newStatus: PassportRecord['status'];
    decisionReason?: string;
    actorUserId: string;
    actorRoleCode: RoleCode;
    actedAt: string;
  }): Promise<void>;
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
  assertCanReview(record: PassportRecord, memberUserId: string, actor: CurrentUserContext): void;
  assertCanOverride(record: PassportRecord, memberUserId: string, actor: CurrentUserContext): void;
}
