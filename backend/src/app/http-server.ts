import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { composeInMemoryApp, type AppComposition } from './composition';
import { ForbiddenError, InvalidStateTransitionError, NotFoundError, UnauthorizedError } from '../shared/utilities/errors';
import type { CurrentUserContext } from '../shared/contracts/authorization';

interface AuthenticatedRequest extends FastifyRequest {
  actorUserId: string;
  actorContext: CurrentUserContext;
}

function toHttpError(error: unknown, reply: FastifyReply): void {
  if (error instanceof UnauthorizedError) {
    reply.status(401).send({ code: 'UNAUTHENTICATED', message: error.message });
    return;
  }
  if (error instanceof ForbiddenError) {
    reply.status(403).send({ code: 'FORBIDDEN', message: error.message });
    return;
  }
  if (error instanceof NotFoundError) {
    reply.status(404).send({ code: 'NOT_FOUND', message: error.message });
    return;
  }
  if (error instanceof InvalidStateTransitionError) {
    reply.status(409).send({ code: 'INVALID_STATE_TRANSITION', message: error.message });
    return;
  }

  reply.status(500).send({ code: 'INTERNAL_ERROR', message: 'Unexpected server error.' });
}

async function requireAuth(request: FastifyRequest, reply: FastifyReply, app: AppComposition): Promise<AuthenticatedRequest | null> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    reply.status(401).send({ code: 'UNAUTHENTICATED', message: 'Bearer token required.' });
    return null;
  }

  const parsed = app.tokenProvider.parseAccessToken(token);
  if (!parsed) {
    reply.status(401).send({ code: 'UNAUTHENTICATED', message: 'Invalid access token.' });
    return null;
  }

  const actorContext = await app.resolveCurrentUserContext(parsed.userId);
  if (!actorContext) {
    reply.status(401).send({ code: 'UNAUTHENTICATED', message: 'Session user not found.' });
    return null;
  }

  const authRequest = request as AuthenticatedRequest;
  authRequest.actorUserId = parsed.userId;
  authRequest.actorContext = actorContext;
  return authRequest;
}

export function buildHttpServer(app: AppComposition = composeInMemoryApp()): FastifyInstance {
  const server = Fastify({ logger: false });

  server.post('/auth/login', async (request, reply) => {
    try {
      const body = request.body as { email: string; password: string };
      const session = await app.authSession.login({ email: body.email, password: body.password });

      reply.send({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: 3600,
        user: {
          id: session.currentUser.userId,
          email: session.currentUser.email,
          displayName: session.currentUser.displayName,
          status: session.currentUser.status,
        },
        roles: session.currentUser.roles,
        scopes: {
          lodges: session.currentUser.scopes.lodges,
          districts: session.currentUser.scopes.districts,
          assignedMemberIds: session.currentUser.scopes.assignedMemberUserIds,
        },
      });
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/auth/refresh', async (request, reply) => {
    try {
      const body = request.body as { refreshToken: string };
      const session = await app.authSession.refresh({ refreshToken: body.refreshToken });

      reply.send({ accessToken: session.accessToken, refreshToken: session.refreshToken, expiresIn: 3600 });
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.get('/auth/me', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const me = await app.currentUser.getCurrentUser(auth.actorUserId);
      reply.send({
        accessToken: request.headers.authorization?.replace('Bearer ', '') ?? '',
        refreshToken: '',
        expiresIn: 3600,
        user: {
          id: me.userId,
          email: me.email,
          displayName: me.displayName,
          status: me.status,
        },
        roles: me.roles,
        scopes: {
          lodges: me.scopes.lodges,
          districts: me.scopes.districts,
          assignedMemberIds: me.scopes.assignedMemberUserIds,
        },
      });
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.get('/me', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const me = await app.currentUser.getCurrentUser(auth.actorUserId);
      reply.send({ id: me.userId, email: me.email, displayName: me.displayName, status: me.status });
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/members/:memberId/passport-records', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { memberId: string };
      const body = request.body as {
        districtId: string;
        lodgeId: string;
        sectionTemplateId: string;
        templateItemId: string;
        note?: string;
        eventDate?: string;
      };

      const record = await app.passport.createDraft({
        memberProfileId: params.memberId,
        districtId: body.districtId,
        lodgeId: body.lodgeId,
        sectionTemplateId: body.sectionTemplateId,
        templateItemId: body.templateItemId,
        note: body.note,
        eventDate: body.eventDate,
        actorUserId: auth.actorUserId,
      });

      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.get('/members/:memberId/passport-summary', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { memberId: string };
      const summary = await app.passport.brotherSummary({ memberProfileId: params.memberId });
      reply.send(summary);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.patch('/passport-records/:recordId', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const body = request.body as { note?: string; eventDate?: string };
      const record = await app.passport.updateDraft({
        recordId: params.recordId,
        note: body.note,
        eventDate: body.eventDate,
        actorUserId: auth.actorUserId,
      });

      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/passport-records/:recordId/submit', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const record = await app.passport.submitForVerification({
        recordId: params.recordId,
        actorUserId: auth.actorUserId,
      });
      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/passport-records/:recordId/verify', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const record = await app.verification.verify({ recordId: params.recordId, actor: auth.actorContext });
      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/passport-records/:recordId/reject', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const body = request.body as { reason: string };
      const record = await app.verification.reject({ recordId: params.recordId, reason: body.reason, actor: auth.actorContext });
      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/passport-records/:recordId/clarification', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const body = request.body as { reason: string };
      const record = await app.verification.requestClarification({
        recordId: params.recordId,
        reason: body.reason,
        actor: auth.actorContext,
      });
      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.post('/passport-records/:recordId/override', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const params = request.params as { recordId: string };
      const body = request.body as { targetStatus: 'VERIFIED' | 'REJECTED' | 'SUPERSEDED'; reason: string };
      const record = await app.verification.override({
        recordId: params.recordId,
        targetStatus: body.targetStatus,
        reason: body.reason,
        actor: auth.actorContext,
      });
      reply.send(record);
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  server.get('/verification-queue', async (request, reply) => {
    const auth = await requireAuth(request, reply, app);
    if (!auth) return;

    try {
      const queue = await app.verification.pendingQueue({ actor: auth.actorContext });
      const items = queue.map((record) => ({
        id: `vq_${record.id}`,
        passportRecordId: record.id,
        memberProfileId: record.memberProfileId,
        lodgeId: record.lodgeId,
        currentStatus: record.status,
        note: record.note,
        reviewReason: record.reviewReason,
        submittedAt: record.submittedAt ?? record.updatedAt,
        isStale: false,
      }));
      reply.send({ items, page: 1, pageSize: items.length, totalItems: items.length, totalPages: 1 });
    } catch (error) {
      toHttpError(error, reply);
    }
  });

  return server;
}
