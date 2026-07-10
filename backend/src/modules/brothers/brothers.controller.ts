import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { FirebaseAuthGuard, CurrentUser } from "../../common/guards/firebase-auth.guard";
import { CurrentUser as CurrentUserDecorator } from "../../common/decorators/current-user.decorator";
import { PermissionEvaluator } from "../roles/permission-evaluator.service";
import { PassportService } from "../passport/passport.service";
import { BrothersService } from "./brothers.service";

class BrotherIdParamDto {
  @IsUUID()
  brotherId!: string;
}

@ApiTags("Brothers")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("brothers")
export class BrothersController {
  constructor(
    private readonly brothersService: BrothersService,
    private readonly permissionEvaluator: PermissionEvaluator,
    private readonly passportService: PassportService,
  ) {}

  @Get()
  async listBrothers(
    @CurrentUserDecorator() user: CurrentUser,
  ): Promise<unknown[]> {
    return this.brothersService.listBrothers(user);
  }

  @Get(":brotherId")
  async getBrother(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canViewBrother(user, params.brotherId);
    if (!allowed) {
      throw new ForbiddenException("You do not have permission to view this Brother");
    }

    const brother = await this.brothersService.getBrother(params.brotherId);
    if (!brother) {
      throw new NotFoundException("Brother not found");
    }
    return brother;
  }

  @Get(":brotherId/passport")
  async getBrotherPassport(
    @CurrentUserDecorator() user: CurrentUser,
    @Param() params: BrotherIdParamDto,
  ): Promise<unknown> {
    const allowed = await this.permissionEvaluator.canViewBrother(user, params.brotherId);
    if (!allowed) {
      throw new ForbiddenException("You do not have permission to view this passport");
    }

    return this.passportService.getBrotherPassport(params.brotherId);
  }
}
