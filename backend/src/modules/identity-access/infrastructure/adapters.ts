/**
 * Infrastructure adapter placeholders.
 */
export interface StorageAdapter {
  query<T = unknown>(statement: string, params?: unknown[]): Promise<T[]>;
}

export interface ClockAdapter {
  nowIso(): string;
}
