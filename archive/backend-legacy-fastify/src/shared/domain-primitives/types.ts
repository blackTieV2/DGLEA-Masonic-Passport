/** Shared domain primitive placeholders. */
export type EntityId = string;
export type IsoTimestamp = string;

export interface ValueObject<T = unknown> {
  value: T;
}
