import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { MentorshipService } from "./mentorship.service";
import { CreateMentorAssignmentDto } from "./dto/create-mentor-assignment.dto";

class BrotherIdParamDto {
  @IsUUID()
  brotherId!: string;
}

@ApiTags("Mentorship")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("brothers/:brotherId/mentor-assignments")
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  @Post()
  async assignMentor(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamDto,
    @Body() body: CreateMentorAssignmentDto,
  ): Promise<unknown> {
    return this.mentorshipService.assignMentor(user, params.brotherId, body);
  }
}
