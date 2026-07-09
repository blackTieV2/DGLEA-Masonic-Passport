import type { CurrentUserResponse } from './contracts';
import { CurrentUserService } from '../application/current-user.service';

export class CurrentUserEndpoint {
  constructor(private readonly currentUserService: CurrentUserService) {}

  async getCurrentUser(userId: string): Promise<CurrentUserResponse> {
    const currentUser = await this.currentUserService.getCurrentUser(userId);
    return {
      userId: currentUser.userId,
      email: currentUser.email,
      displayName: currentUser.displayName,
      status: currentUser.status,
      roles: currentUser.roles,
      scopes: currentUser.scopes,
      capabilities: currentUser.capabilities,
    };
  }
}
