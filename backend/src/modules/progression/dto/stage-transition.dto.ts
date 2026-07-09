import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { Stage } from "@prisma/client";

export class StageTransitionDto {
  @IsEnum(Stage)
  targetStage!: Stage;

  @IsOptional()
  @IsDateString()
  dateInitiated?: string;

  @IsOptional()
  @IsDateString()
  datePassed?: string;

  @IsOptional()
  @IsDateString()
  dateRaised?: string;
}
