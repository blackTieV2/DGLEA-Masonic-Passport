import { IsOptional, IsUUID } from "class-validator";

export class ReviewQueueQueryDto {
  @IsOptional()
  @IsUUID()
  brotherProfileId?: string;
}
