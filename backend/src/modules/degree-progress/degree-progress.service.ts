import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { DegreeStatus, DegreeProgress, BrotherProfile } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { CreateDegreeProgressDto } from "./dto/create-degree-progress.dto";
import { UpdateDegreeProgressDto } from "./dto/update-degree-progress.dto";
import { ApproveDegreeProgressDto } from "./dto/approve-degree-progress.dto";

type DegreeProgressWithBrother = DegreeProgress & {
  brotherProfile: BrotherProfile & {
    user: { id: string };
    lodge: { districtId: string };
  };
};

@Injectable()
export class DegreeProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permission: PermissionEvaluator,
  ) {}

  async create(dto: CreateDegreeProgressDto, _actor?: CurrentUser) {
    if (
      dto.status === DegreeStatus.SIGNED_OFF ||
      dto.status === DegreeStatus.READY_FOR_SIGN_OFF
    ) {
      throw new BadRequestException(
        "Cannot create degree progress in a signed-off or ready-for-sign-off state",
      );
    }

    return this.prisma.degreeProgress.create({
      data: {
        brotherProfileId: dto.brotherProfileId,
        degreeType: dto.degreeType,
        status: dto.status ?? DegreeStatus.NOT_STARTED,
        mentorNotes: dto.mentorNotes,
      },
    });
  }

  async findAll() {
    return this.prisma.degreeProgress.findMany({
      include: { brotherProfile: { select: { id: true, fullName: true } } },
    });
  }

  async findOne(id: string) {
    const progress = await this.prisma.degreeProgress.findUnique({
      where: { id },
      include: { brotherProfile: { select: { id: true, fullName: true } } },
    });
    if (!progress) {
      throw new NotFoundException("Degree progress not found");
    }
    return progress;
  }

  async update(id: string, dto: UpdateDegreeProgressDto, actor: CurrentUser) {
    const progress = await this.loadProgress(id);

    const canEdit = await this.canEditDraft(actor, progress);
    if (!canEdit) {
      throw new ForbiddenException("Cannot edit this degree progress");
    }

    if (
      dto.status === DegreeStatus.SIGNED_OFF ||
      dto.status === DegreeStatus.READY_FOR_SIGN_OFF
    ) {
      throw new BadRequestException(
        "Use the approval workflow endpoints to change status to ready-for-sign-off or signed-off",
      );
    }

    if (dto.status !== undefined && !this.isOrdinaryStatusAllowed(progress.status, dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${progress.status} to ${dto.status} via ordinary update`,
      );
    }

    return this.prisma.degreeProgress.update({
      where: { id },
      data: {
        status: dto.status,
        mentorNotes: dto.mentorNotes,
      },
    });
  }

  async readyForSignOff(id: string, actor: CurrentUser) {
    const progress = await this.loadProgress(id);

    const canSubmit = await this.canEditDraft(actor, progress);
    if (!canSubmit) {
      throw new ForbiddenException("Cannot submit this degree progress");
    }

    if (progress.status !== DegreeStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot mark ready for sign-off from status ${progress.status}`,
      );
    }

    return this.prisma.degreeProgress.update({
      where: { id },
      data: {
        status: DegreeStatus.READY_FOR_SIGN_OFF,
        submittedAt: new Date(),
        submittedBy: actor.id,
      },
    });
  }

  async approve(id: string, dto: ApproveDegreeProgressDto, actor: CurrentUser) {
    const progress = await this.loadProgress(id);

    const canApprove = await this.permission.canApproveDegreeProgress(
      actor,
      progress.brotherProfileId,
    );
    if (!canApprove) {
      throw new ForbiddenException("Cannot approve this degree progress");
    }

    if (progress.status !== DegreeStatus.READY_FOR_SIGN_OFF) {
      throw new BadRequestException(
        `Cannot approve from status ${progress.status}`,
      );
    }

    return this.prisma.degreeProgress.update({
      where: { id },
      data: {
        status: DegreeStatus.SIGNED_OFF,
        approvedBy: actor.id,
        approvedAt: new Date(),
        approvalNotes: dto.approvalNotes,
      },
    });
  }

  async reopen(id: string, actor: CurrentUser) {
    const progress = await this.loadProgress(id);

    const canApprove = await this.permission.canApproveDegreeProgress(
      actor,
      progress.brotherProfileId,
    );
    if (!canApprove) {
      throw new ForbiddenException("Cannot reopen this degree progress");
    }

    if (
      progress.status !== DegreeStatus.SIGNED_OFF &&
      progress.status !== DegreeStatus.READY_FOR_SIGN_OFF
    ) {
      throw new BadRequestException(
        `Cannot reopen from status ${progress.status}`,
      );
    }

    return this.prisma.degreeProgress.update({
      where: { id },
      data: {
        status: DegreeStatus.IN_PROGRESS,
        reopenedAt: new Date(),
        reopenedBy: actor.id,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.degreeProgress.delete({ where: { id } });
  }

  private async loadProgress(id: string) {
    const progress = await this.prisma.degreeProgress.findUnique({
      where: { id },
      include: {
        brotherProfile: {
          include: {
            user: { select: { id: true } },
            lodge: { select: { districtId: true } },
          },
        },
      },
    });
    if (!progress) {
      throw new NotFoundException("Degree progress not found");
    }
    return progress;
  }

  private async canEditDraft(
    actor: CurrentUser,
    progress: DegreeProgressWithBrother,
  ): Promise<boolean> {
    if (progress.brotherProfile.userId === actor.id) {
      return true;
    }
    return this.permission.canReviewBrotherProgress(actor, progress.brotherProfileId);
  }

  private isOrdinaryStatusAllowed(
    current: DegreeStatus,
    next: DegreeStatus,
  ): boolean {
    if (current === next) return true;
    if (current === DegreeStatus.NOT_STARTED && next === DegreeStatus.IN_PROGRESS) {
      return true;
    }
    return false;
  }
}
