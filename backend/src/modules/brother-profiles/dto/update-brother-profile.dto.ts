import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { Stage } from "@prisma/client";

export class UpdateBrotherProfileDto {
  @IsUUID()
  @IsOptional()
  lodgeId?: string;

  @IsEnum(Stage)
  @IsOptional()
  currentStage?: Stage;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  preferredName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
