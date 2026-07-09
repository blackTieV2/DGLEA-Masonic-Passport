import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUser as CurrentUserType } from "../../common/guards/firebase-auth.guard";
import { DegreeProgressService } from "./degree-progress.service";
import { CreateDegreeProgressDto } from "./dto/create-degree-progress.dto";
import { UpdateDegreeProgressDto } from "./dto/update-degree-progress.dto";
import { ReadyForSignOffDegreeProgressDto } from "./dto/ready-for-sign-off-degree-progress.dto";
import { ApproveDegreeProgressDto } from "./dto/approve-degree-progress.dto";
import { ReopenDegreeProgressDto } from "./dto/reopen-degree-progress.dto";

@ApiTags("Degree Progress")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("degree-progress")
export class DegreeProgressController {
  constructor(private readonly degreeProgressService: DegreeProgressService) {}

  @Post()
  create(
    @Body() dto: CreateDegreeProgressDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.degreeProgressService.create(dto, user);
  }

  @Get()
  findAll() {
    return this.degreeProgressService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.degreeProgressService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateDegreeProgressDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.degreeProgressService.update(id, dto, user);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.degreeProgressService.remove(id);
  }

  @Patch(":id/ready-for-sign-off")
  readyForSignOff(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() _dto: ReadyForSignOffDegreeProgressDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.degreeProgressService.readyForSignOff(id, user);
  }

  @Patch(":id/approve")
  approve(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ApproveDegreeProgressDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.degreeProgressService.approve(id, dto, user);
  }

  @Patch(":id/reopen")
  reopen(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() _dto: ReopenDegreeProgressDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.degreeProgressService.reopen(id, user);
  }
}
