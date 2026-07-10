export interface PassportExportDegreeProgressDto {
  id: string;
  degreeType: string;
  status: string;
  mentorNotes: string | null;
  submittedAt: string | null;
  submittedBy: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  approvalNotes: string | null;
  reopenedAt: string | null;
  reopenedBy: string | null;
}

export interface PassportExportLodgeDto {
  id: string;
  lodgeName: string;
  lodgeNumber: string;
  district: string | null;
  meetingLocation: string | null;
  secretaryContact: string | null;
}

export interface PassportExportBrotherDto {
  id: string;
  fullName: string | null;
  preferredName: string | null;
  email: string | null;
  phone: string | null;
  currentStage: string;
  dateInitiated: string | null;
  datePassed: string | null;
  dateRaised: string | null;
  solomonRegisteredOn: string | null;
  userDisplayName: string;
  userEmail: string;
  lodgeName: string;
  lodgeNumber: string;
}

export interface PassportExportDto {
  generatedAt: string;
  brotherProfile: PassportExportBrotherDto;
  lodgeProfile: PassportExportLodgeDto | null;
  degreeProgress: PassportExportDegreeProgressDto[];
}
