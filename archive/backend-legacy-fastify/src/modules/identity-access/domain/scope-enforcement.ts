import type { CurrentUserContext } from '../../../shared/contracts/authorization';
import { ForbiddenError } from '../../../shared/utilities/errors';
import { deriveEffectiveScopes } from './permissions';

export function assertLodgeScope(context: CurrentUserContext, lodgeId: string): void {
  const scopes = deriveEffectiveScopes(context);
  if (!scopes.lodges.includes(lodgeId)) {
    throw new ForbiddenError('Caller is outside lodge scope.');
  }
}

export function assertDistrictScope(context: CurrentUserContext, districtId: string): void {
  const scopes = deriveEffectiveScopes(context);
  if (!scopes.districts.includes(districtId)) {
    throw new ForbiddenError('Caller is outside district scope.');
  }
}

export function assertAssignedMemberScope(context: CurrentUserContext, memberUserId: string): void {
  const scopes = deriveEffectiveScopes(context);
  if (!scopes.assignedMemberUserIds.includes(memberUserId)) {
    throw new ForbiddenError('Caller is not assigned to this member.');
  }
}
