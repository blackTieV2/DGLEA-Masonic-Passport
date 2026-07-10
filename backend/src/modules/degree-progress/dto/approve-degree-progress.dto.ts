import { IsOptional, IsString } from "class-validator";

export class ApproveDegreeProgressDto {
  @IsString()
  @IsOptional()
  approvalNotes?: string;
}
