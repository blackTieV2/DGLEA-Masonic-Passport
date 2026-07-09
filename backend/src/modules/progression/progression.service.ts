import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Stage, AuditAction, NotificationType } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";
import { StageTransitionDto } from "./dto/stage-transition.dto";

const STAGE_ORDER: Stage[] = [
  Stage.ENTERED_APPRENTICE,
  Stage.FELLOW_CRAFT,
  Stage.MASTER_MASON,
  Stage.PREPARING_FOR_OFFICE,
];

@Injectable()
export class ProgressionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async transitionStage(
    user: CurrentUser,
    brotherProfileId: string,
    dto: StageTransitionDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canTransitionStage(user, brotherProfileId);
    if (!allowed) {
      throw new ForbiddenException("Cannot transition this Brother's stage");
    }

    const profile = await this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: { user: { select: { id: true } } },
    });

    if (!profile) {
      throw new NotFoundException("Brother profile not found");
    }

    const currentIndex = STAGE_ORDER.indexOf(profile.currentStage);
    const targetIndex = STAGE_ORDER.indexOf(dto.targetStage);

    if (targetIndex < currentIndex) {
      throw new BadRequestException("Cannot regress to an earlier stage");
    }

    if (targetIndex > currentIndex + 1) {
      throw new BadRequestException("Cannot skip a stage");
    }

    const data: {
      currentStage: Stage;
      dateInitiated?: Date;
      datePassed?: Date;
      dateRaised?: Date;
    } = {
      currentStage: dto.targetStage,
    };

    if (dto.dateInitiated) data.dateInitiated = new Date(dto.dateInitiated);
    if (dto.datePassed) data.datePassed = new Date(dto.datePassed);
    if (dto.dateRaised) data.dateRaised = new Date(dto.dateRaised);

    const updated = await this.prisma.brotherProfile.update({
      where: { id: brotherProfileId },
      data,
    });

    await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.STAGE_TRANSITION,
      resourceType: "BrotherProfile",
      resourceId: brotherProfileId,
      metadata: {
        fromStage: profile.currentStage,
        toStage: dto.targetStage,
      },
    });

    await this.notificationsService.create({
      userId: profile.userId,
      type: NotificationType.STAGE_TRANSITION,
      title: "Stage transition",
      body: `Your stage has been updated to ${dto.targetStage}.`,
      relatedResourceType: "BrotherProfile",
      relatedResourceId: brotherProfileId,
    });

    return updated;
  }
}
