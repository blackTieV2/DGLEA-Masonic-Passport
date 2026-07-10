export interface SqlQueryResult<TRow = Record<string, unknown>> {
  rows: TRow[];
}

export interface SqlClient {
  query<TRow = Record<string, unknown>>(statement: string, params?: unknown[]): Promise<SqlQueryResult<TRow>>;
}
