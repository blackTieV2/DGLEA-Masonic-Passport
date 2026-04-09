import type { TokenProvider } from '../application/ports';

export class SimpleTokenProvider implements TokenProvider {
  issueAccessToken(payload: { userId: string; sessionId: string }): Promise<string> {
    return Promise.resolve(`access.${payload.userId}.${payload.sessionId}`);
  }

  issueRefreshToken(payload: { userId: string; sessionId: string }): Promise<string> {
    return Promise.resolve(`refresh.${payload.userId}.${payload.sessionId}`);
  }

  generateSessionId(): string {
    return `sess_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  computeExpiryIso(): string {
    return new Date(Date.now() + 60 * 60 * 1000).toISOString();
  }

  parseAccessToken(token: string): { userId: string; sessionId: string } | null {
    const [prefix, userId, sessionId] = token.split('.');
    if (prefix !== 'access' || !userId || !sessionId) {
      return null;
    }
    return { userId, sessionId };
  }
}
