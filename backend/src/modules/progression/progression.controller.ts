import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { ProgressionService } from "./progression.service";
import { StageTransitionDto } from "./dto/stage-transition.dto";

class BrotherIdParamDto {
  @IsUUID()
  brotherId!: string;
}

@ApiTags("Progression")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("brothers/:brotherId")
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Post("stage-transition")
  async transitionStage(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamDto,
    @Body() body: StageTransitionDto,
  ): Promise<unknown> {
    return this.progressionService.transitionStage(user, params.brotherId, body);
  }
}
