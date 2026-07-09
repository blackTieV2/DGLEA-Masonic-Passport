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
import { DegreeProgressService } from "./degree-progress.service";
import { CreateDegreeProgressDto } from "./dto/create-degree-progress.dto";
import { UpdateDegreeProgressDto } from "./dto/update-degree-progress.dto";

@ApiTags("Degree Progress")
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller("degree-progress")
export class DegreeProgressController {
  constructor(private readonly degreeProgressService: DegreeProgressService) {}

  @Post()
  create(@Body() dto: CreateDegreeProgressDto) {
    return this.degreeProgressService.create(dto);
  }

  @Get()
  findAll() {
    return this.degreeProgressService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.degreeProgressService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateDegreeProgressDto) {
    return this.degreeProgressService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.degreeProgressService.remove(id);
  }
}
