/**
 * Integration placeholder: passport submission workflow
 */
describe('passport submission workflow (integration)', () => {
  it.todo('POST /members/{memberId}/passport-records creates DRAFT record');
  it.todo('PATCH /passport-records/{recordId} updates draft before submission');
  it.todo('POST /passport-records/{recordId}/submit transitions DRAFT -> SUBMITTED');
  it.todo('submitted record appears in verification queue projection');
  it.todo('attempt to edit VERIFIED record via draft patch path is rejected');
});
