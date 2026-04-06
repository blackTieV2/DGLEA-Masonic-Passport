import type { AuditEventWriter, NotificationEventHook } from '../application/ports';

export class InMemoryAuditEventWriter implements AuditEventWriter {
  public readonly events: Array<{
    eventType: 'PASSPORT_RECORD_CREATED' | 'PASSPORT_RECORD_UPDATED' | 'PASSPORT_RECORD_SUBMITTED';
    entityId: string;
    actorUserId: string;
    priorStatus?: string;
    newStatus: string;
    reason?: string;
    occurredAt: string;
  }> = [];

  async write(event: {
    eventType: 'PASSPORT_RECORD_CREATED' | 'PASSPORT_RECORD_UPDATED' | 'PASSPORT_RECORD_SUBMITTED';
    entityId: string;
    actorUserId: string;
    priorStatus?: string;
    newStatus: string;
    reason?: string;
    occurredAt: string;
  }): Promise<void> {
    this.events.push(event);
  }
}

export class InMemoryNotificationEventHook implements NotificationEventHook {
  public readonly events: Array<{
    type: 'PASSPORT_RECORD_SUBMITTED';
    recordId: string;
    memberProfileId: string;
    lodgeId: string;
    districtId: string;
    occurredAt: string;
  }> = [];

  async trigger(event: {
    type: 'PASSPORT_RECORD_SUBMITTED';
    recordId: string;
    memberProfileId: string;
    lodgeId: string;
    districtId: string;
    occurredAt: string;
  }): Promise<void> {
    this.events.push(event);
  }
}
