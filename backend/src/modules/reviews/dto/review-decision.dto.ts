import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ReviewDecision } from "@prisma/client";

export class ReviewDecisionDto {
  @IsEnum(ReviewDecision)
  decision!: ReviewDecision;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
