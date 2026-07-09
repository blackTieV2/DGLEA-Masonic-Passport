import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { ReferenceSection } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class ReferencePagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(section?: string) {
    const where: { isActive: true; section?: ReferenceSection } = { isActive: true };

    if (section) {
      const validSections = Object.values(ReferenceSection);
      if (!validSections.includes(section as ReferenceSection)) {
        throw new BadRequestException(`Invalid reference section: ${section}`);
      }
      where.section = section as ReferenceSection;
    }

    return this.prisma.staticReferencePage.findMany({
      where,
      orderBy: [{ section: "asc" }, { orderIndex: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        section: true,
        orderIndex: true,
        sourceEdition: true,
        updatedAt: true,
      },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.staticReferencePage.findUnique({
      where: { slug },
    });
    if (!page) {
      throw new NotFoundException("Reference page not found");
    }
    return page;
  }
}
