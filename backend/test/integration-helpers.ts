import { PrismaClient, Role, ScopeType, DegreeType, DegreeStatus, Stage } from "@prisma/client";
import { CurrentUser } from "../src/common/guards/firebase-auth.guard";

export interface TestFixtures {
  districtId: string;
  lodgeId: string;
  brotherUserId: string;
  brotherProfileId: string;
  lodgeMentorUserId: string;
  personalMentorUserId: string;
}

export async function createTestFixtures(prisma: PrismaClient): Promise<TestFixtures> {
  const district = await prisma.district.create({
    data: { name: "Test District", active: true },
  });

  const lodge = await prisma.lodge.create({
    data: {
      districtId: district.id,
      lodgeName: "Test Lodge",
      lodgeNumber: "TL-001",
      meetingLocation: "Test Location",
      active: true,
    },
  });

  const brotherUser = await prisma.user.create({
    data: {
      firebaseUid: "test-brother",
      displayName: "Test Brother",
      email: "brother@example.local",
      status: "ACTIVE",
    },
  });

  const brotherProfile = await prisma.brotherProfile.create({
    data: {
      userId: brotherUser.id,
      lodgeId: lodge.id,
      currentStage: Stage.ENTERED_APPRENTICE,
    },
  });

  const lodgeMentorUser = await prisma.user.create({
    data: {
      firebaseUid: "test-lodge-mentor",
      displayName: "Test Lodge Mentor",
      email: "lodge.mentor@example.local",
      status: "ACTIVE",
    },
  });

  await prisma.roleAssignment.create({
    data: {
      userId: lodgeMentorUser.id,
      role: Role.LODGE_MENTOR,
      scopeType: ScopeType.LODGE,
      scopeId: lodge.id,
    },
  });

  const personalMentorUser = await prisma.user.create({
    data: {
      firebaseUid: "test-personal-mentor",
      displayName: "Test Personal Mentor",
      email: "personal.mentor@example.local",
      status: "ACTIVE",
    },
  });

  await prisma.roleAssignment.create({
    data: {
      userId: personalMentorUser.id,
      role: Role.PERSONAL_MENTOR,
      scopeType: ScopeType.GLOBAL,
    },
  });

  await prisma.mentorAssignment.create({
    data: {
      brotherProfileId: brotherProfile.id,
      mentorUserId: personalMentorUser.id,
      assignmentType: "PERSONAL_MENTOR",
    },
  });

  return {
    districtId: district.id,
    lodgeId: lodge.id,
    brotherUserId: brotherUser.id,
    brotherProfileId: brotherProfile.id,
    lodgeMentorUserId: lodgeMentorUser.id,
    personalMentorUserId: personalMentorUser.id,
  };
}

export function asUser(userId: string, roles: CurrentUser["roles"]): CurrentUser {
  return {
    id: userId,
    email: "test@example.local",
    displayName: "Test User",
    roles,
  };
}

export async function createDegreeProgress(
  prisma: PrismaClient,
  brotherProfileId: string,
  degreeType: DegreeType = DegreeType.ENTERED_APPRENTICE,
  status: DegreeStatus = DegreeStatus.NOT_STARTED,
) {
  return prisma.degreeProgress.create({
    data: {
      brotherProfileId,
      degreeType,
      status,
    },
  });
}
