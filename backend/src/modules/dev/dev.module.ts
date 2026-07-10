import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DevController } from "./dev.controller";
import { DevService } from "./dev.service";

@Module({
  imports: [ConfigModule],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
