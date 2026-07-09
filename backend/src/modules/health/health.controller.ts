import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { HealthService } from "./health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get("live")
  @ApiOperation({ summary: "Basic health check" })
  getHealth(): { status: string; timestamp: string } {
    return this.healthService.getHealth();
  }

  @Public()
  @Get("ready")
  @ApiOperation({ summary: "Readiness probe including database connectivity" })
  async getReady(): Promise<{ status: string; database: string; timestamp: string }> {
    return this.healthService.getReady();
  }
}
