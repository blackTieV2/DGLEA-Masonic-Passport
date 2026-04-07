import { InvalidStateTransitionError } from '../../src/shared/utilities/errors';
import {
  createDraftRecord,
  submitRecordForVerification,
  type PassportRecord,
  updateDraftRecord,
} from '../../src/modules/passport/domain/contracts';
import {
  rejectRecord,
  requestClarification,
  verifyRecord,
} from '../../src/modules/verification-workflow/domain/contracts';

const BASE_TIME = '2026-04-06T00:00:00.000Z';

function makeDraft(overrides: Partial<PassportRecord> = {}): PassportRecord {
  return createDraftRecord({
    id: 'pr_1',
    memberProfileId: 'mp_1',
    districtId: 'd_1',
    lodgeId: 'l_1',
    sectionTemplateId: 'st_1',
    templateItem: { templateItemId: 'ti_1', isDistrictCore: false, lodgeId: 'l_1' },
    actorUserId: 'brother_1',
    nowIso: BASE_TIME,
    ...overrides,
  });
}

describe('workflow state transitions (unit)', () => {
  it('DRAFT -> SUBMITTED is valid', () => {
    const draft = makeDraft();
    const submitted = submitRecordForVerification(draft, '2026-04-06T01:00:00.000Z');

    expect(submitted.status).toBe('SUBMITTED');
    expect(submitted.submittedAt).toBe('2026-04-06T01:00:00.000Z');
  });

  it('NEEDS_CLARIFICATION -> SUBMITTED supports resubmission', () => {
    const needsClarification: PassportRecord = { ...makeDraft(), status: 'NEEDS_CLARIFICATION' };
    const resubmitted = submitRecordForVerification(needsClarification, '2026-04-06T02:00:00.000Z');

    expect(resubmitted.status).toBe('SUBMITTED');
    expect(resubmitted.reviewReason).toBeUndefined();
  });

  it('invalid submission transitions throw INVALID_STATE_TRANSITION', () => {
    const verified: PassportRecord = { ...makeDraft(), status: 'VERIFIED' };
    expect(() => submitRecordForVerification(verified, '2026-04-06T03:00:00.000Z')).toThrow(InvalidStateTransitionError);
  });

  it('only DRAFT records can be updated in draft path', () => {
    const submitted: PassportRecord = { ...makeDraft(), status: 'SUBMITTED' };
    expect(() => updateDraftRecord(submitted, { note: 'new', nowIso: '2026-04-06T04:00:00.000Z' })).toThrow(InvalidStateTransitionError);
  });

  it('SUBMITTED -> VERIFIED is valid', () => {
    const submitted = submitRecordForVerification(makeDraft(), '2026-04-06T04:00:00.000Z');
    const verified = verifyRecord(submitted, '2026-04-06T05:00:00.000Z');

    expect(verified.status).toBe('VERIFIED');
    expect(verified.isOfficialProgress).toBe(true);
  });

  it('SUBMITTED -> REJECTED requires reason', () => {
    const submitted = submitRecordForVerification(makeDraft(), '2026-04-06T06:00:00.000Z');

    expect(() => rejectRecord(submitted, ' ', '2026-04-06T07:00:00.000Z')).toThrow(InvalidStateTransitionError);

    const rejected = rejectRecord(submitted, 'Evidence missing', '2026-04-06T07:00:00.000Z');
    expect(rejected.status).toBe('REJECTED');
    expect(rejected.reviewReason).toBe('Evidence missing');
  });

  it('SUBMITTED -> NEEDS_CLARIFICATION requires reason', () => {
    const submitted = submitRecordForVerification(makeDraft(), '2026-04-06T08:00:00.000Z');

    expect(() => requestClarification(submitted, '', '2026-04-06T09:00:00.000Z')).toThrow(
      InvalidStateTransitionError,
    );

    const clarification = requestClarification(
      submitted,
      'Please add event date evidence',
      '2026-04-06T09:00:00.000Z',
    );
    expect(clarification.status).toBe('NEEDS_CLARIFICATION');
    expect(clarification.reviewReason).toBe('Please add event date evidence');
  });
});
