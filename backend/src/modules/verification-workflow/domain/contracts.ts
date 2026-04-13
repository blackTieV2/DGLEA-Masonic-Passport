import { InvalidStateTransitionError } from '../../../shared/utilities/errors';
import type { PassportRecord } from '../../passport/domain/contracts';

export type VerificationDecisionStatus = 'VERIFIED' | 'REJECTED' | 'SUPERSEDED';

function assertSubmittedOrNeedsClarification(record: PassportRecord): void {
  if (record.status !== 'SUBMITTED' && record.status !== 'NEEDS_CLARIFICATION') {
    throw new InvalidStateTransitionError('Verification action requires SUBMITTED or NEEDS_CLARIFICATION status.');
  }
}

function assertSubmitted(record: PassportRecord): void {
  if (record.status !== 'SUBMITTED') {
    throw new InvalidStateTransitionError('Clarification requests require record to be in SUBMITTED status.');
  }
}

function assertReason(reason: string | undefined, action: 'reject' | 'clarification' | 'override'): string {
  const trimmed = reason?.trim();
  if (!trimmed) {
    throw new InvalidStateTransitionError(`${action} action requires a non-empty reason.`);
  }
  return trimmed;
}

export function verifyRecord(record: PassportRecord, nowIso: string): PassportRecord {
  assertSubmittedOrNeedsClarification(record);

  return {
    ...record,
    status: 'VERIFIED',
    reviewReason: undefined,
    updatedAt: nowIso,
    currentVersion: record.currentVersion + 1,
    isOfficialProgress: true,
  };
}

export function rejectRecord(record: PassportRecord, reason: string, nowIso: string): PassportRecord {
  assertSubmittedOrNeedsClarification(record);

  return {
    ...record,
    status: 'REJECTED',
    reviewReason: assertReason(reason, 'reject'),
    updatedAt: nowIso,
    currentVersion: record.currentVersion + 1,
    isOfficialProgress: false,
  };
}

export function requestClarification(record: PassportRecord, reason: string, nowIso: string): PassportRecord {
  assertSubmitted(record);

  return {
    ...record,
    status: 'NEEDS_CLARIFICATION',
    reviewReason: assertReason(reason, 'clarification'),
    updatedAt: nowIso,
    currentVersion: record.currentVersion + 1,
    isOfficialProgress: false,
  };
}

export function applyOverrideDecision(
  record: PassportRecord,
  targetStatus: VerificationDecisionStatus,
  reason: string,
  nowIso: string,
): PassportRecord {
  if (record.status === 'DRAFT' || record.status === 'ARCHIVED') {
    throw new InvalidStateTransitionError('Override requires an already-reviewed workflow state.');
  }

  const overrideReason = assertReason(reason, 'override');

  return {
    ...record,
    status: targetStatus,
    reviewReason: overrideReason,
    updatedAt: nowIso,
    currentVersion: record.currentVersion + 1,
    isOfficialProgress: targetStatus === 'VERIFIED',
  };
}
