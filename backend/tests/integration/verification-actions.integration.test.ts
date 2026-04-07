import { ForbiddenError, InvalidStateTransitionError } from '../../src/shared/utilities/errors';
import type { CurrentUserContext } from '../../src/shared/contracts/authorization';
import { VerificationEndpoint } from '../../src/modules/verification-workflow/api/verification.endpoint';
import { VerificationWorkflowService } from '../../src/modules/verification-workflow/application/verification-workflow.service';
import { InMemoryVerificationDecisionRepository } from '../../src/modules/verification-workflow/infrastructure/in-memory-verification-decision-repository';
import { InMemoryAuditEventWriter } from '../../src/modules/passport/infrastructure/in-memory-audit-notification';
import { InMemoryPassportRecordRepository } from '../../src/modules/passport/infrastructure/in-memory-passport-record-repository';
import type { PassportRecord } from '../../src/modules/passport/domain/contracts';

class FixedClock {
  private tick = 10;

  nowIso(): string {
    this.tick += 1;
    return `2026-04-06T00:00:${this.tick.toString().padStart(2, '0')}.000Z`;
  }
}

function ctx(userId: string, roles: CurrentUserContext['roles']): CurrentUserContext {
  return {
    identity: { userId, email: `${userId}@example.org`, displayName: userId, status: 'ACTIVE' },
    roles,
  };
}

function submittedRecord(overrides: Partial<PassportRecord> = {}): PassportRecord {
  return {
    id: 'pr_submitted',
    memberProfileId: 'mp_1',
    districtId: 'd_1',
    lodgeId: 'l_1',
    sectionTemplateId: 'st_1',
    templateItem: { templateItemId: 'ti_1', isDistrictCore: false, lodgeId: 'l_1' },
    status: 'SUBMITTED',
    isOfficialProgress: false,
    currentVersion: 2,
    createdByUserId: 'brother_1',
    createdAt: '2026-04-06T00:00:00.000Z',
    updatedAt: '2026-04-06T00:00:01.000Z',
    submittedAt: '2026-04-06T00:00:01.000Z',
    ...overrides,
  };
}

