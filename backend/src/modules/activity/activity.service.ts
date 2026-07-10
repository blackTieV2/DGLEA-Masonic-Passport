import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { AuditAction } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { CreateMentorSessionDto } from "./dto/create-mentor-session.dto";
import { CreateVisitationDto } from "./dto/create-visitation.dto";
import { CreateRitualPerformanceDto } from "./dto/create-ritual-performance.dto";
import { CreateSectionSignoffDto } from "./dto/create-section-signoff.dto";

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly auditService: AuditService,
  ) {}

  async createMentorSession(
    user: CurrentUser,
    brotherProfileId: string,
    dto: CreateMentorSessionDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canCreateMentorSession(
      user,
      brotherProfileId,
    );
    if (!allowed) {
      throw new ForbiddenException("Cannot create mentor session for this Brother");
    }

    const session = await this.prisma.mentorSession.create({
      data: {
        brotherProfileId,
        mentorUserId: user.id,
        sectionCode: dto.sectionCode ?? "ENTERED_APPRENTICE",
        sessionDate: new Date(dto.sessionDate),
        topicsSummary: dto.topicsSummary,
        nextActions: dto.nextActions ?? null,
        isPrivateNote: dto.isPrivateNote ?? false,
      },
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.CREATE,
      resourceType: "MentorSession",
      resourceId: session.id,
      metadata: { brotherProfileId },
    });

    return session;
  }

  async listMentorSessions(user: CurrentUser, brotherProfileId: string): Promise<unknown[]> {
    const allowed = await this.permissionEvaluator.canViewBrother(user, brotherProfileId);
    if (!allowed) throw new ForbiddenException("Cannot view mentor sessions for this Brother");
    return this.prisma.mentorSession.findMany({
      where: {
        brotherProfileId,
        OR: [{ isPrivateNote: false }, { mentorUserId: user.id }],
      },
      orderBy: { sessionDate: "desc" },
      include: { mentorUser: { select: { displayName: true } } },
    });
  }

  async createVisitation(
    user: CurrentUser,
    brotherProfileId: string,
    dto: CreateVisitationDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canRecordBrotherActivity(user, brotherProfileId);
    if (!allowed) {
      throw new ForbiddenException("Cannot record visitation for this Brother");
    }

    const visitation = await this.prisma.visitation.create({
      data: {
        brotherProfileId,
        sectionCode: dto.sectionCode ?? "ENTERED_APPRENTICE",
        lodgeVisited: dto.lodgeVisited,
        visitDate: new Date(dto.visitDate),
        degreeObserved: dto.degreeObserved ?? null,
        debriefCompleted: dto.debriefCompleted ?? false,
        reflection: dto.reflection ?? null,
      },
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.CREATE,
      resourceType: "Visitation",
      resourceId: visitation.id,
      metadata: { brotherProfileId },
    });

    return visitation;
  }

  async listVisitations(user: CurrentUser, brotherProfileId: string): Promise<unknown[]> {
    const allowed = await this.permissionEvaluator.canViewBrother(user, brotherProfileId);
    if (!allowed) throw new ForbiddenException("Cannot view visitations for this Brother");
    return this.prisma.visitation.findMany({
      where: { brotherProfileId },
      orderBy: { visitDate: "desc" },
    });
  }

  async createRitualPerformance(
    user: CurrentUser,
    brotherProfileId: string,
    dto: CreateRitualPerformanceDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canRecordBrotherActivity(user, brotherProfileId);
    if (!allowed) {
      throw new ForbiddenException("Cannot record ritual performance for this Brother");
    }

    const performance = await this.prisma.ritualPerformance.create({
      data: {
        brotherProfileId,
        sectionCode: dto.sectionCode ?? "ENTERED_APPRENTICE",
        ritualDate: new Date(dto.ritualDate),
        ritualLabel: dto.ritualLabel,
      },
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.CREATE,
      resourceType: "RitualPerformance",
      resourceId: performance.id,
      metadata: { brotherProfileId },
    });

    return performance;
  }

  async listRitualPerformances(user: CurrentUser, brotherProfileId: string): Promise<unknown[]> {
    const allowed = await this.permissionEvaluator.canViewBrother(user, brotherProfileId);
    if (!allowed) throw new ForbiddenException("Cannot view ritual performances for this Brother");
    return this.prisma.ritualPerformance.findMany({
      where: { brotherProfileId },
      orderBy: { ritualDate: "desc" },
    });
  }

  async createSectionSignoff(
    user: CurrentUser,
    brotherProfileId: string,
    sectionCode: string,
    dto: CreateSectionSignoffDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canSignOffSection(user, brotherProfileId);
    if (!allowed) {
      throw new ForbiddenException("Cannot sign off this section");
    }

    const section = await this.prisma.passportSection.findFirst({
      where: { code: sectionCode },
    });
    if (!section) {
      throw new BadRequestException("Invalid section code");
    }

    const signoff = await this.prisma.sectionSignoff.create({
      data: {
        brotherProfileId,
        sectionCode,
        signedBy: user.id,
        signedAt: new Date(dto.signedAt),
        outcome: dto.outcome,
        note: dto.note ?? null,
      },
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.UPDATE,
      resourceType: "SectionSignoff",
      resourceId: signoff.id,
      metadata: { brotherProfileId, sectionCode, outcome: dto.outcome },
    });

    return signoff;
  }
}
