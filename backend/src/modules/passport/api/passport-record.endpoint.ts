import { PassportRecordService } from '../application/passport-record.service';
import type {
  BrotherPassportSummaryResponse,
  CreateDraftPassportRecordRequest,
  PassportRecordResponse,
  PassportSectionSummaryResponse,
  SubmitPassportRecordRequest,
  UpdateDraftPassportRecordRequest,
} from './contracts';

function toResponse(record: {
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
  status: string;
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
    status: record.status as PassportRecordResponse['status'],
    isOfficialProgress: record.isOfficialProgress,
    currentVersion: record.currentVersion,
    submittedAt: record.submittedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class PassportRecordEndpoint {
  constructor(private readonly service: PassportRecordService) {}

  async createDraft(request: CreateDraftPassportRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.createDraft(request);
    return toResponse(record);
  }

  async updateDraft(request: UpdateDraftPassportRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.updateDraft(request);
    return toResponse(record);
  }

  async submitForVerification(request: SubmitPassportRecordRequest): Promise<PassportRecordResponse> {
    const record = await this.service.submitForVerification(request);
    return toResponse(record);
  }

  async brotherSummary(request: { memberProfileId: string }): Promise<BrotherPassportSummaryResponse> {
    const summary = await this.service.getBrotherSummary(request);
    return {
      memberProfileId: summary.memberProfileId,
      sections: summary.sections.map((section): PassportSectionSummaryResponse => ({
        sectionCode: section.sectionCode,
        sectionName: section.sectionName,
        progressState: section.progressState,
        latestStatus: section.latestStatus,
        lastActivityAt: section.lastActivityAt,
        pendingAction: section.pendingAction,
        latestReviewReason: section.latestReviewReason,
      })),
    };
  }
}
