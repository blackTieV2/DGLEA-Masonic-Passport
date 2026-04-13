export type RoleCode =
  | 'BROTHER'
  | 'PERSONAL_MENTOR'
  | 'LODGE_MENTOR'
  | 'LODGE_REVIEWER'
  | 'LODGE_ADMIN'
  | 'DISTRICT_MENTOR'
  | 'DISTRICT_ADMIN'
  | 'SYSTEM_ADMIN';

export type ScopeType = 'SYSTEM' | 'DISTRICT' | 'LODGE' | 'ASSIGNED_MEMBER';

export interface UserScopeRole {
  roleCode: RoleCode;
  scopeType: ScopeType;
  districtId?: string;
  lodgeId?: string;
  assignedMemberUserIds?: string[];
  active: boolean;
}

export interface CurrentUserIdentity {
  userId: string;
  email: string;
  displayName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CurrentUserContext {
  identity: CurrentUserIdentity;
  roles: UserScopeRole[];
}

export interface EffectiveScopes {
  lodges: string[];
  districts: string[];
  assignedMemberUserIds: string[];
}

export type Capability =
  | 'auth.session.read'
  | 'member.read.self'
  | 'member.read.assigned'
  | 'member.read.lodge'
  | 'member.read.district.analytics'
  | 'passport.record.create.self'
  | 'passport.record.submit.self'
  | 'verification.verify.assigned'
  | 'verification.verify.lodge'
  | 'verification.override.lodge';
