import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSectionSignoffDto {
  @IsDateString()
  signedAt!: string;

  @IsString()
  @MaxLength(100)
  outcome!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
