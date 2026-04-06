import { InvalidStateTransitionError } from '../../src/shared/utilities/errors';
import {
  createDraftRecord,
  submitRecordForVerification,
  type PassportRecord,
  updateDraftRecord,
} from '../../src/modules/passport/domain/contracts';

const BASE_TIME = '2026-04-06T00:00:00.000Z';

function makeDraft(overrides: Partial<PassportRecord> = {}): PassportRecord {
  return createDraftRecord({
    id: 'pr_1',
    memberProfileId: 'mp_1',
    districtId: 'd_1',
    lodgeId: 'l_1',
    sectionTemplateId: 'st_1',
    templateItem: { templateItemId: 'ti_1', isDistrictCore: false, lodgeId: 'l_1' },
    actorUserId: 'user_1',
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
    expect(submitted.updatedAt).toBe('2026-04-06T01:00:00.000Z');
  });

  it('NEEDS_CLARIFICATION -> SUBMITTED supports resubmission', () => {
    const needsClarification: PassportRecord = {
      ...makeDraft(),
      status: 'NEEDS_CLARIFICATION',
    };

    const resubmitted = submitRecordForVerification(needsClarification, '2026-04-06T02:00:00.000Z');

    expect(resubmitted.status).toBe('SUBMITTED');
    expect(resubmitted.submittedAt).toBe('2026-04-06T02:00:00.000Z');
  });

  it('invalid submission transitions return INVALID_STATE_TRANSITION', () => {
    const verified: PassportRecord = {
      ...makeDraft(),
      status: 'VERIFIED',
    };

    expect(() => submitRecordForVerification(verified, '2026-04-06T03:00:00.000Z')).toThrow(InvalidStateTransitionError);
  });

  it('only DRAFT records can be updated in draft path', () => {
    const submitted: PassportRecord = {
      ...makeDraft(),
      status: 'SUBMITTED',
    };

    expect(() => updateDraftRecord(submitted, { note: 'new note', nowIso: '2026-04-06T04:00:00.000Z' })).toThrow(
      InvalidStateTransitionError,
    );
  });

  it('updating DRAFT increments currentVersion and updates timestamp', () => {
    const draft = makeDraft();

    const updated = updateDraftRecord(draft, {
      note: 'updated note',
      eventDate: '2026-04-06',
      nowIso: '2026-04-06T05:00:00.000Z',
    });

    expect(updated.note).toBe('updated note');
    expect(updated.eventDate).toBe('2026-04-06');
    expect(updated.currentVersion).toBe(2);
    expect(updated.updatedAt).toBe('2026-04-06T05:00:00.000Z');
  });
});
