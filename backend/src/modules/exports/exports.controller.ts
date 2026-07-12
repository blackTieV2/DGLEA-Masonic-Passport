import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUser as CurrentUserType } from "../../common/guards/firebase-auth.guard";
import { ExportsService } from "./exports.service";

@ApiTags("Exports")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("exports")
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Get("passport/:brotherProfileId")
  async exportPassport(
    @Param("brotherProfileId", ParseUUIDPipe) brotherProfileId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.exportsService.exportPassport(user, brotherProfileId);
  }

  @Get("passport/:brotherProfileId/printable")
  async printablePassport(
    @Param("brotherProfileId", ParseUUIDPipe) brotherProfileId: string,
    @CurrentUser() user: CurrentUserType,
    @Res() response: Response,
  ) {
    const html = await this.exportsService.renderPrintableHtml(
      user,
      brotherProfileId,
    );
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.send(html);
  }

  @Get("passport/:brotherProfileId/pdf")
  async pdfPassport(
    @Param("brotherProfileId", ParseUUIDPipe) brotherProfileId: string,
    @CurrentUser() user: CurrentUserType,
    @Res() response: Response,
  ) {
    const pdf = await this.exportsService.generatePdf(user, brotherProfileId);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="passport-${brotherProfileId}.pdf"`,
    );
    response.send(pdf);
  }
}
