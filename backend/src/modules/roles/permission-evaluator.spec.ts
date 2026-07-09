import { Test, TestingModule } from "@nestjs/testing";
import { Role, ScopeType } from "@prisma/client";
import { PermissionEvaluator } from "./permission-evaluator.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

const createMockPrisma = (overrides: {
  mentorAssignment?: unknown;
  brotherProfile?: unknown;
  lodge?: unknown;
} = {}) => ({
  mentorAssignment: {
    findFirst: jest.fn().mockResolvedValue(overrides.mentorAssignment ?? null),
  },
  brotherProfile: {
    findUnique: jest.fn().mockResolvedValue(
      overrides.brotherProfile ?? {
        id: "brother-1",
        userId: "user-brother-1",
        lodgeId: "lodge-1",
        user: { id: "user-brother-1" },
        lodge: { districtId: "district-1" },
      },
    ),
  },
  lodge: {
    findUnique: jest.fn().mockResolvedValue(
      overrides.lodge ?? { districtId: "district-1" },
    ),
  },
});

describe("PermissionEvaluator", () => {
  let evaluator: PermissionEvaluator;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    mockPrisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionEvaluator,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    evaluator = module.get<PermissionEvaluator>(PermissionEvaluator);
  });

  function userWithRoles(
    roles: { role: Role; scopeType: ScopeType; scopeId?: string | null }[],
  ): CurrentUser {
    return {
      id: "user-1",
      email: "test@example.com",
      displayName: "Test User",
      roles: roles.map((r) => ({ role: r.role, scopeType: r.scopeType, scopeId: r.scopeId ?? null })),
    };
  }

  describe("canViewBrother", () => {
    it("allows a Brother to view their own profile", async () => {
      const user = userWithRoles([{ role: Role.BROTHER, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.brotherProfile.findUnique.mockResolvedValue({
        id: "brother-1",
        userId: user.id,
        lodgeId: "lodge-1",
        user: { id: user.id },
        lodge: { districtId: "district-1" },
      });

      await expect(evaluator.canViewBrother(user, "brother-1")).resolves.toBe(true);
    });

    it("denies a Brother from viewing another Brother's profile", async () => {
      const user = userWithRoles([{ role: Role.BROTHER, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.brotherProfile.findUnique.mockResolvedValue({
        id: "brother-2",
        userId: "other-user",
        lodgeId: "lodge-1",
        user: { id: "other-user" },
        lodge: { districtId: "district-1" },
      });

      await expect(evaluator.canViewBrother(user, "brother-2")).resolves.toBe(false);
    });

    it("allows a Personal Mentor to view an assigned Brother", async () => {
      const user = userWithRoles([{ role: Role.PERSONAL_MENTOR, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue({ id: "assignment-1" });

      await expect(evaluator.canViewBrother(user, "brother-1")).resolves.toBe(true);
    });

    it("denies a Personal Mentor from viewing an unassigned Brother", async () => {
      const user = userWithRoles([{ role: Role.PERSONAL_MENTOR, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue(null);

      await expect(evaluator.canViewBrother(user, "brother-1")).resolves.toBe(false);
    });

    it("allows a Lodge Mentor to view Brothers in their own Lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-1" },
      ]);

      await expect(evaluator.canViewBrother(user, "brother-1")).resolves.toBe(true);
    });

    it("denies a Lodge Mentor from viewing Brothers in another Lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-2" },
      ]);

      await expect(evaluator.canViewBrother(user, "brother-1")).resolves.toBe(false);
    });

    it("allows District roles only inside their assigned District", async () => {
      const districtAdmin = userWithRoles([
        { role: Role.DISTRICT_ADMIN, scopeType: ScopeType.DISTRICT, scopeId: "district-1" },
      ]);
      const districtMentor = userWithRoles([
        { role: Role.DISTRICT_MENTOR, scopeType: ScopeType.DISTRICT, scopeId: "district-1" },
      ]);
      await expect(evaluator.canViewBrother(districtAdmin, "brother-1")).resolves.toBe(true);
      await expect(evaluator.canViewBrother(districtMentor, "brother-1")).resolves.toBe(true);

      const otherDistrict = userWithRoles([
        { role: Role.DISTRICT_MENTOR, scopeType: ScopeType.DISTRICT, scopeId: "district-2" },
      ]);
      await expect(evaluator.canViewBrother(otherDistrict, "brother-1")).resolves.toBe(false);
    });
  });

  describe("canReviewBrotherProgress", () => {
    it("allows a Personal Mentor to review their assigned Brother", async () => {
      const user = userWithRoles([{ role: Role.PERSONAL_MENTOR, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue({ id: "assignment-1" });

      await expect(evaluator.canReviewBrotherProgress(user, "brother-1")).resolves.toBe(true);
    });

    it("denies a Personal Mentor from reviewing an unassigned Brother", async () => {
      const user = userWithRoles([{ role: Role.PERSONAL_MENTOR, scopeType: ScopeType.GLOBAL }]);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue(null);

      await expect(evaluator.canReviewBrotherProgress(user, "brother-1")).resolves.toBe(false);
    });

    it("allows a Lodge Mentor to review Brothers in their own Lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-1" },
      ]);

      await expect(evaluator.canReviewBrotherProgress(user, "brother-1")).resolves.toBe(true);
    });

    it("denies a Lodge Mentor from reviewing Brothers in another Lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-2" },
      ]);

      await expect(evaluator.canReviewBrotherProgress(user, "brother-1")).resolves.toBe(false);
    });

    it("denies System Admin from reviewing", async () => {
      const user = userWithRoles([{ role: Role.SYSTEM_ADMIN, scopeType: ScopeType.GLOBAL }]);

      await expect(evaluator.canReviewBrotherProgress(user, "brother-1")).resolves.toBe(false);
    });
  });

  describe("canAssignMentor", () => {
    it("allows District Admin to assign mentors in its District", async () => {
      const user = userWithRoles([
        { role: Role.DISTRICT_ADMIN, scopeType: ScopeType.DISTRICT, scopeId: "district-1" },
      ]);

      await expect(evaluator.canAssignMentor(user, "lodge-1")).resolves.toBe(true);
    });

    it("allows Lodge Mentor to assign mentors in own lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-1" },
      ]);

      await expect(evaluator.canAssignMentor(user, "lodge-1")).resolves.toBe(true);
    });

    it("denies Lodge Mentor from assigning mentors in another lodge", async () => {
      const user = userWithRoles([
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-2" },
      ]);

      await expect(evaluator.canAssignMentor(user, "lodge-1")).resolves.toBe(false);
    });
  });
});
