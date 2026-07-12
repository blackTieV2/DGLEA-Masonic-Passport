import { Test, TestingModule } from "@nestjs/testing";
import { Role, ScopeType } from "@prisma/client";
import { ExportsService } from "./exports.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

const actor: CurrentUser = {
  id: "user-1",
  email: "viewer@example.com",
  displayName: "Viewer",
  roles: [{ role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: "lodge-1" }],
};

describe("ExportsService", () => {
  let service: ExportsService;
  let mockPrisma: {
    brotherProfile: { findUnique: jest.Mock };
    lodgeProfile: { findUnique: jest.Mock };
  };
  let mockPermissionEvaluator: {
    canViewBrother: jest.Mock;
  };

  beforeEach(async () => {
    mockPrisma = {
      brotherProfile: { findUnique: jest.fn() },
      lodgeProfile: { findUnique: jest.fn() },
    };

    mockPermissionEvaluator = {
      canViewBrother: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PermissionEvaluator, useValue: mockPermissionEvaluator },
      ],
    }).compile();

    service = module.get<ExportsService>(ExportsService);
  });

  it("aggregates a passport export", async () => {
    mockPrisma.brotherProfile.findUnique.mockResolvedValue({
      id: "brother-1",
      fullName: "John Doe",
      preferredName: "John",
      email: "john@example.com",
      phone: "+123",
      currentStage: "ENTERED_APPRENTICE",
      dateInitiated: new Date("2025-01-15"),
      datePassed: null,
      dateRaised: null,
      solomonRegisteredOn: null,
      user: { displayName: "John Doe", email: "john@example.com" },
      lodge: { lodgeName: "Singapore Lodge", lodgeNumber: "L-001" },
      degreeProgress: [
        {
          id: "dp-1",
          degreeType: "ENTERED_APPRENTICE",
          status: "IN_PROGRESS",
          mentorNotes: "Doing well.",
          submittedAt: null,
          submittedBy: null,
          approvedAt: null,
          approvedBy: null,
          approvalNotes: null,
          reopenedAt: null,
          reopenedBy: null,
        },
      ],
    });
    mockPrisma.lodgeProfile.findUnique.mockResolvedValue({
      id: "lodge-profile-1",
      lodgeName: "Singapore Lodge",
      lodgeNumber: "L-001",
      district: "District Grand Lodge of the Eastern Archipelago",
      meetingLocation: "Singapore",
      secretaryContact: "secretary@example.local",
    });

    const result = await service.exportPassport(actor, "brother-1");

    expect(result.brotherProfile.fullName).toBe("John Doe");
    expect(result.lodgeProfile).not.toBeNull();
    expect(result.degreeProgress).toHaveLength(1);
    expect(result.degreeProgress[0].status).toBe("IN_PROGRESS");
    expect(result.generatedAt).toBeDefined();
  });

  it("denies export when the actor cannot view the Brother", async () => {
    mockPermissionEvaluator.canViewBrother.mockResolvedValue(false);

    await expect(service.exportPassport(actor, "brother-1")).rejects.toThrow(
      "Cannot export this passport",
    );
  });

  it("renders printable HTML", async () => {
    mockPrisma.brotherProfile.findUnique.mockResolvedValue({
      id: "brother-1",
      fullName: "John Doe",
      preferredName: null,
      email: null,
      phone: null,
      currentStage: "ENTERED_APPRENTICE",
      dateInitiated: null,
      datePassed: null,
      dateRaised: null,
      solomonRegisteredOn: null,
      user: { displayName: "John Doe", email: "john@example.com" },
      lodge: { lodgeName: "Singapore Lodge", lodgeNumber: "L-001" },
      degreeProgress: [],
    });
    mockPrisma.lodgeProfile.findUnique.mockResolvedValue(null);

    const html = await service.renderPrintableHtml(actor, "brother-1");

    expect(html).toContain("DGLEA Masonic Passport");
    expect(html).toContain("John Doe");
    expect(html).toContain("No lodge profile available");
  });

  it("generates a PDF export", async () => {
    mockPrisma.brotherProfile.findUnique.mockResolvedValue({
      id: "brother-1",
      fullName: "John Doe",
      preferredName: null,
      email: "john@example.com",
      phone: "+123",
      currentStage: "ENTERED_APPRENTICE",
      dateInitiated: null,
      datePassed: null,
      dateRaised: null,
      solomonRegisteredOn: null,
      user: { displayName: "John Doe", email: "john@example.com" },
      lodge: { lodgeName: "Singapore Lodge", lodgeNumber: "L-001" },
      degreeProgress: [
        {
          id: "dp-1",
          degreeType: "ENTERED_APPRENTICE",
          status: "SIGNED_OFF",
          mentorNotes: "Completed.",
          submittedAt: null,
          submittedBy: null,
          approvedAt: new Date("2026-06-01"),
          approvedBy: "mentor-1",
          approvalNotes: "Well done.",
          reopenedAt: null,
          reopenedBy: null,
        },
      ],
    });
    mockPrisma.lodgeProfile.findUnique.mockResolvedValue({
      id: "lodge-profile-1",
      lodgeName: "Singapore Lodge",
      lodgeNumber: "L-001",
      district: "District Grand Lodge of the Eastern Archipelago",
      meetingLocation: "Singapore",
      secretaryContact: "secretary@example.local",
    });

    const pdf = await service.generatePdf(actor, "brother-1");

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.toString("ascii", 0, 4)).toBe("%PDF");
  });

  it("denies PDF generation when the actor cannot view the Brother", async () => {
    mockPermissionEvaluator.canViewBrother.mockResolvedValue(false);

    await expect(service.generatePdf(actor, "brother-1")).rejects.toThrow(
      "Cannot export this passport",
    );
  });
});
