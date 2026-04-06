/**
 * Unit placeholder: workflow state transitions
 */
describe('workflow state transitions (unit)', () => {
  it.todo('DRAFT -> SUBMITTED is valid with minimum required fields');
  it.todo('SUBMITTED -> VERIFIED is restricted to authorized verifier roles');
  it.todo('SUBMITTED -> REJECTED requires reason');
  it.todo('SUBMITTED -> NEEDS_CLARIFICATION requires reason');
  it.todo('NEEDS_CLARIFICATION -> SUBMITTED supports resubmission');
  it.todo('VERIFIED -> SUPERSEDED preserves historical truth');
  it.todo('* -> OVERRIDDEN requires reason and audit marker');
  it.todo('invalid transitions return INVALID_STATE_TRANSITION');
});
