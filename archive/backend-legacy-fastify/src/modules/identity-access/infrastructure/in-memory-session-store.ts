import type { SessionRecord, SessionStore } from '../application/ports';

/**
 * In-memory store for bootstrap/testing only.
 * Replace with persistent implementation in production deployment.
 */
export class InMemorySessionStore implements SessionStore {
  private readonly bySessionId = new Map<string, SessionRecord>();
  private readonly byRefreshToken = new Map<string, string>();

  async create(record: SessionRecord): Promise<void> {
    this.bySessionId.set(record.sessionId, record);
    this.byRefreshToken.set(record.refreshToken, record.sessionId);
  }

  async getByRefreshToken(refreshToken: string): Promise<SessionRecord | null> {
    const sessionId = this.byRefreshToken.get(refreshToken);
    if (!sessionId) return null;
    return this.bySessionId.get(sessionId) ?? null;
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    const existing = this.bySessionId.get(sessionId);
    if (existing) {
      this.byRefreshToken.delete(existing.refreshToken);
      this.bySessionId.delete(sessionId);
    }
  }
}
