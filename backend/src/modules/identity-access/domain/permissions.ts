import type { Capability, CurrentUserContext, EffectiveScopes, RoleCode } from '../../../shared/contracts/authorization';

const ROLE_CAPABILITIES: Record<RoleCode, Capability[]> = {
  BROTHER: ['auth.session.read', 'member.read.self', 'passport.record.create.self', 'passport.record.submit.self'],
  PERSONAL_MENTOR: ['auth.session.read', 'member.read.assigned', 'verification.verify.assigned'],
  LODGE_MENTOR: ['auth.session.read', 'member.read.lodge', 'verification.verify.lodge', 'verification.override.lodge'],
  LODGE_REVIEWER: ['auth.session.read', 'member.read.lodge'],
  LODGE_ADMIN: ['auth.session.read', 'member.read.lodge'],
  DISTRICT_MENTOR: ['auth.session.read', 'member.read.district.analytics'],
  DISTRICT_ADMIN: ['auth.session.read', 'member.read.district.analytics'],
  SYSTEM_ADMIN: ['auth.session.read', 'member.read.district.analytics'],
};

export function deriveEffectiveScopes(context: CurrentUserContext): EffectiveScopes {
  const lodges = new Set<string>();
  const districts = new Set<string>();
  const assigned = new Set<string>();

  for (const role of context.roles.filter((r) => r.active)) {
    if (role.lodgeId) lodges.add(role.lodgeId);
    if (role.districtId) districts.add(role.districtId);
    for (const memberUserId of role.assignedMemberUserIds ?? []) {
      assigned.add(memberUserId);
    }
  }

  return {
    lodges: [...lodges],
    districts: [...districts],
    assignedMemberUserIds: [...assigned],
  };
}

export function hasCapability(context: CurrentUserContext, capability: Capability): boolean {
  for (const role of context.roles.filter((r) => r.active)) {
    if ((ROLE_CAPABILITIES[role.roleCode] ?? []).includes(capability)) {
      return true;
    }
  }
  return false;
}


export function resolveCapabilities(context: CurrentUserContext): Capability[] {
  const all = new Set<Capability>();
  for (const role of context.roles.filter((r) => r.active)) {
    for (const capability of ROLE_CAPABILITIES[role.roleCode] ?? []) {
      all.add(capability);
    }
  }
  return [...all];
}
