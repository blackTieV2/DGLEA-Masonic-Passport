import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { OrganisationsService } from "./organisations.service";

class ListLodgesQueryDto {
  @IsOptional()
  @IsUUID()
  districtId?: string;
}

@ApiTags("Organisations")
@ApiBearerAuth()
@Controller("organisations")
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get("districts")
  async listDistricts(): Promise<unknown[]> {
    return this.organisationsService.listDistricts();
  }

  @Get("lodges")
  @ApiQuery({ name: "districtId", required: false })
  async listLodges(@Query() query: ListLodgesQueryDto): Promise<unknown[]> {
    return this.organisationsService.listLodges(query.districtId);
  }
}
