import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { UsersService } from "./users.service";

class UserIdParamDto {
  @IsUUID()
  id!: string;
}

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async findById(@Param() params: UserIdParamDto): Promise<unknown> {
    return this.usersService.findById(params.id);
  }
}
