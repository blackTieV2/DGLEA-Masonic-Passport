import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma/prisma.service";

describe("BrothersController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        user: { findUnique: jest.fn() },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1", { exclude: ["health/live", "health/ready"] });
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it("GET /health/live is public", () => {
    return request(app.getHttpServer() as Server).get("/health/live").expect(200);
  });

  it("GET /api/v1/me requires authentication", () => {
    return request(app.getHttpServer() as Server).get("/api/v1/me").expect(401);
  });
});
