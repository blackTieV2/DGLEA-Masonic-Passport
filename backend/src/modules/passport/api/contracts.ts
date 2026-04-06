import type { PassportRecordStatus } from '../domain/contracts';

export interface CreateDraftPassportRecordRequest {
  memberProfileId: string;
  districtId: string;
  lodgeId: string;
  sectionTemplateId: string;
  templateItemId: string;
  note?: string;
  eventDate?: string;
  actorUserId: string;
}

export interface UpdateDraftPassportRecordRequest {
  recordId: string;
  note?: string;
  eventDate?: string;
  actorUserId: string;
}

export interface SubmitPassportRecordRequest {
  recordId: string;
  actorUserId: string;
}

export interface PassportRecordResponse {
  id: string;
  memberProfileId: string;
  districtId: string;
  lodgeId: string;
  sectionTemplateId: string;
  templateItemId: string;
  templateIsDistrictCore: boolean;
  templateLodgeId?: string;
  note?: string;
  eventDate?: string;
  status: PassportRecordStatus;
  isOfficialProgress: boolean;
  currentVersion: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
