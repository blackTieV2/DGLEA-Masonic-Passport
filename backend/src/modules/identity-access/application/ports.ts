import type { CurrentUserContext } from '../../../shared/contracts/authorization';

export interface SessionRecord {
  sessionId: string;
  userId: string;
  refreshToken: string;
  expiresAtIso: string;
}

export interface SessionStore {
  create(record: SessionRecord): Promise<void>;
  getByRefreshToken(refreshToken: string): Promise<SessionRecord | null>;
  deleteBySessionId(sessionId: string): Promise<void>;
}

export interface IdentityAccessRepository {
  getCurrentUserContextByUserId(userId: string): Promise<CurrentUserContext | null>;
  verifyCredentials(email: string, password: string): Promise<{ userId: string } | null>;
}

export interface TokenProvider {
  issueAccessToken(payload: { userId: string; sessionId: string }): Promise<string>;
  issueRefreshToken(payload: { userId: string; sessionId: string }): Promise<string>;
  generateSessionId(): string;
  computeExpiryIso(): string;
}
