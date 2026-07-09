import { IsEnum, IsUUID } from "class-validator";
import { AssignmentType } from "@prisma/client";

export class CreateMentorAssignmentDto {
  @IsUUID()
  mentorUserId!: string;

  @IsEnum(AssignmentType)
  assignmentType!: AssignmentType;
}
