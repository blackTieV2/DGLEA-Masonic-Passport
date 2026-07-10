import { Test, TestingModule } from "@nestjs/testing";
import { ProgressStatus, AuditAction } from "@prisma/client";
import { ProgressService } from "./progress.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

const brotherUser: CurrentUser = {
  id: "user-brother",
  email: "brother@example.com",
  displayName: "Brother",
  roles: [],
};

const mentorUser: CurrentUser = {
  id: "user-mentor",
  email: "mentor@example.com",
  displayName: "Mentor",
  roles: [],
};

function createProgress(overrides: {
  status?: ProgressStatus;
  userId?: string;
} = {}) {
  return {
    id: "progress-1",
    brotherProfileId: "brother-1",
    status: overrides.status ?? ProgressStatus.NOT_STARTED,
    draftNote: null,
    submittedAt: null,
    completedAt: null,
    version: 0,
    brotherProfile: {
      id: "brother-1",
      userId: overrides.userId ?? brotherUser.id,
      user: { id: overrides.userId ?? brotherUser.id },
    },
    milestoneTemplate: { id: "milestone-1", title: "Test milestone" },
  };
}

describe("ProgressService lifecycle", () => {
  let service: ProgressService;
  let mockPrisma: {
    passportProgress: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      findUniqueOrThrow: jest.Mock;
    };
    mentorAssignment: { findMany: jest.Mock };
    $transaction: jest.Mock;
  };
  let mockPermissionEvaluator: {
    canReviewBrotherProgress: jest.Mock;
  };
  let mockAudit: { record: jest.Mock };
  let mockNotifications: { create: jest.Mock };

  beforeEach(async () => {
    mockPrisma = {
      passportProgress: {
        findUnique: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUniqueOrThrow: jest.fn(),
      },
      mentorAssignment: { findMany: jest.fn().mockResolvedValue([]) },
      $transaction: jest.fn((callback: (tx: unknown) => unknown) => callback(mockPrisma)),
    };

    mockPermissionEvaluator = {
      canReviewBrotherProgress: jest.fn().mockResolvedValue(false),
    };

    mockAudit = { record: jest.fn().mockResolvedValue(undefined) };
    mockNotifications = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PermissionEvaluator, useValue: mockPermissionEvaluator },
        { provide: AuditService, useValue: mockAudit },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  it("transitions NOT_STARTED -> DRAFT", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress({ status: ProgressStatus.NOT_STARTED }));
    mockPrisma.passportProgress.findUniqueOrThrow.mockResolvedValue({ status: ProgressStatus.DRAFT });

    const result = await service.updateDraft(brotherUser, "progress-1", "My draft note");

    expect(result).toEqual({ status: ProgressStatus.DRAFT });
    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.UPDATE }),
      expect.anything(),
    );
  });

  it("transitions DRAFT -> SUBMITTED", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress({ status: ProgressStatus.DRAFT }));
    mockPrisma.passportProgress.findUniqueOrThrow.mockResolvedValue({ status: ProgressStatus.SUBMITTED });

    const result = await service.submit(brotherUser, "progress-1");

    expect(result).toEqual({ status: ProgressStatus.SUBMITTED });
    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.SUBMIT }),
      expect.anything(),
    );
  });

  it("does not submit from NOT_STARTED", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress({ status: ProgressStatus.NOT_STARTED }));

    await expect(service.submit(brotherUser, "progress-1")).rejects.toThrow("Cannot submit from status NOT_STARTED");
  });

  it("allows mentor to update draft on behalf of Brother", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress({ status: ProgressStatus.NOT_STARTED, userId: brotherUser.id }));
    mockPermissionEvaluator.canReviewBrotherProgress.mockResolvedValue(true);
    mockPrisma.passportProgress.findUniqueOrThrow.mockResolvedValue({ status: ProgressStatus.DRAFT });

    const result = await service.updateDraft(mentorUser, "progress-1", "Mentor note");

    expect(result).toEqual({ status: ProgressStatus.DRAFT });
  });

  it("denies Brother from updating another Brother's progress", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress({ status: ProgressStatus.NOT_STARTED, userId: "other-user" }));

    await expect(service.updateDraft(brotherUser, "progress-1")).rejects.toThrow("Cannot edit this progress item");
  });
});
