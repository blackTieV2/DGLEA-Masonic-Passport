import { IsOptional, IsString } from "class-validator";

export class UpdateLodgeProfileDto {
  @IsString()
  @IsOptional()
  lodgeName?: string;

  @IsString()
  @IsOptional()
  lodgeNumber?: string;

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
