import { Module } from "@nestjs/common";
import { BrotherProfilesController } from "./brother-profiles.controller";
import { BrotherProfilesService } from "./brother-profiles.service";

@Module({
  controllers: [BrotherProfilesController],
  providers: [BrotherProfilesService],
})
export class BrotherProfilesModule {}
