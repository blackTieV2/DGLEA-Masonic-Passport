import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser } from "../../common/guards/firebase-auth.guard";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";

@Injectable()
export class ReportingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionEvaluator: PermissionEvaluator,
  ) {}

  async getLodgeDashboard(user: CurrentUser, lodgeId?: string): Promise<unknown> {
    if (!lodgeId) {
      throw new ForbiddenException("A Lodge scope is required");
    }
    const allowed = await this.permissionEvaluator.canViewLodge(user, lodgeId);
    if (!allowed) {
      throw new ForbiddenException("Cannot view this lodge dashboard");
    }

    const where = { lodgeId };

    const [total, byStage] = await Promise.all([
      this.prisma.brotherProfile.count({ where }),
      this.prisma.brotherProfile.groupBy({
        by: ["currentStage"],
        where,
        _count: { id: true },
      }),
    ]);

    return {
      lodgeId,
      totalBrothers: total,
      byStage,
    };
  }
}
