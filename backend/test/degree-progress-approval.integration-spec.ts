import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { DegreeStatus, DegreeType, Role, ScopeType } from "@prisma/client";
import { AppModule } from "../src/app.module";
import { DegreeProgressService } from "../src/modules/degree-progress/degree-progress.service";
import { PrismaService } from "../src/common/prisma/prisma.service";
import {
  asUser,
  createDegreeProgress,
  createTestFixtures,
} from "./integration-helpers";

const describeIfDb = process.env.DB_AVAILABLE === "true" ? describe : describe.skip;

describeIfDb("DegreeProgressService approval workflow (integration)", () => {
  let moduleRef: TestingModule;
  let service: DegreeProgressService;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get<DegreeProgressService>(DegreeProgressService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (moduleRef) await moduleRef.close();
  });

  describe("happy path", () => {
    it("creates a degree progress and advances it through ready-for-sign-off to signed-off", async () => {
      const fixtures = await createTestFixtures(prisma);
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.IN_PROGRESS,
      );

      const brother = asUser(fixtures.brotherUserId, [
        { role: Role.BROTHER, scopeType: ScopeType.GLOBAL, scopeId: null },
      ]);

      await service.readyForSignOff(progress.id, brother);
      const ready = await prisma.degreeProgress.findUnique({ where: { id: progress.id } });
      expect(ready?.status).toBe(DegreeStatus.READY_FOR_SIGN_OFF);

      const lodgeMentor = asUser(fixtures.lodgeMentorUserId, [
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: fixtures.lodgeId },
      ]);

      await service.approve(progress.id, { approvalNotes: "Approved in integration test" }, lodgeMentor);
      const signedOff = await prisma.degreeProgress.findUnique({ where: { id: progress.id } });
      expect(signedOff?.status).toBe(DegreeStatus.SIGNED_OFF);
      expect(signedOff?.approvalNotes).toBe("Approved in integration test");
      expect(signedOff?.approvedBy).toBe(fixtures.lodgeMentorUserId);
    });
  });

  describe("guardrails", () => {
    it("prevents an ordinary update from setting status to SIGNED_OFF", async () => {
      const fixtures = await createTestFixtures(prisma);
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.IN_PROGRESS,
      );

      const brother = asUser(fixtures.brotherUserId, [
        { role: Role.BROTHER, scopeType: ScopeType.GLOBAL, scopeId: null },
      ]);

      await expect(service.update(progress.id, { status: DegreeStatus.SIGNED_OFF }, brother)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("prevents a Brother from approving their own progress", async () => {
      const fixtures = await createTestFixtures(prisma);
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.READY_FOR_SIGN_OFF,
      );

      const brother = asUser(fixtures.brotherUserId, [
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: fixtures.lodgeId },
      ]);

      await expect(service.approve(progress.id, {}, brother)).rejects.toThrow(ForbiddenException);
    });

    it("prevents approval when the progress is not ready for sign-off", async () => {
      const fixtures = await createTestFixtures(prisma);
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.IN_PROGRESS,
      );

      const lodgeMentor = asUser(fixtures.lodgeMentorUserId, [
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: fixtures.lodgeId },
      ]);

      await expect(service.approve(progress.id, {}, lodgeMentor)).rejects.toThrow(BadRequestException);
    });

    it("allows a permitted mentor to reopen a signed-off progress", async () => {
      const fixtures = await createTestFixtures(prisma);
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.SIGNED_OFF,
      );

      const lodgeMentor = asUser(fixtures.lodgeMentorUserId, [
        { role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: fixtures.lodgeId },
      ]);

      await service.reopen(progress.id, lodgeMentor);
      const reopened = await prisma.degreeProgress.findUnique({ where: { id: progress.id } });
      expect(reopened?.status).toBe(DegreeStatus.IN_PROGRESS);
      expect(reopened?.reopenedBy).toBe(fixtures.lodgeMentorUserId);
    });
  });
});
