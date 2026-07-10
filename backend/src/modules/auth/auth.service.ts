import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface MeProfile {
  id: string;
  email: string;
  displayName: string;
  roles: { role: string; scopeType: string; scopeId: string | null }[];
  brotherProfileId: string | null;
  lodgeId: string | null;
  currentStage: string | null;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: true,
        brotherProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roleAssignments.map((ra) => ({
        role: ra.role,
        scopeType: ra.scopeType,
        scopeId: ra.scopeId,
      })),
      brotherProfileId: user.brotherProfile?.id ?? null,
      lodgeId: user.brotherProfile?.lodgeId ?? null,
      currentStage: user.brotherProfile?.currentStage ?? null,
    };
  }
}
