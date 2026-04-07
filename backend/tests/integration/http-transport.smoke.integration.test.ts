import { buildHttpServer } from '../../src/app/http-server';

describe('http transport smoke', () => {
  it('supports auth + passport + verification flow through HTTP routes', async () => {
    const server = buildHttpServer();

    const login = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'brother@example.org', password: 'pass' },
    });

    expect(login.statusCode).toBe(200);
    const session = login.json();
    expect(session).toHaveProperty('accessToken');

    const brotherToken = session.accessToken as string;


    const meRes = await server.inject({
      method: 'GET',
      url: '/me',
      headers: { authorization: `Bearer ${brotherToken}` },
    });
    expect(meRes.statusCode).toBe(200);
    expect(meRes.json().id).toBe('usr_brother');

    const authMeRes = await server.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { authorization: `Bearer ${brotherToken}` },
    });
    expect(authMeRes.statusCode).toBe(200);
    expect(authMeRes.json().user.id).toBe('usr_brother');

    const created = await server.inject({
      method: 'POST',
      url: '/members/mp_1/passport-records',
      headers: { authorization: `Bearer ${brotherToken}` },
      payload: {
        districtId: 'dist_1',
        lodgeId: 'lodge_1',
        sectionTemplateId: 'sec_1',
        templateItemId: 'ti_1',
      },
    });

    expect(created.statusCode).toBe(200);
    const draft = created.json();
    expect(draft.status).toBe('DRAFT');

    const submittedRes = await server.inject({
      method: 'POST',
      url: `/passport-records/${draft.id}/submit`,
      headers: { authorization: `Bearer ${brotherToken}` },
    });

    expect(submittedRes.statusCode).toBe(200);
    expect(submittedRes.json().status).toBe('SUBMITTED');

    const mentorLogin = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'mentor@example.org', password: 'pass' },
    });

    const mentorToken = mentorLogin.json().accessToken as string;

    const verifiedRes = await server.inject({
      method: 'POST',
      url: `/passport-records/${draft.id}/verify`,
      headers: { authorization: `Bearer ${mentorToken}` },
    });

    expect(verifiedRes.statusCode).toBe(200);
    expect(verifiedRes.json().status).toBe('VERIFIED');

    const queueRes = await server.inject({
      method: 'GET',
      url: '/verification-queue',
      headers: { authorization: `Bearer ${mentorToken}` },
    });

    expect(queueRes.statusCode).toBe(200);
    expect(Array.isArray(queueRes.json().items)).toBe(true);

    await server.close();
  });
});
