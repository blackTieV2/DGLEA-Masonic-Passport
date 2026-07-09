/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { ProgressStatus, ReviewDecision, AuditAction, NotificationType } from "@prisma/client";
import { ReviewsService } from "./reviews.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

const reviewer: CurrentUser = {
  id: "user-reviewer",
  email: "reviewer@example.com",
  displayName: "Reviewer",
  roles: [],
};

function createProgress(overrides: { status?: ProgressStatus } = {}) {
  return {
    id: "progress-1",
    brotherProfileId: "brother-1",
    status: overrides.status ?? ProgressStatus.SUBMITTED,
    version: 0,
    completedAt: null,
    brotherProfile: {
      id: "brother-1",
      userId: "user-brother",
      user: { id: "user-brother" },
    },
    milestoneTemplate: { id: "milestone-1", title: "Test milestone" },
  };
}

describe("ReviewsService", () => {
  let service: ReviewsService;
  let mockPrisma: {
    passportProgress: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      findUniqueOrThrow: jest.Mock;
    };
    review: { create: jest.Mock };
    brotherProfile: { findMany: jest.Mock };
    mentorAssignment: { findMany: jest.Mock };
    $transaction: jest.Mock;
  };
  let mockPermissionEvaluator: { canReviewBrotherProgress: jest.Mock };
  let mockAudit: { record: jest.Mock };
  let mockNotifications: { create: jest.Mock };

  beforeEach(async () => {
    mockPrisma = {
      passportProgress: {
        findUnique: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ status: ProgressStatus.VERIFIED }),
      },
      review: { create: jest.fn() },
      brotherProfile: { findMany: jest.fn().mockResolvedValue([]) },
      mentorAssignment: { findMany: jest.fn().mockResolvedValue([]) },
      $transaction: jest.fn((callback: (tx: unknown) => unknown) => callback(mockPrisma)),
    };

    mockPermissionEvaluator = { canReviewBrotherProgress: jest.fn().mockResolvedValue(true) };
    mockAudit = { record: jest.fn().mockResolvedValue(undefined) };
    mockNotifications = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PermissionEvaluator, useValue: mockPermissionEvaluator },
        { provide: AuditService, useValue: mockAudit },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it("verifies a submitted item", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress());

    await service.review(reviewer, "progress-1", ReviewDecision.VERIFY);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(mockPrisma.review.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ decision: ReviewDecision.VERIFY }) }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(mockPrisma.passportProgress.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: ProgressStatus.VERIFIED }) }),
    );
    expect(mockAudit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.REVIEW }),
      expect.anything(),
    );
    expect(mockNotifications.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: NotificationType.ITEM_VERIFIED }),
      expect.anything(),
    );
  });

  it("requires a reason for reject", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress());

    await expect(service.review(reviewer, "progress-1", ReviewDecision.REJECT)).rejects.toThrow(
      "Reason is required for reject or clarification",
    );
  });

  it("requires a reason for clarification request", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(createProgress());

    await expect(
      service.review(reviewer, "progress-1", ReviewDecision.REQUEST_CLARIFICATION),
    ).rejects.toThrow("Reason is required for reject or clarification");
  });

  it("rejects review on non-submitted progress", async () => {
    mockPrisma.passportProgress.findUnique.mockResolvedValue(
      createProgress({ status: ProgressStatus.DRAFT }),
    );

    await expect(service.review(reviewer, "progress-1", ReviewDecision.VERIFY)).rejects.toThrow(
      "Progress item is not submitted for review",
    );
  });
});
