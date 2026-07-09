import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { DevService } from "./dev.service";

@ApiTags("Dev")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("dev")
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly configService: ConfigService,
  ) {}

  @Post("seed-reset")
  seedReset(@CurrentUserDecorator() _user: CurrentUser): { message: string } {
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    return this.devService.seedReset(nodeEnv);
  }
}
