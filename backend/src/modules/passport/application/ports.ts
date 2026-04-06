import type { PassportRecord, TemplateItemReference } from '../domain/contracts';

export interface PassportRecordRepository {
  nextId(): string;
  getById(id: string): Promise<PassportRecord | null>;
  listByStatus(status: PassportRecord['status']): Promise<PassportRecord[]>;
  save(record: PassportRecord): Promise<void>;
}

/**
 * Deferred for current stabilisation pass:
 * full PassportRecordVersion write/read support will be added when persistence
 * integration goes beyond the current minimal workflow baseline.
 */
export interface PassportRecordVersionRepository {
  appendVersion(_version: {
    passportRecordId: string;
    versionNumber: number;
    payloadJson: Record<string, unknown>;
    changeReason?: string;
    createdByUserId: string;
    createdAt: string;
  }): Promise<void>;
}

export interface TemplateItemRepository {
  getById(templateItemId: string): Promise<TemplateItemReference | null>;
}

export interface AuditEventWriter {
  write(event: {
    eventType: 'PASSPORT_RECORD_CREATED' | 'PASSPORT_RECORD_UPDATED' | 'PASSPORT_RECORD_SUBMITTED';
    entityId: string;
    actorUserId: string;
    priorStatus?: string;
    newStatus: string;
    reason?: string;
    occurredAt: string;
  }): Promise<void>;
}

export interface NotificationEventHook {
  trigger(event: {
    type: 'PASSPORT_RECORD_SUBMITTED';
    recordId: string;
    memberProfileId: string;
    lodgeId: string;
    districtId: string;
    occurredAt: string;
  }): Promise<void>;
}

export interface ClockPort {
  nowIso(): string;
}
