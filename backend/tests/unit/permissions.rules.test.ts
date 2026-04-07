import type { CurrentUserContext } from '../../src/shared/contracts/authorization';
import { deriveEffectiveScopes, hasCapability, resolveCapabilities } from '../../src/modules/identity-access/domain/permissions';
import { assertDistrictScope, assertLodgeScope } from '../../src/modules/identity-access/domain/scope-enforcement';

const baseContext: CurrentUserContext = {
  identity: {
    userId: 'usr_1',
    email: 'user@example.org',
    displayName: 'User One',
    status: 'ACTIVE',
  },
  roles: [{ roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'lodge_1', districtId: 'dist_1', active: true }],
};

describe('permissions rules (unit)', () => {
  it('deriveEffectiveScopes collects lodge and district from active roles', () => {
    const scopes = deriveEffectiveScopes(baseContext);
    expect(scopes.lodges).toEqual(['lodge_1']);
    expect(scopes.districts).toEqual(['dist_1']);
  });

  it('hasCapability returns true only for allowed role capabilities', () => {
    expect(hasCapability(baseContext, 'verification.verify.lodge')).toBe(true);
    expect(hasCapability(baseContext, 'member.read.assigned')).toBe(false);
  });

  it('resolveCapabilities returns deduplicated effective capabilities', () => {
    const capabilities = resolveCapabilities(baseContext);
    expect(capabilities.includes('verification.verify.lodge')).toBe(true);
    expect(capabilities.includes('auth.session.read')).toBe(true);
  });

  it('lodge scope assertion blocks out-of-scope lodge access', () => {
    expect(() => assertLodgeScope(baseContext, 'lodge_1')).not.toThrow();
    expect(() => assertLodgeScope(baseContext, 'lodge_2')).toThrow();
  });

  it('district scope assertion blocks out-of-scope district access', () => {
    expect(() => assertDistrictScope(baseContext, 'dist_1')).not.toThrow();
    expect(() => assertDistrictScope(baseContext, 'dist_2')).toThrow();
  });
});
