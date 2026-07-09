import { IsUUID } from "class-validator";

export class MarkReadParamsDto {
  @IsUUID()
  id!: string;
}
