import { Module } from "@nestjs/common";
import { ReferencePagesController } from "./reference-pages.controller";
import { ReferencePagesService } from "./reference-pages.service";

@Module({
  controllers: [ReferencePagesController],
  providers: [ReferencePagesService],
})
export class ReferencePagesModule {}
