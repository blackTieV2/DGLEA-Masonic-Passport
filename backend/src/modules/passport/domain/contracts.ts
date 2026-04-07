import { InvalidStateTransitionError } from '../../../shared/utilities/errors';

export type PassportRecordStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEEDS_CLARIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'OVERRIDDEN'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export interface TemplateItemReference {
  templateItemId: string;
  isDistrictCore: boolean;
  lodgeId?: string;
}

export interface PassportRecord {
  id: string;
  memberProfileId: string;
  districtId: string;
  lodgeId: string;
  sectionTemplateId: string;
  templateItem: TemplateItemReference;
  note?: string;
  eventDate?: string;
  reviewReason?: string;
  supersedesRecordId?: string;
  status: PassportRecordStatus;
  currentVersion: number;
  isOfficialProgress: boolean;
  createdByUserId: string;
  submittedAt?: string;
  updatedAt: string;
  createdAt: string;
}

export function assertTemplateScopeIntegrity(templateItem: TemplateItemReference): void {
  if (templateItem.isDistrictCore && templateItem.lodgeId) {
    throw new Error('District core template item cannot have lodgeId.');
  }
  if (!templateItem.isDistrictCore && !templateItem.lodgeId) {
    throw new Error('Lodge supplement template item must include lodgeId.');
  }
}

export function createDraftRecord(input: {
  id: string;
  memberProfileId: string;
  districtId: string;
  lodgeId: string;
  sectionTemplateId: string;
  templateItem: TemplateItemReference;
  note?: string;
  eventDate?: string;
  actorUserId: string;
  nowIso: string;
}): PassportRecord {
  assertTemplateScopeIntegrity(input.templateItem);

  return {
    id: input.id,
    memberProfileId: input.memberProfileId,
    districtId: input.districtId,
    lodgeId: input.lodgeId,
    sectionTemplateId: input.sectionTemplateId,
    templateItem: input.templateItem,
    note: input.note,
    eventDate: input.eventDate,
    status: 'DRAFT',
    currentVersion: 1,
    isOfficialProgress: false,
    createdByUserId: input.actorUserId,
    updatedAt: input.nowIso,
    createdAt: input.nowIso,
  };
}

export function updateDraftRecord(record: PassportRecord, input: { note?: string; eventDate?: string; nowIso: string }): PassportRecord {
  if (record.status !== 'DRAFT') {
    throw new InvalidStateTransitionError('Only DRAFT records can be updated via draft update path.');
  }

  return {
    ...record,
    note: input.note ?? record.note,
    eventDate: input.eventDate ?? record.eventDate,
    currentVersion: record.currentVersion + 1,
    updatedAt: input.nowIso,
  };
}

export function submitRecordForVerification(record: PassportRecord, nowIso: string): PassportRecord {
  if (record.status !== 'DRAFT' && record.status !== 'NEEDS_CLARIFICATION') {
    throw new InvalidStateTransitionError('Only DRAFT or NEEDS_CLARIFICATION records can be submitted.');
  }

  return {
    ...record,
    status: 'SUBMITTED',
    reviewReason: undefined,
    submittedAt: nowIso,
    isOfficialProgress: false,
    updatedAt: nowIso,
  };
}
