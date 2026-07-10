import {
  Controller,
  Patch,
  Post,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { ProgressService } from "./progress.service";
import { UpdateDraftDto } from "./dto/update-draft.dto";
import { ClarificationResponseDto } from "./dto/clarification-response.dto";
import { ProgressIdParamsDto } from "./dto/progress-params.dto";

@ApiTags("Progress")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch(":progressId/draft")
  async updateDraft(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: ProgressIdParamsDto,
    @Body() body: UpdateDraftDto,
  ): Promise<unknown> {
    return this.progressService.updateDraft(user, params.progressId, body.draftNote);
  }

  @Post(":progressId/submit")
  async submit(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: ProgressIdParamsDto,
  ): Promise<unknown> {
    return this.progressService.submit(user, params.progressId);
  }

  @Post(":progressId/clarification-response")
  async clarificationResponse(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: ProgressIdParamsDto,
    @Body() body: ClarificationResponseDto,
  ): Promise<unknown> {
    return this.progressService.clarificationResponse(user, params.progressId, body.response);
  }
}
