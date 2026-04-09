import type { PassportRecordResponse } from '../../passport/api/contracts';
import type {
  ClarificationRequest,
  OverrideRecordRequest,
  PendingQueueRequest,
  RejectRecordRequest,
  VerifyRecordRequest,
} from './contracts';
import { VerificationWorkflowService } from '../application/verification-workflow.service';

function toPassportRecordResponse(record: {
  id: string;
  memberProfileId: string;
  districtId: string;
  lodgeId: string;
  sectionTemplateId: string;
  templateItem: { templateItemId: string; isDistrictCore: boolean; lodgeId?: string };
  note?: string;
  eventDate?: string;
  reviewReason?: string;
  supersedesRecordId?: string;
  status: PassportRecordResponse['status'];
  isOfficialProgress: boolean;
  currentVersion: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}): PassportRecordResponse {
  return {
    id: record.id,
    memberProfileId: record.memberProfileId,
    districtId: record.districtId,
    lodgeId: record.lodgeId,
    sectionTemplateId: record.sectionTemplateId,
    templateItemId: record.templateItem.templateItemId,
    templateIsDistrictCore: record.templateItem.isDistrictCore,
    templateLodgeId: record.templateItem.lodgeId,
    note: record.note,
    eventDate: record.eventDate,
    reviewReason: record.reviewReason,
    supersedesRecordId: record.supersedesRecordId,
    status: record.status,
    isOfficialProgress: record.isOfficialProgress,
    currentVersion: record.currentVersion,
    submittedAt: record.submittedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class VerificationEndpoint {
  constructor(private readonly service: VerificationWorkflowService) {}

  async verify(request: VerifyRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.verify(request);
    return toPassportRecordResponse(record);
  }

  async reject(request: RejectRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.reject(request);
    return toPassportRecordResponse(record);
  }

  async requestClarification(request: ClarificationRequest): Promise<PassportRecordResponse> {
    const record = await this.service.requestClarification(request);
    return toPassportRecordResponse(record);
  }

  async override(request: OverrideRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.override(request);
    return toPassportRecordResponse(record);
  }

  async pendingQueue(request: PendingQueueRequest): Promise<PassportRecordResponse[]> {
    const records = await this.service.getPendingQueue(request);
    return records.map((record) => toPassportRecordResponse(record));
  }
}
