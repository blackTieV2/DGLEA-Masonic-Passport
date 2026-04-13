/**
 * Application layer ports (placeholders).
 *
 * Implementations belong in infrastructure layer.
 */
export interface RepositoryPort<T, TId = string> {
  getById(id: TId): Promise<T | null>;
  save(entity: T): Promise<void>;
}

export interface EventPublisherPort {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}
