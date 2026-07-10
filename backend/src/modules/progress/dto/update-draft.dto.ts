import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateDraftDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  draftNote?: string;
}
