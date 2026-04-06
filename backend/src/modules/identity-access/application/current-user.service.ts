import type { Capability, CurrentUserContext } from '../../../shared/contracts/authorization';
import { NotFoundError } from '../../../shared/utilities/errors';
import { deriveEffectiveScopes, resolveCapabilities } from '../domain/permissions';
import type { IdentityAccessRepository } from './ports';

export interface CurrentUserView {
  userId: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  scopes: {
    lodges: string[];
    districts: string[];
    assignedMemberUserIds: string[];
  };
  capabilities: Capability[];
}

export class CurrentUserService {
  constructor(private readonly repo: IdentityAccessRepository) {}

  async getCurrentUser(userId: string): Promise<CurrentUserView> {
    const context = await this.repo.getCurrentUserContextByUserId(userId);
    if (!context) {
      throw new NotFoundError('Current user context not found.');
    }

    const scopes = deriveEffectiveScopes(context);
    const capabilities = resolveCapabilities(context);

    return {
      userId: context.identity.userId,
      email: context.identity.email,
      displayName: context.identity.displayName,
      status: context.identity.status,
      roles: context.roles.filter((r) => r.active).map((r) => r.roleCode),
      scopes,
      capabilities,
    };
  }

}
