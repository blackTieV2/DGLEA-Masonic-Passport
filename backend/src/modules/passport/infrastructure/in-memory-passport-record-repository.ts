import type { PassportRecordRepository } from '../application/ports';
import type { PassportRecord } from '../domain/contracts';

export class InMemoryPassportRecordRepository implements PassportRecordRepository {
  private counter = 0;
  private readonly records = new Map<string, PassportRecord>();

  nextId(): string {
    this.counter += 1;
    return `pr_${this.counter}`;
  }

  async getById(id: string): Promise<PassportRecord | null> {
    return this.records.get(id) ?? null;
  }

  async listByStatus(status: PassportRecord['status']): Promise<PassportRecord[]> {
    return [...this.records.values()].filter((record) => record.status === status);
  }

  async getMemberUserIdByMemberProfileId(memberProfileId: string): Promise<string | null> {
    const record = [...this.records.values()].find((item) => item.memberProfileId === memberProfileId);
    return record?.createdByUserId ?? null;
  }

  async save(record: PassportRecord): Promise<void> {
    this.records.set(record.id, record);
  }
}
