import { PassportRecordEndpoint } from '../modules/passport/api/passport-record.endpoint';
import { PassportRecordService } from '../modules/passport/application/passport-record.service';
import { InMemoryAuditEventWriter, InMemoryNotificationEventHook } from '../modules/passport/infrastructure/in-memory-audit-notification';
import { InMemoryPassportRecordRepository } from '../modules/passport/infrastructure/in-memory-passport-record-repository';
import { InMemoryTemplateItemRepository } from '../modules/passport/infrastructure/in-memory-template-item-repository';
import { VerificationEndpoint } from '../modules/verification-workflow/api/verification.endpoint';
import { VerificationWorkflowService } from '../modules/verification-workflow/application/verification-workflow.service';
import { InMemoryVerificationDecisionRepository } from '../modules/verification-workflow/infrastructure/in-memory-verification-decision-repository';
import { PostgresPassportRecordRepository } from '../modules/passport/infrastructure/postgres-passport-record-repository';
import { PostgresVerificationDecisionRepository } from '../modules/verification-workflow/infrastructure/postgres-verification-decision-repository';
import type { SqlClient } from '../shared/persistence/sql-client';

class SystemClock {
  nowIso(): string {
    return new Date().toISOString();
  }
}

export interface AppComposition {
  passport: PassportRecordEndpoint;
  verification: VerificationEndpoint;
}

export function composeInMemoryApp(): AppComposition {
  const clock = new SystemClock();
  const recordRepo = new InMemoryPassportRecordRepository();
  const templateRepo = new InMemoryTemplateItemRepository();
  const auditWriter = new InMemoryAuditEventWriter();
  const notificationHook = new InMemoryNotificationEventHook();
  const decisionRepo = new InMemoryVerificationDecisionRepository();

  const passportService = new PassportRecordService(recordRepo, templateRepo, auditWriter, notificationHook, clock);
  const verificationService = new VerificationWorkflowService(recordRepo, decisionRepo, auditWriter, clock);

  return {
    passport: new PassportRecordEndpoint(passportService),
    verification: new VerificationEndpoint(verificationService),
  };
}

export function composePostgresApp(sql: SqlClient): AppComposition {
  const clock = new SystemClock();
  const recordRepo = new PostgresPassportRecordRepository(sql);
  const templateRepo = new InMemoryTemplateItemRepository();
  const auditWriter = new InMemoryAuditEventWriter();
  const notificationHook = new InMemoryNotificationEventHook();
  const decisionRepo = new PostgresVerificationDecisionRepository(sql);

  const passportService = new PassportRecordService(recordRepo, templateRepo, auditWriter, notificationHook, clock);
  const verificationService = new VerificationWorkflowService(recordRepo, decisionRepo, auditWriter, clock);

  return {
    passport: new PassportRecordEndpoint(passportService),
    verification: new VerificationEndpoint(verificationService),
  };
}
