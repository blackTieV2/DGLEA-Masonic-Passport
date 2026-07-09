import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class OrganisationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listDistricts(): Promise<unknown[]> {
    return this.prisma.district.findMany({
      where: { active: true },
      include: { lodges: { where: { active: true } } },
    });
  }

  async listLodges(districtId?: string): Promise<unknown[]> {
    return this.prisma.lodge.findMany({
      where: { active: true, districtId },
    });
  }
}
