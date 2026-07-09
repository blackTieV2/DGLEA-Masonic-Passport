import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { LodgeProfilesService } from "./lodge-profiles.service";
import { CreateLodgeProfileDto } from "./dto/create-lodge-profile.dto";
import { UpdateLodgeProfileDto } from "./dto/update-lodge-profile.dto";

@ApiTags("Lodge Profiles")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("lodge-profiles")
export class LodgeProfilesController {
  constructor(private readonly lodgeProfilesService: LodgeProfilesService) {}

  @Post()
  create(@Body() dto: CreateLodgeProfileDto) {
    return this.lodgeProfilesService.create(dto);
  }

  @Get()
  findAll() {
    return this.lodgeProfilesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.lodgeProfilesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateLodgeProfileDto) {
    return this.lodgeProfilesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.lodgeProfilesService.remove(id);
  }
}
