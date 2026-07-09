import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module";
import { ProgressController } from "./progress.controller";
import { ProgressService } from "./progress.service";

@Module({
  imports: [NotificationsModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
