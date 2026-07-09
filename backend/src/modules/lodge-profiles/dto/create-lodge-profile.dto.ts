import { IsOptional, IsString } from "class-validator";

export class CreateLodgeProfileDto {
  @IsString()
  lodgeName!: string;

  @IsString()
  lodgeNumber!: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  meetingLocation?: string;

  @IsString()
  @IsOptional()
  secretaryContact?: string;
}
