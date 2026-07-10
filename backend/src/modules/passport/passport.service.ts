import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class PassportService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentTemplate(): Promise<unknown> {
    const template = await this.prisma.passportTemplate.findFirst({
      where: { active: true },
      orderBy: { activeFrom: "desc" },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            milestoneTemplates: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException("No active passport template found");
    }

    return template;
  }

  async getBrotherPassport(brotherProfileId: string): Promise<unknown> {
    const profile = await this.prisma.brotherProfile.findUnique({
      where: { id: brotherProfileId },
      include: {
        lodge: true,
        passportProgress: {
          include: {
            milestoneTemplate: {
              include: { section: true },
            },
            reviews: {
              orderBy: { createdAt: "desc" },
              include: { reviewer: { select: { displayName: true } } },
            },
          },
        },
        sectionSignoffs: true,
      },
    });

    if (!profile) {
      throw new NotFoundException("Brother profile not found");
    }

    const template = await this.getCurrentTemplate();

    return {
      profile: {
        id: profile.id,
        currentStage: profile.currentStage,
        lodge: profile.lodge,
      },
      template,
      progress: profile.passportProgress,
      signoffs: profile.sectionSignoffs,
    };
  }
}
