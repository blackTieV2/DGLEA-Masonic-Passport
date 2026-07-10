import { IsEnum, IsOptional, IsString } from "class-validator";
import { DegreeStatus } from "@prisma/client";

export class UpdateDegreeProgressDto {
  @IsEnum(DegreeStatus)
  @IsOptional()
  status?: DegreeStatus;

  @IsString()
  @IsOptional()
  mentorNotes?: string;
}
