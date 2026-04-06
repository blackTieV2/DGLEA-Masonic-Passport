import { InvalidStateTransitionError } from '../../../shared/utilities/errors';
import type { PassportRecord } from '../../passport/domain/contracts';

export type VerificationDecisionStatus = 'VERIFIED' | 'REJECTED' | 'NEEDS_CLARIFICATION';

function assertSubmitted(record: PassportRecord): void {
  if (record.status !== 'SUBMITTED') {
    throw new InvalidStateTransitionError('Verification actions require record to be in SUBMITTED status.');
  }
}

function assertReason(reason: string | undefined, action: 'reject' | 'clarification' | 'override'): string {
  const trimmed = reason?.trim();
  if (!trimmed) {
    throw new InvalidStateTransitionError(`${action} action requires a non-empty reason.`);
  }
  return trimmed;
}

export function verifySubmittedRecord(record: PassportRecord, nowIso: string): PassportRecord {
  assertSubmitted(record);

  return {
    ...record,
    status: 'VERIFIED',
    reviewReason: undefined,
    updatedAt: nowIso,
    isOfficialProgress: true,
  };
}

export function rejectSubmittedRecord(record: PassportRecord, reason: string, nowIso: string): PassportRecord {
  assertSubmitted(record);

  return {
    ...record,
    status: 'REJECTED',
    reviewReason: assertReason(reason, 'reject'),
    updatedAt: nowIso,
    isOfficialProgress: false,
  };
}

export function requestClarificationForSubmittedRecord(record: PassportRecord, reason: string, nowIso: string): PassportRecord {
  assertSubmitted(record);

  return {
    ...record,
    status: 'NEEDS_CLARIFICATION',
    reviewReason: assertReason(reason, 'clarification'),
    updatedAt: nowIso,
    isOfficialProgress: false,
  };
}

export function createOverrideRecord(input: {
  newId: string;
  source: PassportRecord;
  actorUserId: string;
  nowIso: string;
  status: VerificationDecisionStatus;
  reason: string;
}): PassportRecord {
  const reviewReason = assertReason(input.reason, 'override');

  return {
    ...input.source,
    id: input.newId,
    status: 'OVERRIDDEN',
    supersedesRecordId: input.source.id,
    reviewReason: `${input.status}: ${reviewReason}`,
    createdByUserId: input.actorUserId,
    createdAt: input.nowIso,
    updatedAt: input.nowIso,
    submittedAt: input.nowIso,
    currentVersion: 1,
    isOfficialProgress: input.status === 'VERIFIED',
  };
}
