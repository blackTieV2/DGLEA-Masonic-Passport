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

  async save(record: PassportRecord): Promise<void> {
    this.records.set(record.id, record);
  }
}
