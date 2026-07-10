import { IsUUID } from "class-validator";

export class ProgressIdParamsDto {
  @IsUUID()
  progressId!: string;
}
