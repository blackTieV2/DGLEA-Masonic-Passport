import type { AuthLoginRequest, AuthRefreshRequest, AuthSessionResponse } from './contracts';
import { AuthSessionService } from '../application/auth-session.service';
import { deriveEffectiveScopes, resolveCapabilities } from '../domain/permissions';

export class AuthSessionEndpoint {
  constructor(private readonly authSessionService: AuthSessionService) {}

  async login(request: AuthLoginRequest): Promise<AuthSessionResponse> {
    const session = await this.authSessionService.login(request.email, request.password);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAtIso: session.expiresAtIso,
      currentUser: {
        userId: session.currentUser.identity.userId,
        email: session.currentUser.identity.email,
        displayName: session.currentUser.identity.displayName,
        status: session.currentUser.identity.status,
        roles: session.currentUser.roles.filter((r) => r.active).map((r) => r.roleCode),
        scopes: deriveEffectiveScopes(session.currentUser),
        capabilities: resolveCapabilities(session.currentUser),
      },
    };
  }

  async refresh(request: AuthRefreshRequest): Promise<AuthSessionResponse> {
    const session = await this.authSessionService.refresh(request.refreshToken);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAtIso: session.expiresAtIso,
      currentUser: {
        userId: session.currentUser.identity.userId,
        email: session.currentUser.identity.email,
        displayName: session.currentUser.identity.displayName,
        status: session.currentUser.identity.status,
        roles: session.currentUser.roles.filter((r) => r.active).map((r) => r.roleCode),
        scopes: deriveEffectiveScopes(session.currentUser),
        capabilities: resolveCapabilities(session.currentUser),
      },
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.authSessionService.logout(sessionId);
  }
}