describe('verification actions (integration)', () => {
  function setup(seed: PassportRecord[] = [submittedRecord()]) {
    const repo = new InMemoryPassportRecordRepository();
    const audit = new InMemoryAuditEventWriter();
    const decisions = new InMemoryVerificationDecisionRepository();
    const service = new VerificationWorkflowService(repo, decisions, audit, new FixedClock());
    const endpoint = new VerificationEndpoint(service);

    return Promise.all(seed.map((record) => repo.save(record))).then(() => ({ endpoint, repo, audit, decisions }));
  }

  it('supports verify/reject/clarification valid transitions from SUBMITTED', async () => {
    const verifyEnv = await setup([submittedRecord({ id: 'pr_verify' })]);
    const lodgeMentor = ctx('mentor_1', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_1', districtId: 'd_1', active: true },
    ]);

    const verified = await verifyEnv.endpoint.verify({ recordId: 'pr_verify', actor: lodgeMentor });
    expect(verified.status).toBe('VERIFIED');

    const rejectEnv = await setup([submittedRecord({ id: 'pr_reject' })]);
    const rejected = await rejectEnv.endpoint.reject({
      recordId: 'pr_reject',
      reason: 'Insufficient evidence',
      actor: lodgeMentor,
    });
    expect(rejected.status).toBe('REJECTED');
    expect(rejected.reviewReason).toBe('Insufficient evidence');

    const clarificationEnv = await setup([submittedRecord({ id: 'pr_clarify' })]);
    const clarification = await clarificationEnv.endpoint.requestClarification({
      recordId: 'pr_clarify',
      reason: 'Please attach minutes',
      actor: lodgeMentor,
    });
    expect(clarification.status).toBe('NEEDS_CLARIFICATION');
    expect(clarification.reviewReason).toBe('Please attach minutes');
  });

  it('blocks invalid transition when record is not SUBMITTED', async () => {
    const { endpoint } = await setup([submittedRecord({ id: 'pr_verified', status: 'VERIFIED' })]);
    const lodgeMentor = ctx('mentor_1', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_1', districtId: 'd_1', active: true },
    ]);

    await expect(endpoint.verify({ recordId: 'pr_verified', actor: lodgeMentor })).rejects.toThrow(InvalidStateTransitionError);
  });

  it('enforces cross-scope denial and self-verification denial', async () => {
    const { endpoint } = await setup();

    const outOfScopeLodgeMentor = ctx('mentor_2', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_2', districtId: 'd_1', active: true },
    ]);
    await expect(endpoint.verify({ recordId: 'pr_submitted', actor: outOfScopeLodgeMentor })).rejects.toThrow(ForbiddenError);

    const personalMentorWrongAssignment = ctx('mentor_3', [
      {
        roleCode: 'PERSONAL_MENTOR',
        scopeType: 'ASSIGNED_MEMBER',
        assignedMemberUserIds: ['brother_2'],
        active: true,
      },
    ]);
    await expect(endpoint.verify({ recordId: 'pr_submitted', actor: personalMentorWrongAssignment })).rejects.toThrow(ForbiddenError);

    const brotherSelf = ctx('brother_1', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_1', districtId: 'd_1', active: true },
    ]);
    await expect(endpoint.verify({ recordId: 'pr_submitted', actor: brotherSelf })).rejects.toThrow(ForbiddenError);

    const districtMentor = ctx('district_mentor_1', [
      { roleCode: 'DISTRICT_MENTOR', scopeType: 'DISTRICT', districtId: 'd_1', active: true },
    ]);
    await expect(endpoint.verify({ recordId: 'pr_submitted', actor: districtMentor })).rejects.toThrow(ForbiddenError);
  });

  it('supports lodge mentor override while preserving history in decision + audit logs', async () => {
    const { endpoint, repo, audit, decisions } = await setup([submittedRecord({ id: 'pr_base', status: 'REJECTED' })]);

    const lodgeMentor = ctx('mentor_override', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_1', districtId: 'd_1', active: true },
    ]);

    const overrideRecord = await endpoint.override({
      recordId: 'pr_base',
      targetStatus: 'VERIFIED',
      reason: 'Manual validation approved',
      actor: lodgeMentor,
    });

    const original = await repo.getById('pr_base');

    expect(original?.status).toBe('VERIFIED');
    expect(overrideRecord.status).toBe('VERIFIED');
    expect(overrideRecord.reviewReason).toBe('Manual validation approved');
    expect(decisions.items.at(-1)).toMatchObject({
      decisionType: 'OVERRIDDEN',
      passportRecordId: 'pr_base',
      priorStatus: 'REJECTED',
      newStatus: 'VERIFIED',
    });
    expect(audit.events.at(-1)).toMatchObject({
      eventType: 'PASSPORT_RECORD_OVERRIDDEN',
      entityId: overrideRecord.id,
      metadata: { overrideTo: 'VERIFIED' },
    });
  });

  it('returns pending verification queue filtered by scope and self exclusion', async () => {
    const { endpoint } = await setup([
      submittedRecord({ id: 'pr_own', memberProfileId: 'mp_own', createdByUserId: 'mentor_lodge' }),
      submittedRecord({ id: 'pr_lodge_match', memberProfileId: 'mp_lodge_match', createdByUserId: 'brother_2' }),
      submittedRecord({ id: 'pr_other_lodge', memberProfileId: 'mp_other_lodge', lodgeId: 'l_2', createdByUserId: 'brother_3' }),
    ]);

    const lodgeMentor = ctx('mentor_lodge', [
      { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'l_1', districtId: 'd_1', active: true },
    ]);

    const queue = await endpoint.pendingQueue({ actor: lodgeMentor });
    expect(queue.map((item) => item.id)).toEqual(['pr_lodge_match']);
  });
});
