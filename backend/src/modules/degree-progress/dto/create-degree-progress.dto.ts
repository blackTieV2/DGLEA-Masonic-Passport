import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { DegreeType, DegreeStatus } from "@prisma/client";

export class CreateDegreeProgressDto {
  @IsUUID()
  brotherProfileId!: string;

  @IsEnum(DegreeType)
  degreeType!: DegreeType;

  @IsEnum(DegreeStatus)
  @IsOptional()
  status?: DegreeStatus;

  @IsString()
  @IsOptional()
  mentorNotes?: string;
}
