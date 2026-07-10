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
import { BrotherProfilesService } from "./brother-profiles.service";
import { CreateBrotherProfileDto } from "./dto/create-brother-profile.dto";
import { UpdateBrotherProfileDto } from "./dto/update-brother-profile.dto";

@ApiTags("Brother Profiles")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("brother-profiles")
export class BrotherProfilesController {
  constructor(private readonly brotherProfilesService: BrotherProfilesService) {}

  @Post()
  create(@Body() dto: CreateBrotherProfileDto) {
    return this.brotherProfilesService.create(dto);
  }

  @Get()
  findAll() {
    return this.brotherProfilesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.brotherProfilesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateBrotherProfileDto) {
    return this.brotherProfilesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.brotherProfilesService.remove(id);
  }
}
