import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PassportService } from "./passport.service";

@ApiTags("Passport")
@ApiBearerAuth()
@Controller("passport")
export class PassportController {
  constructor(private readonly passportService: PassportService) {}

  @Get("templates/current")
  async getCurrentTemplate(): Promise<unknown> {
    return this.passportService.getCurrentTemplate();
  }
}
