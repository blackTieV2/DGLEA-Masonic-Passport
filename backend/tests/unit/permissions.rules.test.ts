import assert from 'node:assert/strict';
import test from 'node:test';
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
  roles: [
    { roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', lodgeId: 'lodge_1', districtId: 'dist_1', active: true },
  ],
};

test('deriveEffectiveScopes collects lodge and district from active roles', () => {
  const scopes = deriveEffectiveScopes(baseContext);
  assert.deepEqual(scopes.lodges, ['lodge_1']);
  assert.deepEqual(scopes.districts, ['dist_1']);
});

test('hasCapability returns true only for allowed role capabilities', () => {
  assert.equal(hasCapability(baseContext, 'verification.verify.lodge'), true);
  assert.equal(hasCapability(baseContext, 'member.read.assigned'), false);
});

test('resolveCapabilities returns deduplicated effective capabilities', () => {
  const capabilities = resolveCapabilities(baseContext);
  assert.equal(capabilities.includes('verification.verify.lodge'), true);
  assert.equal(capabilities.includes('auth.session.read'), true);
});

test('lodge scope assertion blocks out-of-scope lodge access', () => {
  assert.doesNotThrow(() => assertLodgeScope(baseContext, 'lodge_1'));
  assert.throws(() => assertLodgeScope(baseContext, 'lodge_2'));
});

test('district scope assertion blocks out-of-scope district access', () => {
  assert.doesNotThrow(() => assertDistrictScope(baseContext, 'dist_1'));
  assert.throws(() => assertDistrictScope(baseContext, 'dist_2'));
});
