import { Test, TestingModule } from "@nestjs/testing";
import { DegreeStatus, Role, ScopeType } from "@prisma/client";
import { DegreeProgressService } from "./degree-progress.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

const brotherUser: CurrentUser = {
  id: "user-brother",
  email: "brother@example.com",
  displayName: "Brother",
  roles: [],
};

const lodgeMentorUser: CurrentUser = {
  id: "user-lodge-mentor",
  email: "mentor@example.com",
  displayName: "Lodge Mentor",
  roles: [{ role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-1" }],
};

function createProgress(overrides: {
  status?: DegreeStatus;
  userId?: string;
} = {}) {
  return {
    id: "progress-1",
    brotherProfileId: "brother-1",
    degreeType: "ENTERED_APPRENTICE" as const,
    status: overrides.status ?? DegreeStatus.NOT_STARTED,
    mentorNotes: null,
    submittedAt: null,
    submittedBy: null,
    approvedBy: null,
    approvedAt: null,
    approvalNotes: null,
    reopenedAt: null,
    reopenedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    brotherProfile: {
      id: "brother-1",
      userId: overrides.userId ?? brotherUser.id,
      lodgeId: "lodge-1",
      user: { id: overrides.userId ?? brotherUser.id },
      lodge: { districtId: "district-1" },
    },
  };
}

describe("DegreeProgressService workflow", () => {
  let service: DegreeProgressService;
  let mockPrisma: {
    degreeProgress: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let mockPermissionEvaluator: {
    canReviewBrotherProgress: jest.Mock;
    canApproveDegreeProgress: jest.Mock;
  };

  beforeEach(async () => {
    mockPrisma = {
      degreeProgress: {
        findUnique: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: "progress-new", ...data })),
        update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: "progress-1", ...data })),
        delete: jest.fn().mockResolvedValue({ id: "progress-1" }),
      },
    };

    mockPermissionEvaluator = {
      canReviewBrotherProgress: jest.fn().mockResolvedValue(false),
      canApproveDegreeProgress: jest.fn().mockResolvedValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DegreeProgressService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PermissionEvaluator, useValue: mockPermissionEvaluator },
      ],
    }).compile();

    service = module.get<DegreeProgressService>(DegreeProgressService);
  });

  it("rejects creation in SIGNED_OFF state", async () => {
    await expect(
      service.create(
        { brotherProfileId: "brother-1", degreeType: "ENTERED_APPRENTICE" as const, status: DegreeStatus.SIGNED_OFF },
        brotherUser,
      ),
    ).rejects.toThrow("Cannot create degree progress in a signed-off or ready-for-sign-off state");
  });

  it("allows ordinary update from NOT_STARTED to IN_PROGRESS", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.NOT_STARTED }));

    const result = await service.update(
      "progress-1",
      { status: DegreeStatus.IN_PROGRESS },
      brotherUser,
    );

    expect(result.status).toBe(DegreeStatus.IN_PROGRESS);
  });

  it("rejects ordinary update to SIGNED_OFF", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.IN_PROGRESS }));

    await expect(
      service.update("progress-1", { status: DegreeStatus.SIGNED_OFF }, brotherUser),
    ).rejects.toThrow("Use the approval workflow endpoints");
  });

  it("transitions IN_PROGRESS -> READY_FOR_SIGN_OFF", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.IN_PROGRESS }));

    const result = await service.readyForSignOff("progress-1", brotherUser);

    expect(result.status).toBe(DegreeStatus.READY_FOR_SIGN_OFF);
    expect(result.submittedBy).toBe(brotherUser.id);
  });

  it("transitions READY_FOR_SIGN_OFF -> SIGNED_OFF", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.READY_FOR_SIGN_OFF }));
    mockPermissionEvaluator.canApproveDegreeProgress.mockResolvedValue(true);

    const result = await service.approve("progress-1", { approvalNotes: "Well done" }, lodgeMentorUser);

    expect(result.status).toBe(DegreeStatus.SIGNED_OFF);
    expect(result.approvedBy).toBe(lodgeMentorUser.id);
    expect(result.approvalNotes).toBe("Well done");
  });

  it("blocks Brother self-approval", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.READY_FOR_SIGN_OFF }));

    await expect(service.approve("progress-1", {}, brotherUser)).rejects.toThrow(
      "Brothers cannot approve or reopen their own degree progress",
    );
  });

  it("transitions SIGNED_OFF -> IN_PROGRESS on reopen", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.SIGNED_OFF }));
    mockPermissionEvaluator.canApproveDegreeProgress.mockResolvedValue(true);

    const result = await service.reopen("progress-1", lodgeMentorUser);

    expect(result.status).toBe(DegreeStatus.IN_PROGRESS);
    expect(result.reopenedBy).toBe(lodgeMentorUser.id);
  });

  it("blocks Brother self-reopen", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.SIGNED_OFF }));

    await expect(service.reopen("progress-1", brotherUser)).rejects.toThrow(
      "Brothers cannot approve or reopen their own degree progress",
    );
  });

  it("denies approval without allowed role", async () => {
    mockPrisma.degreeProgress.findUnique.mockResolvedValue(createProgress({ status: DegreeStatus.READY_FOR_SIGN_OFF }));

    await expect(service.approve("progress-1", {}, lodgeMentorUser)).rejects.toThrow(
      "Cannot approve this degree progress",
    );
  });
});
