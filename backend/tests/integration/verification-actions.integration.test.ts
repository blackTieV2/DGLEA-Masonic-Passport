/**
 * Integration placeholder: verify/reject/clarification actions
 */
describe('verification actions (integration)', () => {
  it.todo('POST /passport-records/{recordId}/verify transitions SUBMITTED -> VERIFIED');
  it.todo('POST /passport-records/{recordId}/reject transitions SUBMITTED -> REJECTED with reason');
  it.todo('POST /passport-records/{recordId}/clarification transitions SUBMITTED -> NEEDS_CLARIFICATION');
  it.todo('NEEDS_CLARIFICATION resubmission path supports subsequent verify/reject');
  it.todo('unauthorized verifier action returns FORBIDDEN');
  it.todo('invalid status transition returns INVALID_STATE_TRANSITION');
});
