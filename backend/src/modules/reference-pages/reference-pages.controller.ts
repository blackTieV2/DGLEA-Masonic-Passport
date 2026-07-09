import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { ReferencePagesService } from "./reference-pages.service";

@ApiTags("Reference Pages")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("reference-pages")
export class ReferencePagesController {
  constructor(private readonly referencePagesService: ReferencePagesService) {}

  @Get()
  findAll(@Query("section") section?: string) {
    return this.referencePagesService.findAll(section);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.referencePagesService.findBySlug(slug);
  }
}
