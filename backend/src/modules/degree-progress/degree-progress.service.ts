import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateDegreeProgressDto } from "./dto/create-degree-progress.dto";
import { UpdateDegreeProgressDto } from "./dto/update-degree-progress.dto";

@Injectable()
export class DegreeProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDegreeProgressDto) {
    return this.prisma.degreeProgress.create({
      data: {
        brotherProfileId: dto.brotherProfileId,
        degreeType: dto.degreeType,
        status: dto.status ?? "NOT_STARTED",
        mentorNotes: dto.mentorNotes,
        approvedBy: dto.approvedBy,
        approvedAt: dto.approvedBy ? new Date() : undefined,
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

  async update(id: string, dto: UpdateDegreeProgressDto) {
    await this.findOne(id);
    return this.prisma.degreeProgress.update({
      where: { id },
      data: {
        status: dto.status,
        mentorNotes: dto.mentorNotes,
        approvedBy: dto.approvedBy,
        approvedAt: dto.approvedBy ? new Date() : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.degreeProgress.delete({ where: { id } });
  }
}
