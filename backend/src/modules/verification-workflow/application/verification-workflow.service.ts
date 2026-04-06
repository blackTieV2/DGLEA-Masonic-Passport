import { ForbiddenError, NotFoundError } from '../../../shared/utilities/errors';
import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import { hasCapability } from '../../identity-access/domain/permissions';
import { assertAssignedMemberScope, assertLodgeScope } from '../../identity-access/domain/scope-enforcement';
import type { PassportRecord } from '../../passport/domain/contracts';
import {
  createOverrideRecord,
  rejectSubmittedRecord,
  requestClarificationForSubmittedRecord,
  verifySubmittedRecord,
  type VerificationDecisionStatus,
} from '../domain/contracts';
import type {
  VerificationAuditWriter,
  VerificationAuthorizationPolicy,
  VerificationClockPort,
  VerificationRecordRepository,
} from './ports';

class DefaultVerificationAuthorizationPolicy implements VerificationAuthorizationPolicy {
  assertCanReview(record: PassportRecord, actor: CurrentUserContext): void {
    if (record.createdByUserId === actor.identity.userId) {
      throw new ForbiddenError('Brother cannot verify own records.');
    }

    if (hasCapability(actor, 'verification.verify.lodge')) {
      assertLodgeScope(actor, record.lodgeId);
      return;
    }

    if (hasCapability(actor, 'verification.verify.assigned')) {
      assertAssignedMemberScope(actor, record.createdByUserId);
      return;
    }

    throw new ForbiddenError('Caller lacks verification permission.');
  }

  assertCanOverride(record: PassportRecord, actor: CurrentUserContext): void {
    if (record.createdByUserId === actor.identity.userId) {
      throw new ForbiddenError('Brother cannot override own records.');
    }
    if (!hasCapability(actor, 'verification.override.lodge')) {
      throw new ForbiddenError('Caller lacks lodge override permission.');
    }
    assertLodgeScope(actor, record.lodgeId);
  }
}

export class VerificationWorkflowService {
  constructor(
    private readonly repo: VerificationRecordRepository,
    private readonly audit: VerificationAuditWriter,
    private readonly clock: VerificationClockPort,
    private readonly policy: VerificationAuthorizationPolicy = new DefaultVerificationAuthorizationPolicy(),
  ) {}

  async verify(input: { recordId: string; actor: CurrentUserContext }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanReview(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const verified = verifySubmittedRecord(existing, nowIso);
    await this.repo.save(verified);
    await this.audit.write({
      eventType: 'PASSPORT_RECORD_VERIFIED',
      entityId: verified.id,
      actorUserId: input.actor.identity.userId,
      priorStatus: existing.status,
      newStatus: verified.status,
      occurredAt: nowIso,
    });

    return verified;
  }

  async reject(input: { recordId: string; reason: string; actor: CurrentUserContext }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanReview(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const rejected = rejectSubmittedRecord(existing, input.reason, nowIso);
    await this.repo.save(rejected);
    await this.audit.write({
      eventType: 'PASSPORT_RECORD_REJECTED',
      entityId: rejected.id,
      actorUserId: input.actor.identity.userId,
      priorStatus: existing.status,
      newStatus: rejected.status,
      reason: rejected.reviewReason,
      occurredAt: nowIso,
    });

    return rejected;
  }

  async requestClarification(input: { recordId: string; reason: string; actor: CurrentUserContext }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanReview(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const needsClarification = requestClarificationForSubmittedRecord(existing, input.reason, nowIso);
    await this.repo.save(needsClarification);
    await this.audit.write({
      eventType: 'PASSPORT_RECORD_CLARIFICATION_REQUESTED',
      entityId: needsClarification.id,
      actorUserId: input.actor.identity.userId,
      priorStatus: existing.status,
      newStatus: needsClarification.status,
      reason: needsClarification.reviewReason,
      occurredAt: nowIso,
    });

    return needsClarification;
  }

  async override(input: {
    recordId: string;
    overrideTo: VerificationDecisionStatus;
    reason: string;
    actor: CurrentUserContext;
  }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanOverride(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const overridden = createOverrideRecord({
      newId: this.repo.nextId(),
      source: existing,
      actorUserId: input.actor.identity.userId,
      nowIso,
      status: input.overrideTo,
      reason: input.reason,
    });

    await this.repo.save(overridden);
    await this.audit.write({
      eventType: 'PASSPORT_RECORD_OVERRIDDEN',
      entityId: overridden.id,
      actorUserId: input.actor.identity.userId,
      priorStatus: existing.status,
      newStatus: overridden.status,
      reason: overridden.reviewReason,
      occurredAt: nowIso,
      metadata: { supersedesRecordId: existing.id, overrideTo: input.overrideTo },
    });

    return overridden;
  }

  async getPendingQueue(input: { actor: CurrentUserContext }): Promise<PassportRecord[]> {
    const submitted = await this.repo.listByStatus('SUBMITTED');

    const canVerifyLodge = hasCapability(input.actor, 'verification.verify.lodge');
    const canVerifyAssigned = hasCapability(input.actor, 'verification.verify.assigned');

    if (!canVerifyLodge && !canVerifyAssigned) {
      return [];
    }

    return submitted.filter((record) => {
      if (record.createdByUserId === input.actor.identity.userId) {
        return false;
      }

      if (canVerifyLodge) {
        try {
          assertLodgeScope(input.actor, record.lodgeId);
          return true;
        } catch {
          return false;
        }
      }

      if (canVerifyAssigned) {
        try {
          assertAssignedMemberScope(input.actor, record.createdByUserId);
          return true;
        } catch {
          return false;
        }
      }

      return false;
    });
  }

  private async getRecordOrThrow(recordId: string): Promise<PassportRecord> {
    const record = await this.repo.getById(recordId);
    if (!record) {
      throw new NotFoundError('Passport record not found.');
    }
    return record;
  }
}
