import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { ActivityService } from "./activity.service";
import { CreateMentorSessionDto } from "./dto/create-mentor-session.dto";
import { CreateVisitationDto } from "./dto/create-visitation.dto";
import { CreateRitualPerformanceDto } from "./dto/create-ritual-performance.dto";
import { CreateSectionSignoffDto } from "./dto/create-section-signoff.dto";
import {
  BrotherIdParamsDto,
  SectionCodeParamsDto,
} from "./dto/activity-params.dto";

@ApiTags("Activity")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("brothers/:brotherId")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post("mentor-sessions")
  async createMentorSession(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
    @Body() body: CreateMentorSessionDto,
  ): Promise<unknown> {
    return this.activityService.createMentorSession(user, params.brotherId, body);
  }

  @Get("mentor-sessions")
  async listMentorSessions(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
  ): Promise<unknown[]> {
    return this.activityService.listMentorSessions(user, params.brotherId);
  }

  @Post("visitations")
  async createVisitation(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
    @Body() body: CreateVisitationDto,
  ): Promise<unknown> {
    return this.activityService.createVisitation(user, params.brotherId, body);
  }

  @Get("visitations")
  async listVisitations(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
  ): Promise<unknown[]> {
    return this.activityService.listVisitations(user, params.brotherId);
  }

  @Post("ritual-performances")
  async createRitualPerformance(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
    @Body() body: CreateRitualPerformanceDto,
  ): Promise<unknown> {
    return this.activityService.createRitualPerformance(user, params.brotherId, body);
  }

  @Get("ritual-performances")
  async listRitualPerformances(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamsDto,
  ): Promise<unknown[]> {
    return this.activityService.listRitualPerformances(user, params.brotherId);
  }

  @Post("sections/:sectionCode/signoff")
  async createSectionSignoff(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: SectionCodeParamsDto,
    @Body() body: CreateSectionSignoffDto,
  ): Promise<unknown> {
    return this.activityService.createSectionSignoff(
      user,
      params.brotherId,
      params.sectionCode,
      body,
    );
  }
}
