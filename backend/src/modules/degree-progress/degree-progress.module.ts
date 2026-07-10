import { Module } from "@nestjs/common";
import { DegreeProgressController } from "./degree-progress.controller";
import { DegreeProgressService } from "./degree-progress.service";

@Module({
  controllers: [DegreeProgressController],
  providers: [DegreeProgressService],
})
export class DegreeProgressModule {}
