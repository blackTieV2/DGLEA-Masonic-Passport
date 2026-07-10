import { IsString, MaxLength } from "class-validator";

export class ClarificationResponseDto {
  @IsString()
  @MaxLength(4000)
  response!: string;
}
