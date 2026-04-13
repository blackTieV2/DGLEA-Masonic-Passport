/**
 * Integration placeholder: member profile CRUD
 */
describe('member profile CRUD (integration)', () => {
  it.todo('POST /members creates member profile in allowed scope');
  it.todo('GET /members/{memberId} returns profile only within caller scope');
  it.todo('PATCH /members/{memberId} updates allowed profile fields');
  it.todo('PATCH /members/{memberId}/milestones uses controlled admin correction path');
  it.todo('cross-lodge unauthorized CRUD attempts return FORBIDDEN');
});
