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

const CORE_SECTIONS = [
  { sectionCode: 'EA', sectionName: 'Entered Apprentice' },
  { sectionCode: 'FC', sectionName: 'Fellow Craft' },
  { sectionCode: 'MM', sectionName: 'Master Mason' },
  { sectionCode: 'PFO', sectionName: 'Preparing for Office' },
] as const;

function resolveSectionCode(sectionTemplateId: string): string | null {
  const normalized = sectionTemplateId.toLowerCase();
  if (normalized === 'sec_1' || normalized.includes('ea')) return 'EA';
  if (normalized === 'sec_2' || normalized.includes('fc')) return 'FC';
  if (normalized === 'sec_3' || normalized.includes('mm')) return 'MM';
  if (normalized === 'sec_4' || normalized.includes('pfo')) return 'PFO';
  return null;
}

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

  async getBrotherSummary(input: { memberProfileId: string }): Promise<{
    memberProfileId: string;
    sections: Array<{
      sectionCode: string;
      sectionName: string;
      progressState: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED';
      latestStatus?: PassportRecord['status'];
      lastActivityAt?: string;
      pendingAction?: 'SUBMIT_DRAFT' | 'AWAITING_REVIEW' | 'RESPOND_TO_CLARIFICATION';
      latestReviewReason?: string;
    }>;
  }> {
    const records = await this.recordRepo.listByMemberProfileId(input.memberProfileId);

    return {
      memberProfileId: input.memberProfileId,
      sections: CORE_SECTIONS.map((section) => {
        const sectionRecords = records.filter((record) => resolveSectionCode(record.sectionTemplateId) === section.sectionCode);
        const latest = sectionRecords.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
        if (!latest) {
          return { ...section, progressState: 'NOT_STARTED' as const };
        }

        const progressState =
          latest.status === 'VERIFIED'
            ? 'VERIFIED'
            : latest.status === 'DRAFT' || latest.status === 'NEEDS_CLARIFICATION' || latest.status === 'SUBMITTED'
              ? 'IN_PROGRESS'
              : 'NOT_STARTED';

        const pendingAction =
          latest.status === 'DRAFT'
            ? 'SUBMIT_DRAFT'
            : latest.status === 'SUBMITTED'
              ? 'AWAITING_REVIEW'
              : latest.status === 'NEEDS_CLARIFICATION'
                ? 'RESPOND_TO_CLARIFICATION'
                : undefined;

        return {
          ...section,
          progressState,
          latestStatus: latest.status,
          lastActivityAt: latest.updatedAt,
          pendingAction,
          latestReviewReason: latest.reviewReason,
        };
      }),
    };
  }
}
