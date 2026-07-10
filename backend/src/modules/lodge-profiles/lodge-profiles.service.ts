import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateLodgeProfileDto } from "./dto/create-lodge-profile.dto";
import { UpdateLodgeProfileDto } from "./dto/update-lodge-profile.dto";

@Injectable()
export class LodgeProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLodgeProfileDto) {
    return this.prisma.lodgeProfile.create({ data: { ...dto } });
  }

  async findAll() {
    return this.prisma.lodgeProfile.findMany();
  }

  async findOne(id: string) {
    const profile = await this.prisma.lodgeProfile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException("Lodge profile not found");
    }
    return profile;
  }

  async update(id: string, dto: UpdateLodgeProfileDto) {
    await this.findOne(id);
    return this.prisma.lodgeProfile.update({ where: { id }, data: { ...dto } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lodgeProfile.delete({ where: { id } });
  }
}
