import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRitualPerformanceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sectionCode?: string;

  @IsDateString()
  ritualDate!: string;

  @IsString()
  @MaxLength(500)
  ritualLabel!: string;
}
