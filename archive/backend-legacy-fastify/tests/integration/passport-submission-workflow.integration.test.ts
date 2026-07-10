import { InvalidStateTransitionError, NotFoundError } from '../../src/shared/utilities/errors';
import { PassportRecordEndpoint } from '../../src/modules/passport/api/passport-record.endpoint';
import { PassportRecordService } from '../../src/modules/passport/application/passport-record.service';
import { InMemoryAuditEventWriter, InMemoryNotificationEventHook } from '../../src/modules/passport/infrastructure/in-memory-audit-notification';
import { InMemoryPassportRecordRepository } from '../../src/modules/passport/infrastructure/in-memory-passport-record-repository';
import { InMemoryTemplateItemRepository } from '../../src/modules/passport/infrastructure/in-memory-template-item-repository';

class FixedClock {
  private tick = 0;

  nowIso(): string {
    this.tick += 1;
    return `2026-04-06T00:00:0${this.tick}.000Z`;
  }
}

describe('passport submission workflow (integration)', () => {
  function setup() {
    const recordRepo = new InMemoryPassportRecordRepository();
    const templateRepo = new InMemoryTemplateItemRepository({
      ti_lodge: { templateItemId: 'ti_lodge', isDistrictCore: false, lodgeId: 'l_1' },
    });
    const auditWriter = new InMemoryAuditEventWriter();
    const notificationHook = new InMemoryNotificationEventHook();
    const service = new PassportRecordService(recordRepo, templateRepo, auditWriter, notificationHook, new FixedClock());
    const endpoint = new PassportRecordEndpoint(service);

    return { endpoint, auditWriter, notificationHook };
  }

  it('creates DRAFT record, updates it, and submits it', async () => {
    const { endpoint, auditWriter, notificationHook } = setup();

    const created = await endpoint.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'd_1',
      lodgeId: 'l_1',
      sectionTemplateId: 'st_1',
      templateItemId: 'ti_lodge',
      note: 'Initial note',
      actorUserId: 'user_1',
    });

    const updated = await endpoint.updateDraft({
      recordId: created.id,
      note: 'Updated note',
      eventDate: '2026-04-06',
      actorUserId: 'user_1',
    });

    const submitted = await endpoint.submitForVerification({
      recordId: created.id,
      actorUserId: 'user_1',
    });

    expect(created.status).toBe('DRAFT');
    expect(updated.status).toBe('DRAFT');
    expect(updated.currentVersion).toBe(2);
    expect(submitted.status).toBe('SUBMITTED');
    expect(submitted.submittedAt).toBe('2026-04-06T00:00:03.000Z');

    expect(auditWriter.events.map((event) => event.eventType)).toEqual([
      'PASSPORT_RECORD_CREATED',
      'PASSPORT_RECORD_UPDATED',
      'PASSPORT_RECORD_SUBMITTED',
    ]);

    expect(notificationHook.events).toHaveLength(1);
    expect(notificationHook.events[0]).toMatchObject({
      type: 'PASSPORT_RECORD_SUBMITTED',
      recordId: created.id,
      memberProfileId: 'mp_1',
      lodgeId: 'l_1',
      districtId: 'd_1',
    });
  });

  it('rejects submission for unknown records', async () => {
    const { endpoint } = setup();

    await expect(endpoint.submitForVerification({ recordId: 'missing', actorUserId: 'user_1' })).rejects.toThrow(NotFoundError);
  });

  it('rejects updating through draft path after submission', async () => {
    const { endpoint } = setup();

    const created = await endpoint.createDraft({
      memberProfileId: 'mp_1',
      districtId: 'd_1',
      lodgeId: 'l_1',
      sectionTemplateId: 'st_1',
      templateItemId: 'ti_lodge',
      actorUserId: 'user_1',
    });

    await endpoint.submitForVerification({
      recordId: created.id,
      actorUserId: 'user_1',
    });

    await expect(
      endpoint.updateDraft({
        recordId: created.id,
        note: 'Should fail',
        actorUserId: 'user_1',
      }),
    ).rejects.toThrow(InvalidStateTransitionError);
  });
});
