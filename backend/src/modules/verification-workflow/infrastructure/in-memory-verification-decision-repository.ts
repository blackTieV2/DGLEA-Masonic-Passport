import type { VerificationDecisionRepository } from '../application/ports';
import type { PassportRecord } from '../../passport/domain/contracts';
import type { RoleCode } from '../../../shared/contracts/authorization';

export interface InMemoryVerificationDecision {
  decisionType: 'VERIFIED' | 'REJECTED' | 'REQUESTED_CLARIFICATION' | 'OVERRIDDEN';
  passportRecordId: string;
  priorStatus: PassportRecord['status'];
  newStatus: PassportRecord['status'];
  decisionReason?: string;
  actorUserId: string;
  actorRoleCode: RoleCode;
  actedAt: string;
}

export class InMemoryVerificationDecisionRepository implements VerificationDecisionRepository {
  public readonly items: InMemoryVerificationDecision[] = [];

  async append(decision: InMemoryVerificationDecision): Promise<void> {
    this.items.push(decision);
  }
}
