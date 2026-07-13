import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import request from "supertest";
import { DegreeStatus, DegreeType } from "@prisma/client";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma/prisma.service";
import {
  createTestFixtures,
  createDegreeProgress,
} from "./integration-helpers";

const dbAvailable = process.env.DB_AVAILABLE === "true";

interface MeResponse {
  id: string;
  displayName: string;
  email: string;
  brotherProfileId: string;
}

interface BrotherProfileResponse {
  id: string;
}

interface DegreeProgressResponse {
  id: string;
  status: string;
  approvalNotes?: string | null;
}

interface PassportExportResponse {
  brotherProfile: { id: string };
  generatedAt: string;
  degreeProgress: unknown[];
}

(dbAvailable ? describe : describe.skip)("Passport MVP smoke tests (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1", { exclude: ["health/live", "health/ready"] });
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe("with a Brother and Lodge Mentor", () => {
    let fixtures: Awaited<ReturnType<typeof createTestFixtures>>;

    beforeEach(async () => {
      fixtures = await createTestFixtures(prisma);
      await prisma.passportTemplate.create({
        data: {
          version: "smoke-test",
          activeFrom: new Date(),
          active: true,
        },
      });
    });

    it("GET /health/live is public and returns 200", () => {
      return request(app.getHttpServer() as Server)
        .get("/health/live")
        .expect(200);
    });

    it("GET /api/v1/me returns the authenticated Brother profile", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get("/api/v1/me")
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200);

      const body = response.body as MeResponse;
      expect(body).toMatchObject({
        id: fixtures.brotherUserId,
        displayName: "Test Brother",
        email: "brother@example.local",
      });
      expect(body.brotherProfileId).toBe(fixtures.brotherProfileId);
    });

    it("GET /api/v1/me/passport returns the Brother's passport", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get("/api/v1/me/passport")
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200);

      expect(response.body).toHaveProperty("profile");
      expect(response.body).toHaveProperty("template");
      expect(response.body).toHaveProperty("progress");
      expect(response.body).toHaveProperty("signoffs");
    });

    it("GET /api/v1/brothers/:id returns the Brother profile", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/api/v1/brothers/${fixtures.brotherProfileId}`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200);

      expect((response.body as BrotherProfileResponse).id).toBe(fixtures.brotherProfileId);
    });

    it("POST /api/v1/degree-progress creates and GET returns progress", async () => {
      const createResponse = await request(app.getHttpServer() as Server)
        .post("/api/v1/degree-progress")
        .set("x-dev-auth-firebase-uid", "test-brother")
        .send({
          brotherProfileId: fixtures.brotherProfileId,
          degreeType: DegreeType.ENTERED_APPRENTICE,
          status: DegreeStatus.NOT_STARTED,
        })
        .expect(201);

      const createdBody = createResponse.body as DegreeProgressResponse;
      const progressId = createdBody.id;
      expect(progressId).toBeDefined();
      expect(createdBody.status).toBe(DegreeStatus.NOT_STARTED);

      await request(app.getHttpServer() as Server)
        .get(`/api/v1/degree-progress/${progressId}`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200);
    });

    it("runs the degree progress approval workflow end-to-end", async () => {
      const progress = await createDegreeProgress(
        prisma,
        fixtures.brotherProfileId,
        DegreeType.ENTERED_APPRENTICE,
        DegreeStatus.NOT_STARTED,
      );

      // Brother advances to IN_PROGRESS
      await request(app.getHttpServer() as Server)
        .patch(`/api/v1/degree-progress/${progress.id}`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .send({ status: DegreeStatus.IN_PROGRESS })
        .expect(200);

      // Brother submits for sign-off
      await request(app.getHttpServer() as Server)
        .patch(`/api/v1/degree-progress/${progress.id}/ready-for-sign-off`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .send({})
        .expect(200);

      // Lodge mentor approves
      const approveResponse = await request(app.getHttpServer() as Server)
        .patch(`/api/v1/degree-progress/${progress.id}/approve`)
        .set("x-dev-auth-firebase-uid", "test-lodge-mentor")
        .send({ approvalNotes: "Approved in smoke test" })
        .expect(200);

      const approvedBody = approveResponse.body as DegreeProgressResponse;
      expect(approvedBody.status).toBe(DegreeStatus.SIGNED_OFF);
      expect(approvedBody.approvalNotes).toBe("Approved in smoke test");
    });

    it("GET /api/v1/exports/passport/:id returns JSON export", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/api/v1/exports/passport/${fixtures.brotherProfileId}`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200);

      const exportBody = response.body as PassportExportResponse;
      expect(exportBody).toMatchObject({
        brotherProfile: {
          id: fixtures.brotherProfileId,
        },
      });
      expect(exportBody).toHaveProperty("generatedAt");
      expect(Array.isArray(exportBody.degreeProgress)).toBe(true);
    });

    it("GET /api/v1/exports/passport/:id/printable returns HTML", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/api/v1/exports/passport/${fixtures.brotherProfileId}/printable`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200)
        .expect("Content-Type", /text\/html/);

      expect(response.text).toContain("DGLEA Masonic Passport");
    });

    it("GET /api/v1/exports/passport/:id/pdf returns a PDF", async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/api/v1/exports/passport/${fixtures.brotherProfileId}/pdf`)
        .set("x-dev-auth-firebase-uid", "test-brother")
        .expect(200)
        .expect("Content-Type", /application\/pdf/);

      const pdfBuffer = response.body as Buffer;
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.toString("binary", 0, 4)).toBe("%PDF");
    });
  });
});
