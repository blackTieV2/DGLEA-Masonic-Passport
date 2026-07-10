import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { ReviewsService } from "./reviews.service";
import { ReviewDecisionDto } from "./dto/review-decision.dto";
import { ReviewQueueQueryDto } from "./dto/review-queue-query.dto";
import { ProgressIdParamsDto } from "../progress/dto/progress-params.dto";

@ApiTags("Reviews")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("mentor/review-queue")
  async getReviewQueue(
    @CurrentUserDecorator() user: CurrentUser,
    @Query() query: ReviewQueueQueryDto,
  ): Promise<unknown[]> {
    return this.reviewsService.getReviewQueue(user, query.brotherProfileId);
  }

  @Post("progress/:progressId/review")
  async review(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: ProgressIdParamsDto,
    @Body() body: ReviewDecisionDto,
  ): Promise<unknown> {
    return this.reviewsService.review(
      user,
      params.progressId,
      body.decision,
      body.reason,
    );
  }
}
