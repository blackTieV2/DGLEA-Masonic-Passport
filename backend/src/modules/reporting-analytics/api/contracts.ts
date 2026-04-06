/**
 * API contracts (placeholders).
 */
export interface ApiRequest<TBody = unknown, TParams = Record<string, string>> {
  params: TParams;
  body: TBody;
  actorUserId: string;
}

export interface ApiResponse<TBody = unknown> {
  status: number;
  body: TBody;
}
