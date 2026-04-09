/** Shared contract placeholders for backend module communication. */
export interface Command<TPayload = Record<string, unknown>> {
  name: string;
  payload: TPayload;
}

export interface Query<TParams = Record<string, unknown>> {
  name: string;
  params: TParams;
}
