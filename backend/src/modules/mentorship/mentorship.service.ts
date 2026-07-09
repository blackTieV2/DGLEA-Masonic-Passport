import { Injectable, ForbiddenException, BadRequestException } from "@nestjs/common";
import { AuditAction } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { CreateMentorAssignmentDto } from "./dto/create-mentor-assignment.dto";

@Injectable()
export class MentorshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly auditService: AuditService,
  ) {}

  async assignMentor(
    user: CurrentUser,
    brotherProfileId: string,
    dto: CreateMentorAssignmentDto,
  ): Promise<unknown> {
    const profile = await this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: { user: { select: { id: true } } },
    });

    if (!profile) {
      throw new BadRequestException("Brother profile not found");
    }

    const canAssign = await this.permissionEvaluator.canAssignMentor(user, profile.lodgeId);
    if (!canAssign) {
      throw new ForbiddenException("Cannot assign mentor for this Brother");
    }

    await this.prisma.mentorAssignment.updateMany({
      where: {
        brotherProfileId,
        assignmentType: dto.assignmentType,
        activeTo: null,
      },
      data: { activeTo: new Date() },
    });

    const assignment = await this.prisma.mentorAssignment.create({
      data: {
        brotherProfileId,
        mentorUserId: dto.mentorUserId,
        assignmentType: dto.assignmentType,
      },
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.ASSIGN_ROLE,
      resourceType: "MentorAssignment",
      resourceId: assignment.id,
      metadata: { brotherProfileId, mentorUserId: dto.mentorUserId, assignmentType: dto.assignmentType },
    });

    return assignment;
  }
}
