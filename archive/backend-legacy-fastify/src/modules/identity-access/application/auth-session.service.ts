import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import { UnauthorizedError } from '../../../shared/utilities/errors';
import type { IdentityAccessRepository, SessionStore, TokenProvider } from './ports';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAtIso: string;
  currentUser: CurrentUserContext;
}

export class AuthSessionService {
  constructor(
    private readonly repo: IdentityAccessRepository,
    private readonly sessionStore: SessionStore,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async login(email: string, password: string): Promise<AuthSession> {
    const verified = await this.repo.verifyCredentials(email, password);
    if (!verified) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const currentUser = await this.repo.getCurrentUserContextByUserId(verified.userId);
    if (!currentUser || currentUser.identity.status !== 'ACTIVE') {
      throw new UnauthorizedError('User is not active or not found.');
    }

    return this.createSessionForUser(currentUser);
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const existing = await this.sessionStore.getByRefreshToken(refreshToken);
    if (!existing) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const currentUser = await this.repo.getCurrentUserContextByUserId(existing.userId);
    if (!currentUser || currentUser.identity.status !== 'ACTIVE') {
      throw new UnauthorizedError('User is not active or not found.');
    }

    await this.sessionStore.deleteBySessionId(existing.sessionId);
    return this.createSessionForUser(currentUser);
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionStore.deleteBySessionId(sessionId);
  }

  private async createSessionForUser(currentUser: CurrentUserContext): Promise<AuthSession> {
    const sessionId = this.tokenProvider.generateSessionId();
    const expiresAtIso = this.tokenProvider.computeExpiryIso();
    const accessToken = await this.tokenProvider.issueAccessToken({ userId: currentUser.identity.userId, sessionId });
    const refreshToken = await this.tokenProvider.issueRefreshToken({ userId: currentUser.identity.userId, sessionId });

    await this.sessionStore.create({
      sessionId,
      userId: currentUser.identity.userId,
      refreshToken,
      expiresAtIso,
    });

    return { accessToken, refreshToken, expiresAtIso, currentUser };
  }
}
