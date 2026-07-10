import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CurrentUser as CurrentUserType } from "../../common/guards/firebase-auth.guard";
import { AuthService, MeProfile } from "./auth.service";
import { PassportService } from "../passport/passport.service";

@ApiTags("Auth")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passportService: PassportService,
  ) {}

  @Get("me")
  async getMe(@CurrentUser() user: CurrentUserType): Promise<MeProfile> {
    return this.authService.getMe(user.id);
  }

  @Get("me/passport")
  async getMyPassport(@CurrentUser() user: CurrentUserType): Promise<unknown> {
    const profile = await this.authService.getMe(user.id);
    if (!profile.brotherProfileId) {
      return { profile: null, template: null, progress: [], signoffs: [] };
    }
    return this.passportService.getBrotherPassport(profile.brotherProfileId);
  }
}
