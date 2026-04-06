/**
 * Domain contracts (placeholders).
 */
export interface DomainEvent {
  name: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface AggregateRoot {
  id: string;
  version: number;
}
