import { ForbiddenError, NotFoundError } from '../../../shared/utilities/errors';
import type { CurrentUserContext, RoleCode } from '../../../shared/contracts/authorization';
import { hasCapability } from '../../identity-access/domain/permissions';
import { assertAssignedMemberScope, assertLodgeScope } from '../../identity-access/domain/scope-enforcement';
import type { PassportRecord } from '../../passport/domain/contracts';
import {
  applyOverrideDecision,
  rejectRecord,
  requestClarification,
  verifyRecord,
  type VerificationDecisionStatus,
} from '../domain/contracts';
import type {
  VerificationAuditWriter,
  VerificationAuthorizationPolicy,
  VerificationClockPort,
  VerificationDecisionRepository,
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
    private readonly decisionRepo: VerificationDecisionRepository,
    private readonly audit: VerificationAuditWriter,
    private readonly clock: VerificationClockPort,
    private readonly policy: VerificationAuthorizationPolicy = new DefaultVerificationAuthorizationPolicy(),
  ) {}

  async verify(input: { recordId: string; actor: CurrentUserContext }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanReview(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const verified = verifyRecord(existing, nowIso);
    await this.repo.save(verified);
    await this.decisionRepo.append({
      decisionType: 'VERIFIED',
      passportRecordId: verified.id,
      priorStatus: existing.status,
      newStatus: verified.status,
      actorUserId: input.actor.identity.userId,
      actorRoleCode: this.resolveActorRoleCode(input.actor),
      actedAt: nowIso,
    });
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
    const rejected = rejectRecord(existing, input.reason, nowIso);
    await this.repo.save(rejected);
    await this.decisionRepo.append({
      decisionType: 'REJECTED',
      passportRecordId: rejected.id,
      priorStatus: existing.status,
      newStatus: rejected.status,
      decisionReason: rejected.reviewReason,
      actorUserId: input.actor.identity.userId,
      actorRoleCode: this.resolveActorRoleCode(input.actor),
      actedAt: nowIso,
    });
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
    const needsClarification = requestClarification(existing, input.reason, nowIso);
    await this.repo.save(needsClarification);
    await this.decisionRepo.append({
      decisionType: 'REQUESTED_CLARIFICATION',
      passportRecordId: needsClarification.id,
      priorStatus: existing.status,
      newStatus: needsClarification.status,
      decisionReason: needsClarification.reviewReason,
      actorUserId: input.actor.identity.userId,
      actorRoleCode: this.resolveActorRoleCode(input.actor),
      actedAt: nowIso,
    });
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
    targetStatus: VerificationDecisionStatus;
    reason: string;
    actor: CurrentUserContext;
  }): Promise<PassportRecord> {
    const existing = await this.getRecordOrThrow(input.recordId);
    this.policy.assertCanOverride(existing, input.actor);

    const nowIso = this.clock.nowIso();
    const overridden = applyOverrideDecision(existing, input.targetStatus, input.reason, nowIso);

    await this.repo.save(overridden);
    await this.decisionRepo.append({
      decisionType: 'OVERRIDDEN',
      passportRecordId: overridden.id,
      priorStatus: existing.status,
      newStatus: overridden.status,
      decisionReason: overridden.reviewReason,
      actorUserId: input.actor.identity.userId,
      actorRoleCode: this.resolveActorRoleCode(input.actor),
      actedAt: nowIso,
    });
    await this.audit.write({
      eventType: 'PASSPORT_RECORD_OVERRIDDEN',
      entityId: overridden.id,
      actorUserId: input.actor.identity.userId,
      priorStatus: existing.status,
      newStatus: overridden.status,
      reason: overridden.reviewReason,
      occurredAt: nowIso,
      metadata: { overrideTo: input.targetStatus },
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

  private resolveActorRoleCode(actor: CurrentUserContext): RoleCode {
    const active = actor.roles.find((role) => role.active);
    return active?.roleCode ?? 'BROTHER';
  }
}
