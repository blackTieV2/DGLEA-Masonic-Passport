import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import type { VerificationDecisionStatus } from '../domain/contracts';

export interface VerifyRecordRequest {
  recordId: string;
  actor: CurrentUserContext;
}

export interface RejectRecordRequest {
  recordId: string;
  reason: string;
  actor: CurrentUserContext;
}

export interface ClarificationRequest {
  recordId: string;
  reason: string;
  actor: CurrentUserContext;
}

export interface OverrideRecordRequest {
  recordId: string;
  targetStatus: VerificationDecisionStatus;
  reason: string;
  actor: CurrentUserContext;
}

export interface PendingQueueRequest {
  actor: CurrentUserContext;
}
