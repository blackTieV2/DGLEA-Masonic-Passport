import { NotFoundError } from '../../../shared/utilities/errors';
import { createDraftRecord, submitRecordForVerification, updateDraftRecord } from '../domain/contracts';
import type { PassportRecord } from '../domain/contracts';
import type {
  AuditEventWriter,
  ClockPort,
  NotificationEventHook,
  PassportRecordRepository,
  TemplateItemRepository,
} from './ports';

export class PassportRecordService {
  constructor(
    private readonly recordRepo: PassportRecordRepository,
    private readonly templateRepo: TemplateItemRepository,
    private readonly auditWriter: AuditEventWriter,
    private readonly notificationHook: NotificationEventHook,
    private readonly clock: ClockPort,
  ) {}

  async createDraft(input: {
    memberProfileId: string;
    districtId: string;
    lodgeId: string;
    sectionTemplateId: string;
    templateItemId: string;
    note?: string;
    eventDate?: string;
    actorUserId: string;
  }): Promise<PassportRecord> {
    const templateItem = await this.templateRepo.getById(input.templateItemId);
    if (!templateItem) {
      throw new NotFoundError('Template item not found.');
    }

    const nowIso = this.clock.nowIso();
    const record = createDraftRecord({
      id: this.recordRepo.nextId(),
      memberProfileId: input.memberProfileId,
      districtId: input.districtId,
      lodgeId: input.lodgeId,
      sectionTemplateId: input.sectionTemplateId,
      templateItem,
      note: input.note,
      eventDate: input.eventDate,
      actorUserId: input.actorUserId,
      nowIso,
    });

    await this.recordRepo.save(record);
    await this.auditWriter.write({
      eventType: 'PASSPORT_RECORD_CREATED',
      entityId: record.id,
      actorUserId: input.actorUserId,
      newStatus: record.status,
      occurredAt: nowIso,
    });

    return record;
  }

  async updateDraft(input: {
    recordId: string;
    note?: string;
    eventDate?: string;
    actorUserId: string;
  }): Promise<PassportRecord> {
    const existing = await this.recordRepo.getById(input.recordId);
    if (!existing) {
      throw new NotFoundError('Passport record not found.');
    }

    const nowIso = this.clock.nowIso();
    const updated = updateDraftRecord(existing, {
      note: input.note,
      eventDate: input.eventDate,
      nowIso,
    });

    await this.recordRepo.save(updated);
    await this.auditWriter.write({
      eventType: 'PASSPORT_RECORD_UPDATED',
      entityId: updated.id,
      actorUserId: input.actorUserId,
      priorStatus: existing.status,
      newStatus: updated.status,
      occurredAt: nowIso,
    });

    return updated;
  }

  async submitForVerification(input: { recordId: string; actorUserId: string }): Promise<PassportRecord> {
    const existing = await this.recordRepo.getById(input.recordId);
    if (!existing) {
      throw new NotFoundError('Passport record not found.');
    }

    const nowIso = this.clock.nowIso();
    const submitted = submitRecordForVerification(existing, nowIso);

    await this.recordRepo.save(submitted);
    await this.auditWriter.write({
      eventType: 'PASSPORT_RECORD_SUBMITTED',
      entityId: submitted.id,
      actorUserId: input.actorUserId,
      priorStatus: existing.status,
      newStatus: submitted.status,
      occurredAt: nowIso,
    });

    await this.notificationHook.trigger({
      type: 'PASSPORT_RECORD_SUBMITTED',
      recordId: submitted.id,
      memberProfileId: submitted.memberProfileId,
      lodgeId: submitted.lodgeId,
      districtId: submitted.districtId,
      occurredAt: nowIso,
    });

    return submitted;
  }
}
