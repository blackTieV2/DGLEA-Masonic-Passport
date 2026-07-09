import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { ReportingService } from "./reporting.service";

class LodgeDashboardQueryDto {
  @IsOptional()
  @IsUUID()
  lodgeId?: string;
}

@ApiTags("Reporting")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("reporting")
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get("lodge-dashboard")
  @ApiQuery({ name: "lodgeId", required: false })
  async getLodgeDashboard(
    @CurrentUserDecorator() user: CurrentUser,
    @Query() query: LodgeDashboardQueryDto,
  ): Promise<unknown> {
    return this.reportingService.getLodgeDashboard(user, query.lodgeId);
  }
}
