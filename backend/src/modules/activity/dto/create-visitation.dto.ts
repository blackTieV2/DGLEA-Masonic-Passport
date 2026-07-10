import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateVisitationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sectionCode?: string;

  @IsString()
  @MaxLength(200)
  lodgeVisited!: string;

  @IsDateString()
  visitDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  degreeObserved?: string;

  @IsOptional()
  @IsBoolean()
  debriefCompleted?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reflection?: string;
}
