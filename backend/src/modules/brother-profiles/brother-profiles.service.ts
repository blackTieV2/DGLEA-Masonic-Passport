import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateBrotherProfileDto } from "./dto/create-brother-profile.dto";
import { UpdateBrotherProfileDto } from "./dto/update-brother-profile.dto";

@Injectable()
export class BrotherProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrotherProfileDto) {
    return this.prisma.brotherProfile.create({
      data: {
        userId: dto.userId,
        lodgeId: dto.lodgeId,
        currentStage: dto.currentStage ?? "ENTERED_APPRENTICE",
        fullName: dto.fullName,
        preferredName: dto.preferredName,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  async findAll() {
    return this.prisma.brotherProfile.findMany({
      include: { user: { select: { id: true, displayName: true, email: true } }, lodge: true },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.brotherProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, displayName: true, email: true } }, lodge: true },
    });
    if (!profile) {
      throw new NotFoundException("Brother profile not found");
    }
    return profile;
  }

  async update(id: string, dto: UpdateBrotherProfileDto) {
    await this.findOne(id);
    return this.prisma.brotherProfile.update({
      where: { id },
      data: {
        lodgeId: dto.lodgeId,
        currentStage: dto.currentStage,
        fullName: dto.fullName,
        preferredName: dto.preferredName,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brotherProfile.delete({ where: { id } });
  }
}
