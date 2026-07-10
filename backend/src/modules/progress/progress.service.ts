import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { ProgressStatus, AuditAction, NotificationType, Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";

const VALID_DRAFT_TRANSITIONS: ProgressStatus[] = [
  ProgressStatus.NOT_STARTED,
  ProgressStatus.DRAFT,
  ProgressStatus.CLARIFICATION_REQUESTED,
  ProgressStatus.REJECTED,
];

const VALID_SUBMIT_TRANSITIONS: ProgressStatus[] = [
  ProgressStatus.DRAFT,
  ProgressStatus.CLARIFICATION_REQUESTED,
  ProgressStatus.REJECTED,
];

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async updateDraft(
    user: CurrentUser,
    progressId: string,
    draftNote?: string,
  ): Promise<unknown> {
    const progress = await this.loadProgress(progressId);

    const canEdit =
      (await this.permissionEvaluator.canReviewBrotherProgress(
        user,
        progress.brotherProfileId,
      )) ||
      progress.brotherProfile.userId === user.id;

    if (!canEdit) {
      throw new ForbiddenException("Cannot edit this progress item");
    }

    if (!VALID_DRAFT_TRANSITIONS.includes(progress.status)) {
      throw new BadRequestException(
        `Cannot update draft from status ${progress.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await this.transitionOrConflict(tx, progressId, progress.status, progress.version, {
        status: ProgressStatus.DRAFT,
        draftNote: draftNote ?? progress.draftNote,
        version: { increment: 1 },
      });
      await this.auditService.record({
        actorUserId: user.id,
        action: AuditAction.UPDATE,
        resourceType: "PassportProgress",
        resourceId: progressId,
        metadata: { fromStatus: progress.status, toStatus: ProgressStatus.DRAFT },
      }, tx);
      return tx.passportProgress.findUniqueOrThrow({ where: { id: progressId } });
    });
  }

  async submit(user: CurrentUser, progressId: string): Promise<unknown> {
    const progress = await this.loadProgress(progressId);

    const canSubmit =
      progress.brotherProfile.userId === user.id ||
      (await this.permissionEvaluator.canReviewBrotherProgress(
        user,
        progress.brotherProfileId,
      ));

    if (!canSubmit) {
      throw new ForbiddenException("Cannot submit this progress item");
    }

    if (!VALID_SUBMIT_TRANSITIONS.includes(progress.status)) {
      throw new BadRequestException(`Cannot submit from status ${progress.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      await this.transitionOrConflict(tx, progressId, progress.status, progress.version, {
        status: ProgressStatus.SUBMITTED,
        submittedAt: new Date(),
        version: { increment: 1 },
      });
      await this.auditService.record({
        actorUserId: user.id,
        action: AuditAction.SUBMIT,
        resourceType: "PassportProgress",
        resourceId: progressId,
        metadata: { fromStatus: progress.status, toStatus: ProgressStatus.SUBMITTED },
      }, tx);
      await this.notifyReviewers(
        progress.brotherProfileId,
        progressId,
        NotificationType.ITEM_SUBMITTED,
        tx,
      );
      return tx.passportProgress.findUniqueOrThrow({ where: { id: progressId } });
    });
  }

  async clarificationResponse(
    user: CurrentUser,
    progressId: string,
    response: string,
  ): Promise<unknown> {
    const progress = await this.loadProgress(progressId);

    if (progress.brotherProfile.userId !== user.id) {
      throw new ForbiddenException("Only the Brother can respond to clarification");
    }

    if (progress.status !== ProgressStatus.CLARIFICATION_REQUESTED) {
      throw new BadRequestException("Progress is not awaiting clarification");
    }

    return this.prisma.$transaction(async (tx) => {
      await this.transitionOrConflict(tx, progressId, progress.status, progress.version, {
        status: ProgressStatus.DRAFT,
        draftNote: response,
        version: { increment: 1 },
      });
      await this.auditService.record({
        actorUserId: user.id,
        action: AuditAction.UPDATE,
        resourceType: "PassportProgress",
        resourceId: progressId,
        metadata: {
          fromStatus: ProgressStatus.CLARIFICATION_REQUESTED,
          toStatus: ProgressStatus.DRAFT,
          clarificationResponse: true,
        },
      }, tx);
      await this.notificationsService.create({
        userId: progress.brotherProfile.userId,
        type: NotificationType.CLARIFICATION_RESPONDED,
        title: "Clarification responded",
        body: "Your clarification response has been recorded.",
        relatedResourceType: "PassportProgress",
        relatedResourceId: progressId,
      }, tx);
      return tx.passportProgress.findUniqueOrThrow({ where: { id: progressId } });
    });
  }

  private async loadProgress(progressId: string) {
    const progress = await this.prisma.passportProgress.findUnique({
      where: { id: progressId },
      include: {
        brotherProfile: { include: { user: { select: { id: true } } } },
        milestoneTemplate: true,
      },
    });

    if (!progress) {
      throw new NotFoundException("Progress item not found");
    }

    return progress;
  }

  private async notifyReviewers(
    brotherProfileId: string,
    progressId: string,
    type: NotificationType,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const assignments = await tx.mentorAssignment.findMany({
      where: { brotherProfileId, activeTo: null },
      select: { mentorUserId: true },
    });

    for (const assignment of assignments) {
      await this.notificationsService.create({
        userId: assignment.mentorUserId,
        type,
        title: "Progress item submitted",
        body: "A progress item has been submitted for review.",
        relatedResourceType: "PassportProgress",
        relatedResourceId: progressId,
      }, tx);
    }
  }

  private async transitionOrConflict(
    tx: Prisma.TransactionClient,
    progressId: string,
    currentStatus: ProgressStatus,
    version: number,
    data: Prisma.PassportProgressUpdateManyMutationInput,
  ): Promise<void> {
    const changed = await tx.passportProgress.updateMany({
      where: { id: progressId, status: currentStatus, version },
      data,
    });
    if (changed.count !== 1) {
      throw new ConflictException("Progress item changed before this action was applied");
    }
  }
}
