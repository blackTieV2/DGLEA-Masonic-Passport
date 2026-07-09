import { Test, TestingModule } from "@nestjs/testing";
import { ReferenceSection } from "@prisma/client";
import { ReferencePagesService } from "./reference-pages.service";
import { PrismaService } from "../../common/prisma/prisma.service";

describe("ReferencePagesService", () => {
  let service: ReferencePagesService;
  let mockPrisma: {
    staticReferencePage: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockPrisma = {
      staticReferencePage: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencePagesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReferencePagesService>(ReferencePagesService);
  });

  it("lists active reference pages", async () => {
    await service.findAll();

    expect(mockPrisma.staticReferencePage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true },
        orderBy: [{ section: "asc" }, { orderIndex: "asc" }],
      }),
    );
  });

  it("filters by valid section", async () => {
    await service.findAll(ReferenceSection.INTRODUCTION);

    expect(mockPrisma.staticReferencePage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true, section: ReferenceSection.INTRODUCTION },
      }),
    );
  });

  it("rejects invalid section filter", async () => {
    await expect(service.findAll("NOT_A_SECTION")).rejects.toThrow(
      "Invalid reference section",
    );
  });

  it("returns a page by slug", async () => {
    mockPrisma.staticReferencePage.findUnique.mockResolvedValue({
      slug: "introduction",
      title: "Introduction",
    });

    const result = await service.findBySlug("introduction");

    expect(result.title).toBe("Introduction");
  });

  it("throws when slug is not found", async () => {
    await expect(service.findBySlug("missing")).rejects.toThrow(
      "Reference page not found",
    );
  });
});
