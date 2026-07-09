import { Module } from "@nestjs/common";
import { LodgeProfilesController } from "./lodge-profiles.controller";
import { LodgeProfilesService } from "./lodge-profiles.service";

@Module({
  controllers: [LodgeProfilesController],
  providers: [LodgeProfilesService],
})
export class LodgeProfilesModule {}
