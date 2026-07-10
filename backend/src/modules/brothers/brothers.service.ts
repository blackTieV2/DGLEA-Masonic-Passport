import { Injectable, ForbiddenException } from "@nestjs/common";
import { Prisma, Role, ScopeType } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";

@Injectable()
export class BrothersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
  ) {}

  async listBrothers(user: CurrentUser): Promise<unknown[]> {
    const lodgeIds = user.roles
      .filter(
        (r) =>
          (r.role === Role.LODGE_MENTOR || r.role === Role.LODGE_REVIEWER || r.role === Role.LODGE_ADMIN) &&
          r.scopeType === ScopeType.LODGE &&
          r.scopeId,
      )
      .map((r) => r.scopeId as string);
    const districtIds = user.roles
      .filter(
        (r) =>
          (r.role === Role.DISTRICT_MENTOR || r.role === Role.DISTRICT_ADMIN) &&
          r.scopeType === ScopeType.DISTRICT &&
          r.scopeId,
      )
      .map((r) => r.scopeId as string);
    const personalAssignments = await this.prisma.mentorAssignment.findMany({
      where: { mentorUserId: user.id, activeTo: null },
      select: { brotherProfileId: true },
    });

    const scopes: Prisma.BrotherProfileWhereInput[] = [];
    if (lodgeIds.length) scopes.push({ lodgeId: { in: lodgeIds } });
    if (districtIds.length) scopes.push({ lodge: { districtId: { in: districtIds } } });
    if (personalAssignments.length) {
      scopes.push({ id: { in: personalAssignments.map((a) => a.brotherProfileId) } });
    }
    if (!scopes.length) {
      throw new ForbiddenException("Insufficient scope to list Brothers");
    }

    return this.prisma.brotherProfile.findMany({
      where: { OR: scopes },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
        lodge: true,
      },
    });
  }

  async getBrother(brotherProfileId: string): Promise<unknown> {
    return this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
        lodge: true,
        mentorAssignments: {
          include: { mentorUser: { select: { id: true, displayName: true } } },
        },
      },
    });
  }
}
