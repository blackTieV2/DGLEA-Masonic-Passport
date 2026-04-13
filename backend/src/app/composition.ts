import { AuthSessionEndpoint } from '../modules/identity-access/api/auth-session.endpoint';
import { CurrentUserEndpoint } from '../modules/identity-access/api/current-user.endpoint';
import { AuthSessionService } from '../modules/identity-access/application/auth-session.service';
import { CurrentUserService } from '../modules/identity-access/application/current-user.service';
import { InMemoryIdentityAccessRepository } from '../modules/identity-access/infrastructure/in-memory-identity-access-repository';
import { InMemorySessionStore } from '../modules/identity-access/infrastructure/in-memory-session-store';
import { SimpleTokenProvider } from '../modules/identity-access/infrastructure/simple-token-provider';
import { PassportRecordEndpoint } from '../modules/passport/api/passport-record.endpoint';
import { PassportRecordService } from '../modules/passport/application/passport-record.service';
import { InMemoryAuditEventWriter, InMemoryNotificationEventHook } from '../modules/passport/infrastructure/in-memory-audit-notification';
import { InMemoryPassportRecordRepository } from '../modules/passport/infrastructure/in-memory-passport-record-repository';
import { InMemoryTemplateItemRepository } from '../modules/passport/infrastructure/in-memory-template-item-repository';
import { PostgresAuditEventWriter, PostgresNotificationEventHook } from '../modules/passport/infrastructure/postgres-audit-notification';
import { PostgresPassportRecordRepository } from '../modules/passport/infrastructure/postgres-passport-record-repository';
import { PostgresTemplateItemRepository } from '../modules/passport/infrastructure/postgres-template-item-repository';
import { VerificationEndpoint } from '../modules/verification-workflow/api/verification.endpoint';
import { VerificationWorkflowService } from '../modules/verification-workflow/application/verification-workflow.service';
import { InMemoryVerificationDecisionRepository } from '../modules/verification-workflow/infrastructure/in-memory-verification-decision-repository';
import { PostgresVerificationDecisionRepository } from '../modules/verification-workflow/infrastructure/postgres-verification-decision-repository';
import type { CurrentUserContext } from '../shared/contracts/authorization';
import type { SqlClient } from '../shared/persistence/sql-client';

class SystemClock {
  nowIso(): string {
    return new Date().toISOString();
  }
}

const DEFAULT_USERS: Array<{ password: string; context: CurrentUserContext }> = [
  {
    password: 'pass',
    context: {
      identity: {
        userId: 'usr_brother',
        email: 'brother@example.org',
        displayName: 'Brother User',
        status: 'ACTIVE',
      },
      roles: [{ roleCode: 'BROTHER', scopeType: 'LODGE', districtId: 'dist_1', lodgeId: 'lodge_1', active: true }],
    },
  },
  {
    password: 'pass',
    context: {
      identity: {
        userId: 'usr_mentor',
        email: 'mentor@example.org',
        displayName: 'Lodge Mentor',
        status: 'ACTIVE',
      },
      roles: [{ roleCode: 'LODGE_MENTOR', scopeType: 'LODGE', districtId: 'dist_1', lodgeId: 'lodge_1', active: true }],
    },
  },
];

export interface AppComposition {
  authSession: AuthSessionEndpoint;
  currentUser: CurrentUserEndpoint;
  passport: PassportRecordEndpoint;
  verification: VerificationEndpoint;
  tokenProvider: SimpleTokenProvider;
  resolveCurrentUserContext(userId: string): Promise<CurrentUserContext | null>;
  listNotifications(input: { actorUserId: string; roleCodes: string[] }): Promise<Array<{
    type: string;
    recordId: string;
    memberProfileId: string;
    lodgeId: string;
    districtId: string;
    reason?: string;
    occurredAt: string;
  }>>;
}

export function composeInMemoryApp(): AppComposition {
  const clock = new SystemClock();

  const identityRepo = new InMemoryIdentityAccessRepository(DEFAULT_USERS);
  const sessionStore = new InMemorySessionStore();
  const tokenProvider = new SimpleTokenProvider();

  const authSessionService = new AuthSessionService(identityRepo, sessionStore, tokenProvider);
  const currentUserService = new CurrentUserService(identityRepo);

  const recordRepo = new InMemoryPassportRecordRepository();
  const templateRepo = new InMemoryTemplateItemRepository({
    ti_1: { templateItemId: 'ti_1', isDistrictCore: true },
  });
  const auditWriter = new InMemoryAuditEventWriter();
  const notificationHook = new InMemoryNotificationEventHook();
  const decisionRepo = new InMemoryVerificationDecisionRepository();

  const passportService = new PassportRecordService(recordRepo, templateRepo, auditWriter, notificationHook, clock);
  const verificationService = new VerificationWorkflowService(recordRepo, decisionRepo, auditWriter, clock, notificationHook);

  return {
    authSession: new AuthSessionEndpoint(authSessionService),
    currentUser: new CurrentUserEndpoint(currentUserService),
    passport: new PassportRecordEndpoint(passportService),
    verification: new VerificationEndpoint(verificationService),
    tokenProvider,
    resolveCurrentUserContext: (userId: string) => identityRepo.getCurrentUserContextByUserId(userId),
    listNotifications: async ({ actorUserId, roleCodes }) =>
      notificationHook.events
        .filter((event) =>
          event.recipientUserId
            ? event.recipientUserId === actorUserId
            : event.recipientRole === 'MENTOR' && roleCodes.some((role) => role === 'PERSONAL_MENTOR' || role === 'LODGE_MENTOR'),
        )
        .slice()
        .reverse(),
  };
}

export function composePostgresApp(sql: SqlClient): AppComposition {
  const clock = new SystemClock();

  const identityRepo = new InMemoryIdentityAccessRepository(DEFAULT_USERS);
  const sessionStore = new InMemorySessionStore();
  const tokenProvider = new SimpleTokenProvider();

  const authSessionService = new AuthSessionService(identityRepo, sessionStore, tokenProvider);
  const currentUserService = new CurrentUserService(identityRepo);

  const recordRepo = new PostgresPassportRecordRepository(sql);
  const templateRepo = new PostgresTemplateItemRepository(sql);
  const auditWriter = new PostgresAuditEventWriter(sql);
  const notificationHook = new PostgresNotificationEventHook();
  const decisionRepo = new PostgresVerificationDecisionRepository(sql);

  const passportService = new PassportRecordService(recordRepo, templateRepo, auditWriter, notificationHook, clock);
  const verificationService = new VerificationWorkflowService(recordRepo, decisionRepo, auditWriter, clock, notificationHook);

  return {
    authSession: new AuthSessionEndpoint(authSessionService),
    currentUser: new CurrentUserEndpoint(currentUserService),
    passport: new PassportRecordEndpoint(passportService),
    verification: new VerificationEndpoint(verificationService),
    tokenProvider,
    resolveCurrentUserContext: (userId: string) => identityRepo.getCurrentUserContextByUserId(userId),
    listNotifications: async () => [],
  };
}
