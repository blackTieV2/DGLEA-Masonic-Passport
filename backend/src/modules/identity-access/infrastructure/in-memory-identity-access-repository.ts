import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import type { IdentityAccessRepository } from '../application/ports';

interface UserSeed {
  password: string;
  context: CurrentUserContext;
}

export class InMemoryIdentityAccessRepository implements IdentityAccessRepository {
  private readonly usersById = new Map<string, UserSeed>();
  private readonly userIdByEmail = new Map<string, string>();

  constructor(seedUsers: UserSeed[] = []) {
    for (const user of seedUsers) {
      this.usersById.set(user.context.identity.userId, user);
      this.userIdByEmail.set(user.context.identity.email, user.context.identity.userId);
    }
  }

  async getCurrentUserContextByUserId(userId: string): Promise<CurrentUserContext | null> {
    return this.usersById.get(userId)?.context ?? null;
  }

  async verifyCredentials(email: string, password: string): Promise<{ userId: string } | null> {
    const userId = this.userIdByEmail.get(email);
    if (!userId) {
      return null;
    }

    const user = this.usersById.get(userId);
    if (!user || user.password !== password) {
      return null;
    }

    return { userId };
  }
}
