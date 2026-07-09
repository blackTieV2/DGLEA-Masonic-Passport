import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import {
  ProgressStatus,
  ReviewDecision,
  AuditAction,
  NotificationType,
  Role,
  ScopeType,
} from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { AuditService } from "../audit/audit.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getReviewQueue(user: CurrentUser, brotherProfileId?: string): Promise<unknown[]> {
    const accessibleProfileIds = await this.accessibleBrotherProfileIds(user, brotherProfileId);

    return this.prisma.passportProgress.findMany({
      where: {
        brotherProfileId: { in: accessibleProfileIds },
        status: ProgressStatus.SUBMITTED,
      },
      include: {
        brotherProfile: {
          include: { user: { select: { id: true, displayName: true } }, lodge: true },
        },
        milestoneTemplate: { include: { section: true } },
      },
      orderBy: { submittedAt: "asc" },
    });
  }

  async review(
    user: CurrentUser,
    progressId: string,
    decision: ReviewDecision,
    reason?: string,
  ): Promise<unknown> {
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

    const canReview = await this.permissionEvaluator.canReviewBrotherProgress(
      user,
      progress.brotherProfileId,
    );
    if (!canReview) {
      throw new ForbiddenException("You cannot review this progress item");
    }

    if (progress.status !== ProgressStatus.SUBMITTED) {
      throw new BadRequestException("Progress item is not submitted for review");
    }

    if (
      (decision === ReviewDecision.REJECT ||
        decision === ReviewDecision.REQUEST_CLARIFICATION) &&
      !reason
    ) {
      throw new BadRequestException("Reason is required for reject or clarification");
    }

    let nextStatus: ProgressStatus;
    let notificationType: NotificationType;
    let notificationTitle: string;

    switch (decision) {
      case ReviewDecision.VERIFY:
        nextStatus = ProgressStatus.VERIFIED;
        notificationType = NotificationType.ITEM_VERIFIED;
        notificationTitle = "Progress item verified";
        break;
      case ReviewDecision.REJECT:
        nextStatus = ProgressStatus.REJECTED;
        notificationType = NotificationType.ITEM_REJECTED;
        notificationTitle = "Progress item rejected";
        break;
      case ReviewDecision.REQUEST_CLARIFICATION:
        nextStatus = ProgressStatus.CLARIFICATION_REQUESTED;
        notificationType = NotificationType.CLARIFICATION_REQUESTED;
        notificationTitle = "Clarification requested";
        break;
      default:
        throw new BadRequestException("Invalid review decision");
    }

    return this.prisma.$transaction(async (tx) => {
      const changed = await tx.passportProgress.updateMany({
        where: {
          id: progressId,
          status: ProgressStatus.SUBMITTED,
          version: progress.version,
        },
        data: {
          status: nextStatus,
          completedAt:
            nextStatus === ProgressStatus.VERIFIED ? new Date() : progress.completedAt,
          version: { increment: 1 },
        },
      });
      if (changed.count !== 1) {
        throw new ConflictException("Progress item changed before this review was applied");
      }

      const reviewRecord = await tx.review.create({
        data: {
          progressId,
          reviewerUserId: user.id,
          decision,
          reason: reason ?? null,
        },
      });

      await this.auditService.record({
      actorUserId: user.id,
      action: AuditAction.REVIEW,
      resourceType: "PassportProgress",
      resourceId: progressId,
      metadata: { decision, reason: reason ?? null },
      }, tx);

      await this.notificationsService.create({
      userId: progress.brotherProfile.userId,
      type: notificationType,
      title: notificationTitle,
      body: reason ? `${notificationTitle}: ${reason}` : notificationTitle,
      relatedResourceType: "PassportProgress",
      relatedResourceId: progressId,
      }, tx);

      const updatedProgress = await tx.passportProgress.findUniqueOrThrow({
        where: { id: progressId },
      });
      return { review: reviewRecord, progress: updatedProgress };
    });
  }

  private async accessibleBrotherProfileIds(
    user: CurrentUser,
    specificBrotherProfileId?: string,
  ): Promise<string[]> {
    if (specificBrotherProfileId) {
      const allowed = await this.permissionEvaluator.canReviewBrotherProgress(
        user,
        specificBrotherProfileId,
      );
      return allowed ? [specificBrotherProfileId] : [];
    }

    const lodgeIds = user.roles
      .filter((r) => r.role === Role.LODGE_MENTOR && r.scopeType === ScopeType.LODGE && r.scopeId)
      .map((r) => r.scopeId as string);

    const personalAssignments = await this.prisma.mentorAssignment.findMany({
      where: { mentorUserId: user.id, activeTo: null },
      select: { brotherProfileId: true },
    });

    const lodgeProfiles = lodgeIds.length
      ? await this.prisma.brotherProfile.findMany({
          where: { lodgeId: { in: lodgeIds } },
          select: { id: true },
        })
      : [];

    return Array.from(
      new Set([
        ...personalAssignments.map((a) => a.brotherProfileId),
        ...lodgeProfiles.map((p) => p.id),
      ]),
    );
  }
}
