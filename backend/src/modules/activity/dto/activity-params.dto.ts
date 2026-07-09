import { IsUUID, IsString } from "class-validator";

export class BrotherIdParamsDto {
  @IsUUID()
  brotherId!: string;
}

export class SectionCodeParamsDto {
  @IsUUID()
  brotherId!: string;

  @IsString()
  sectionCode!: string;
}
