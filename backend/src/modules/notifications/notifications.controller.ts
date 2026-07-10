import { Controller, Get, Patch, Param } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUser as CurrentUserType } from "../../common/guards/firebase-auth.guard";
import { NotificationsService } from "./notifications.service";
import { MarkReadParamsDto } from "./dto/mark-read.dto";

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: CurrentUserType): Promise<unknown[]> {
    return this.notificationsService.findByUser(user.id);
  }

  @Patch(":id/read")
  async markRead(
    @CurrentUser() user: CurrentUserType,
    @Param() params: MarkReadParamsDto,
  ): Promise<void> {
    return this.notificationsService.markRead(params.id, user.id);
  }
}
