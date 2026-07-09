import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import {
  PassportExportDto,
  PassportExportBrotherDto,
  PassportExportLodgeDto,
  PassportExportDegreeProgressDto,
} from "./dto/passport-export.dto";

// NOTE: This service returns a stable JSON shape for Passport export.
// A future PDF renderer (Puppeteer, pdf-lib, etc.) can consume this shape
// or render the /printable HTML endpoint. No heavy PDF dependency is added
// in this slice so the contract can stabilise first.
@Injectable()
export class ExportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permission: PermissionEvaluator,
  ) {}

  async exportPassport(
    actor: CurrentUser,
    brotherProfileId: string,
  ): Promise<PassportExportDto> {
    const canView = await this.permission.canViewBrother(actor, brotherProfileId);
    if (!canView) {
      throw new ForbiddenException("Cannot export this passport");
    }

    const brotherProfile = await this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
        lodge: true,
        degreeProgress: true,
      },
    });

    if (!brotherProfile) {
      throw new NotFoundException("Brother profile not found");
    }

    const lodgeProfile = await this.prisma.lodgeProfile.findUnique({
      where: { lodgeNumber: brotherProfile.lodge.lodgeNumber },
    });

    return {
      generatedAt: new Date().toISOString(),
      brotherProfile: this.mapBrother(brotherProfile),
      lodgeProfile: lodgeProfile ? this.mapLodge(lodgeProfile) : null,
      degreeProgress: brotherProfile.degreeProgress.map((dp) => this.mapDegreeProgress(dp)),
    };
  }

  async renderPrintableHtml(
    actor: CurrentUser,
    brotherProfileId: string,
  ): Promise<string> {
    const data = await this.exportPassport(actor, brotherProfileId);

    const degreeRows = data.degreeProgress
      .map(
        (dp) => `
          <tr>
            <td>${this.escapeHtml(dp.degreeType)}</td>
            <td>${this.escapeHtml(dp.status)}</td>
            <td>${this.escapeHtml(dp.mentorNotes)}</td>
            <td>${this.escapeHtml(dp.approvedAt)}</td>
          </tr>
        `,
      )
      .join("");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>DGLEA Passport - ${this.escapeHtml(data.brotherProfile.fullName ?? data.brotherProfile.id)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
    h1 { font-size: 24px; }
    h2 { font-size: 18px; margin-top: 24px; }
    table { border-collapse: collapse; width: 100%; margin-top: 12px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .meta { margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>DGLEA Masonic Passport</h1>
  <p class="meta">Generated at: ${this.escapeHtml(data.generatedAt)}</p>

  <h2>Brother</h2>
  <p>
    <strong>${this.escapeHtml(data.brotherProfile.fullName ?? data.brotherProfile.userDisplayName)}</strong><br />
    Stage: ${this.escapeHtml(data.brotherProfile.currentStage)}<br />
    Email: ${this.escapeHtml(data.brotherProfile.email)}<br />
    Phone: ${this.escapeHtml(data.brotherProfile.phone)}<br />
    Lodge: ${this.escapeHtml(data.brotherProfile.lodgeName)} (${this.escapeHtml(data.brotherProfile.lodgeNumber)})
  </p>

  <h2>Lodge</h2>
  ${
    data.lodgeProfile
      ? `<p>
           ${this.escapeHtml(data.lodgeProfile.lodgeName)} (${this.escapeHtml(data.lodgeProfile.lodgeNumber)})<br />
           District: ${this.escapeHtml(data.lodgeProfile.district)}<br />
           Meeting location: ${this.escapeHtml(data.lodgeProfile.meetingLocation)}<br />
           Secretary contact: ${this.escapeHtml(data.lodgeProfile.secretaryContact)}
         </p>`
      : "<p>No lodge profile available.</p>"
  }

  <h2>Degree Progress</h2>
  <table>
    <thead>
      <tr>
        <th>Degree</th>
        <th>Status</th>
        <th>Mentor notes</th>
        <th>Signed off</th>
      </tr>
    </thead>
    <tbody>
      ${degreeRows || '<tr><td colspan="4">No degree progress recorded.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
  }

  private mapBrother(profile: {
    id: string;
    fullName: string | null;
    preferredName: string | null;
    email: string | null;
    phone: string | null;
    currentStage: string;
    dateInitiated: Date | null;
    datePassed: Date | null;
    dateRaised: Date | null;
    solomonRegisteredOn: Date | null;
    user: { displayName: string; email: string };
    lodge: { lodgeName: string; lodgeNumber: string };
  }): PassportExportBrotherDto {
    return {
      id: profile.id,
      fullName: profile.fullName,
      preferredName: profile.preferredName,
      email: profile.email,
      phone: profile.phone,
      currentStage: profile.currentStage,
      dateInitiated: profile.dateInitiated?.toISOString() ?? null,
      datePassed: profile.datePassed?.toISOString() ?? null,
      dateRaised: profile.dateRaised?.toISOString() ?? null,
      solomonRegisteredOn: profile.solomonRegisteredOn?.toISOString() ?? null,
      userDisplayName: profile.user.displayName,
      userEmail: profile.user.email,
      lodgeName: profile.lodge.lodgeName,
      lodgeNumber: profile.lodge.lodgeNumber,
    };
  }

  private mapLodge(profile: {
    id: string;
    lodgeName: string;
    lodgeNumber: string;
    district: string | null;
    meetingLocation: string | null;
    secretaryContact: string | null;
  }): PassportExportLodgeDto {
    return { ...profile };
  }

  private mapDegreeProgress(dp: {
    id: string;
    degreeType: string;
    status: string;
    mentorNotes: string | null;
    submittedAt: Date | null;
    submittedBy: string | null;
    approvedAt: Date | null;
    approvedBy: string | null;
    approvalNotes: string | null;
    reopenedAt: Date | null;
    reopenedBy: string | null;
  }): PassportExportDegreeProgressDto {
    return {
      id: dp.id,
      degreeType: dp.degreeType,
      status: dp.status,
      mentorNotes: dp.mentorNotes,
      submittedAt: dp.submittedAt?.toISOString() ?? null,
      submittedBy: dp.submittedBy,
      approvedAt: dp.approvedAt?.toISOString() ?? null,
      approvedBy: dp.approvedBy,
      approvalNotes: dp.approvalNotes,
      reopenedAt: dp.reopenedAt?.toISOString() ?? null,
      reopenedBy: dp.reopenedBy,
    };
  }

  private escapeHtml(value: string | null): string {
    if (value == null) return "";
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
