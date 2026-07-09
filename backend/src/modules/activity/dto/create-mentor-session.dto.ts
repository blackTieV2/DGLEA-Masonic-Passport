import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateMentorSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sectionCode?: string;

  @IsDateString()
  sessionDate!: string;

  @IsString()
  @MaxLength(2000)
  topicsSummary!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  nextActions?: string;

  @IsOptional()
  @IsBoolean()
  isPrivateNote?: boolean;
}
