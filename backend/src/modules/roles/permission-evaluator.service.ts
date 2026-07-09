import { Injectable } from "@nestjs/common";
import { Role, ScopeType } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";

export interface BrotherScopeContext {
  brotherProfileId: string;
  userId: string;
  lodgeId: string;
  districtId: string;
}

@Injectable()
export class PermissionEvaluator {
  constructor(private readonly prisma: PrismaService) {}

  hasRole(user: CurrentUser, role: Role, scopeType?: ScopeType, scopeId?: string | null): boolean {
    return user.roles.some(
      (r) =>
        r.role === role &&
        (scopeType === undefined || r.scopeType === scopeType) &&
        (scopeId === undefined || r.scopeId === scopeId),
    );
  }

  isDistrictAdmin(user: CurrentUser): boolean {
    return this.hasRole(user, Role.DISTRICT_ADMIN);
  }

  isDistrictMentor(user: CurrentUser): boolean {
    return this.hasRole(user, Role.DISTRICT_MENTOR);
  }

  async canViewBrother(user: CurrentUser, brotherProfileId: string): Promise<boolean> {
    const context = await this.loadBrotherContext(brotherProfileId);
    if (!context) return false;

    if (context.userId === user.id) return true;
    if (await this.isPersonalMentorOf(user.id, brotherProfileId)) return true;
    if (this.hasLodgeMentorScope(user, context.lodgeId)) return true;
    if (this.hasDistrictReadScope(user, context.districtId)) return true;

    return false;
  }

  async canReviewBrotherProgress(
    user: CurrentUser,
    brotherProfileId: string,
  ): Promise<boolean> {
    // Only Personal Mentors (assigned) and Lodge Mentors may review.
    // District mentors/admins and system admins do not perform day-to-day reviews.
    const context = await this.loadBrotherContext(brotherProfileId);
    if (!context) return false;

    if (await this.isPersonalMentorOf(user.id, brotherProfileId)) return true;
    if (this.hasLodgeMentorRole(user, context.lodgeId)) return true;

    return false;
  }

  async canViewLodge(user: CurrentUser, lodgeId: string): Promise<boolean> {
    if (this.hasLodgeMentorScope(user, lodgeId)) return true;
    const lodge = await this.prisma.lodge.findUnique({
      where: { id: lodgeId },
      select: { districtId: true },
    });
    return lodge ? this.hasDistrictReadScope(user, lodge.districtId) : false;
  }

  async canAssignMentor(user: CurrentUser, lodgeId: string): Promise<boolean> {
    if (this.hasLodgeMentorRole(user, lodgeId)) return true;
    const lodge = await this.prisma.lodge.findUnique({
      where: { id: lodgeId },
      select: { districtId: true },
    });
    return lodge
      ? this.hasRole(user, Role.DISTRICT_ADMIN, ScopeType.DISTRICT, lodge.districtId)
      : false;
  }

  async canRecordBrotherActivity(user: CurrentUser, brotherProfileId: string): Promise<boolean> {
    const context = await this.loadBrotherContext(brotherProfileId);
    if (!context) return false;
    if (context.userId === user.id) return true;
    return this.canReviewBrotherProgress(user, brotherProfileId);
  }

  private hasDistrictReadScope(user: CurrentUser, districtId: string): boolean {
    return user.roles.some(
      (r) =>
        (r.role === Role.DISTRICT_MENTOR || r.role === Role.DISTRICT_ADMIN) &&
        r.scopeType === ScopeType.DISTRICT &&
        r.scopeId === districtId,
    );
  }

  async canCreateMentorSession(
    user: CurrentUser,
    brotherProfileId: string,
  ): Promise<boolean> {
    return this.canReviewBrotherProgress(user, brotherProfileId);
  }

  async canTransitionStage(user: CurrentUser, brotherProfileId: string): Promise<boolean> {
    // Stage transitions are Lodge business actions; only Lodge Mentors may perform them.
    const context = await this.loadBrotherContext(brotherProfileId);
    if (!context) return false;

    if (this.hasLodgeMentorRole(user, context.lodgeId)) return true;

    return false;
  }

  async canSignOffSection(user: CurrentUser, brotherProfileId: string): Promise<boolean> {
    return this.canTransitionStage(user, brotherProfileId);
  }

  private hasLodgeMentorScope(user: CurrentUser, lodgeId: string): boolean {
    return user.roles.some(
      (r) =>
        (r.role === Role.LODGE_MENTOR || r.role === Role.WM_LODGE_LEADERSHIP) &&
        ((r.scopeType === ScopeType.LODGE && r.scopeId === lodgeId) || r.scopeType === ScopeType.GLOBAL),
    );
  }

  private hasLodgeMentorRole(user: CurrentUser, lodgeId: string): boolean {
    return user.roles.some(
      (r) =>
        r.role === Role.LODGE_MENTOR &&
        ((r.scopeType === ScopeType.LODGE && r.scopeId === lodgeId) || r.scopeType === ScopeType.GLOBAL),
    );
  }

  private async isPersonalMentorOf(
    mentorUserId: string,
    brotherProfileId: string,
  ): Promise<boolean> {
    const assignment = await this.prisma.mentorAssignment.findFirst({
      where: {
        mentorUserId,
        brotherProfileId,
        activeTo: null,
      },
    });
    return !!assignment;
  }

  private async loadBrotherContext(
    brotherProfileId: string,
  ): Promise<BrotherScopeContext | null> {
    const profile = await this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: {
        user: { select: { id: true } },
        lodge: { select: { districtId: true } },
      },
    });

    if (!profile) return null;

    return {
      brotherProfileId: profile.id,
      userId: profile.user.id,
      lodgeId: profile.lodgeId,
      districtId: profile.lodge.districtId,
    };
  }
}
