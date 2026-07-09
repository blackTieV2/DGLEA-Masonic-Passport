import { Module } from "@nestjs/common";
import { PassportModule } from "../passport/passport.module";
import { BrothersController } from "./brothers.controller";
import { BrothersService } from "./brothers.service";

@Module({
  imports: [PassportModule],
  controllers: [BrothersController],
  providers: [BrothersService],
})
export class BrothersModule {}
