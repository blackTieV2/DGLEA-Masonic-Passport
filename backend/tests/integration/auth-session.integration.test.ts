import { AuthSessionService } from '../../src/modules/identity-access/application/auth-session.service';
import type { IdentityAccessRepository, SessionStore, TokenProvider } from '../../src/modules/identity-access/application/ports';

const activeContext = {
  identity: {
    userId: 'usr_1',
    email: 'user@example.org',
    displayName: 'User One',
    status: 'ACTIVE' as const,
  },
  roles: [{ roleCode: 'BROTHER' as const, scopeType: 'LODGE' as const, lodgeId: 'lodge_1', active: true }],
};

class FakeRepo implements IdentityAccessRepository {
  async getCurrentUserContextByUserId(userId: string) {
    return userId === 'usr_1' ? activeContext : null;
  }

  async verifyCredentials(email: string, password: string) {
    return email === 'user@example.org' && password === 'pass' ? { userId: 'usr_1' } : null;
  }
}

class FakeSessionStore implements SessionStore {
  private byRefreshToken = new Map<string, { sessionId: string; userId: string; refreshToken: string; expiresAtIso: string }>();

  async create(record: { sessionId: string; userId: string; refreshToken: string; expiresAtIso: string }) {
    this.byRefreshToken.set(record.refreshToken, record);
  }

  async getByRefreshToken(refreshToken: string) {
    return this.byRefreshToken.get(refreshToken) ?? null;
  }

  async deleteBySessionId(sessionId: string) {
    for (const [key, value] of this.byRefreshToken.entries()) {
      if (value.sessionId === sessionId) this.byRefreshToken.delete(key);
    }
  }
}

class FakeTokenProvider implements TokenProvider {
  issueAccessToken() {
    return Promise.resolve('access-token');
  }

  issueRefreshToken() {
    return Promise.resolve('refresh-token');
  }

  generateSessionId() {
    return 'session-1';
  }

  computeExpiryIso() {
    return '2030-01-01T00:00:00.000Z';
  }
}

describe('auth session (integration)', () => {
  it('login creates a session for valid credentials', async () => {
    const service = new AuthSessionService(new FakeRepo(), new FakeSessionStore(), new FakeTokenProvider());
    const session = await service.login('user@example.org', 'pass');

    expect(session.accessToken).toBe('access-token');
    expect(session.refreshToken).toBe('refresh-token');
    expect(session.currentUser.identity.userId).toBe('usr_1');
  });

  it('refresh rejects unknown refresh token', async () => {
    const service = new AuthSessionService(new FakeRepo(), new FakeSessionStore(), new FakeTokenProvider());
    await expect(service.refresh('unknown-token')).rejects.toThrow();
  });
});
