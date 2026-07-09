import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { DegreeStatus } from "@prisma/client";

export class UpdateDegreeProgressDto {
  @IsEnum(DegreeStatus)
  @IsOptional()
  status?: DegreeStatus;

  @IsString()
  @IsOptional()
  mentorNotes?: string;

  @IsUUID()
  @IsOptional()
  approvedBy?: string;
}
