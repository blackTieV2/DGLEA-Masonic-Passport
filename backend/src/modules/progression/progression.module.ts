import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module";
import { ProgressionController } from "./progression.controller";
import { ProgressionService } from "./progression.service";

@Module({
  imports: [NotificationsModule],
  controllers: [ProgressionController],
  providers: [ProgressionService],
})
export class ProgressionModule {}
