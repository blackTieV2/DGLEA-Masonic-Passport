import { PrismaClient, Role, Stage, AssignmentType, ProgressStatus, ScopeType, DegreeType, DegreeStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seeding is not allowed in production.");
  }

  // Clear existing data in dependency order
  await prisma.auditEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.degreeProgress.deleteMany();
  await prisma.passportProgress.deleteMany();
  await prisma.milestoneTemplate.deleteMany();
  await prisma.passportSection.deleteMany();
  await prisma.passportTemplate.deleteMany();
  await prisma.mentorSession.deleteMany();
  await prisma.visitation.deleteMany();
  await prisma.ritualPerformance.deleteMany();
  await prisma.sectionSignoff.deleteMany();
  await prisma.mentorAssignment.deleteMany();
  await prisma.brotherProfile.deleteMany();
  await prisma.lodgeProfile.deleteMany();
  await prisma.roleAssignment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.lodge.deleteMany();
  await prisma.district.deleteMany();

  const district = await prisma.district.create({
    data: {
      name: "District Grand Lodge of the Eastern Archipelago",
      active: true,
    },
  });

  const lodge1 = await prisma.lodge.create({
    data: {
      districtId: district.id,
      lodgeName: "Singapore Lodge",
      lodgeNumber: "L-001",
      meetingLocation: "Singapore",
      active: true,
    },
  });

  const lodge2 = await prisma.lodge.create({
    data: {
      districtId: district.id,
      lodgeName: "Penang Lodge",
      lodgeNumber: "L-002",
      meetingLocation: "Penang",
      active: true,
    },
  });

  // Passport-visible lodge profiles
  await prisma.lodgeProfile.createMany({
    data: [
      {
        lodgeName: lodge1.lodgeName,
        lodgeNumber: lodge1.lodgeNumber,
        district: district.name,
        meetingLocation: lodge1.meetingLocation,
        secretaryContact: "secretary.l001@example.local",
      },
      {
        lodgeName: lodge2.lodgeName,
        lodgeNumber: lodge2.lodgeNumber,
        district: district.name,
        meetingLocation: lodge2.meetingLocation,
        secretaryContact: "secretary.l002@example.local",
      },
    ],
  });

  const brotherEa = await prisma.user.create({
    data: {
      firebaseUid: "dev-brother-ea",
      displayName: "Brother EA",
      email: "brother.ea@example.local",
      status: "ACTIVE",
    },
  });

  const brotherFc = await prisma.user.create({
    data: {
      firebaseUid: "dev-brother-fc",
      displayName: "Brother FC",
      email: "brother.fc@example.local",
      status: "ACTIVE",
    },
  });

  const brotherMm = await prisma.user.create({
    data: {
      firebaseUid: "dev-brother-mm",
      displayName: "Brother MM",
      email: "brother.mm@example.local",
      status: "ACTIVE",
    },
  });

  const personalMentor = await prisma.user.create({
    data: {
      firebaseUid: "dev-personal-mentor",
      displayName: "Personal Mentor",
      email: "personal.mentor@example.local",
      status: "ACTIVE",
    },
  });

  const lodgeMentor = await prisma.user.create({
    data: {
      firebaseUid: "dev-lodge-mentor",
      displayName: "Lodge Mentor",
      email: "lodge.mentor@example.local",
      status: "ACTIVE",
    },
  });

  const districtMentor = await prisma.user.create({
    data: {
      firebaseUid: "dev-district-mentor",
      displayName: "District Mentor",
      email: "district.mentor@example.local",
      status: "ACTIVE",
    },
  });

  const districtAdmin = await prisma.user.create({
    data: {
      firebaseUid: "dev-district-admin",
      displayName: "District Admin",
      email: "district.admin@example.local",
      status: "ACTIVE",
    },
  });

  await prisma.roleAssignment.createMany({
    data: [
      { userId: brotherEa.id, role: Role.BROTHER, scopeType: ScopeType.GLOBAL },
      { userId: brotherFc.id, role: Role.BROTHER, scopeType: ScopeType.GLOBAL },
      { userId: brotherMm.id, role: Role.BROTHER, scopeType: ScopeType.GLOBAL },
      { userId: personalMentor.id, role: Role.PERSONAL_MENTOR, scopeType: ScopeType.GLOBAL },
      { userId: lodgeMentor.id, role: Role.LODGE_MENTOR, scopeType: ScopeType.LODGE, scopeId: lodge1.id },
      { userId: districtMentor.id, role: Role.DISTRICT_MENTOR, scopeType: ScopeType.DISTRICT, scopeId: district.id },
      { userId: districtAdmin.id, role: Role.DISTRICT_ADMIN, scopeType: ScopeType.DISTRICT, scopeId: district.id },
    ],
  });

  const profileEa = await prisma.brotherProfile.create({
    data: {
      userId: brotherEa.id,
      lodgeId: lodge1.id,
      currentStage: Stage.ENTERED_APPRENTICE,
      dateInitiated: new Date("2025-01-15"),
    },
  });

  const profileFc = await prisma.brotherProfile.create({
    data: {
      userId: brotherFc.id,
      lodgeId: lodge1.id,
      currentStage: Stage.FELLOW_CRAFT,
      dateInitiated: new Date("2024-06-10"),
      datePassed: new Date("2025-02-20"),
    },
  });

  const profileMm = await prisma.brotherProfile.create({
    data: {
      userId: brotherMm.id,
      lodgeId: lodge2.id,
      currentStage: Stage.MASTER_MASON,
      dateInitiated: new Date("2023-03-05"),
      datePassed: new Date("2023-09-12"),
      dateRaised: new Date("2024-04-18"),
    },
  });

  await prisma.mentorAssignment.createMany({
    data: [
      { brotherProfileId: profileEa.id, mentorUserId: personalMentor.id, assignmentType: AssignmentType.PERSONAL_MENTOR },
      { brotherProfileId: profileFc.id, mentorUserId: personalMentor.id, assignmentType: AssignmentType.PERSONAL_MENTOR },
      { brotherProfileId: profileMm.id, mentorUserId: personalMentor.id, assignmentType: AssignmentType.PERSONAL_MENTOR },
    ],
  });

  // Initial degree progress rows for each Brother
  await prisma.degreeProgress.createMany({
    data: [
      {
        brotherProfileId: profileEa.id,
        degreeType: DegreeType.ENTERED_APPRENTICE,
        status: DegreeStatus.READY_FOR_SIGN_OFF,
        mentorNotes: "Started EA journey.",
        submittedAt: new Date("2026-06-01"),
        submittedBy: brotherEa.id,
      },
      {
        brotherProfileId: profileFc.id,
        degreeType: DegreeType.FELLOW_CRAFT,
        status: DegreeStatus.IN_PROGRESS,
        mentorNotes: "Started FC journey.",
      },
      {
        brotherProfileId: profileMm.id,
        degreeType: DegreeType.MASTER_MASON,
        status: DegreeStatus.SIGNED_OFF,
        approvedBy: lodgeMentor.id,
        approvedAt: new Date("2024-04-20"),
      },
      {
        brotherProfileId: profileMm.id,
        degreeType: DegreeType.ROYAL_ARCH_PREPARATION,
        status: DegreeStatus.NOT_STARTED,
      },
    ],
  });

  const template = await prisma.passportTemplate.create({
    data: {
      version: "1.0.0",
      sourceReference: "DGLEA-PP-2026-001",
      activeFrom: new Date("2026-01-01"),
      active: true,
      sections: {
        create: [
          {
            code: "ENTERED_APPRENTICE",
            title: "Entered Apprentice",
            sortOrder: 1,
            unlockStage: Stage.ENTERED_APPRENTICE,
            milestoneTemplates: {
              create: [
                { title: "Review permitted First Degree learning topics with mentor", category: "learning", sortOrder: 1 },
                { title: "Discuss working tools at a high level", category: "learning", sortOrder: 2 },
                { title: "Prepare approved questions and answers with mentor", category: "preparation", sortOrder: 3 },
                { title: "Record visit and mentor debrief", category: "activity", sortOrder: 4, targetCount: 3 },
              ],
            },
          },
          {
            code: "FELLOW_CRAFT",
            title: "Fellow Craft",
            sortOrder: 2,
            unlockStage: Stage.FELLOW_CRAFT,
            milestoneTemplates: {
              create: [
                { title: "Review permitted Second Degree learning topics with mentor", category: "learning", sortOrder: 1 },
                { title: "Discuss further working tools at a high level", category: "learning", sortOrder: 2 },
                { title: "Record visit and mentor debrief", category: "activity", sortOrder: 3, targetCount: 3 },
              ],
            },
          },
          {
            code: "MASTER_MASON",
            title: "Master Mason and Beyond",
            sortOrder: 3,
            unlockStage: Stage.MASTER_MASON,
            milestoneTemplates: {
              create: [
                { title: "Review permitted Third Degree learning topics with mentor", category: "learning", sortOrder: 1 },
                { title: "Understand DGLEA structure and visiting", category: "district", sortOrder: 2 },
                { title: "Record visit and mentor debrief", category: "activity", sortOrder: 3, targetCount: 3 },
              ],
            },
          },
          {
            code: "PREPARING_FOR_OFFICE",
            title: "Preparing for Office",
            sortOrder: 4,
            unlockStage: Stage.PREPARING_FOR_OFFICE,
            milestoneTemplates: {
              create: [
                { title: "Learn role of Lodge Officers", category: "officership", sortOrder: 1 },
                { title: "Readiness for Steward or Inner Guard", category: "officership", sortOrder: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const milestones = await prisma.milestoneTemplate.findMany();

  async function createProgressForProfile(profileId: string, stage: Stage): Promise<void> {
    const section = await prisma.passportSection.findFirst({
      where: { templateId: template.id, code: stage },
    });
    if (!section) return;

    const sectionMilestones = milestones.filter((m) => m.sectionId === section.id);
    for (const milestone of sectionMilestones) {
      await prisma.passportProgress.create({
        data: {
          brotherProfileId: profileId,
          milestoneTemplateId: milestone.id,
          status: ProgressStatus.NOT_STARTED,
        },
      });
    }
  }

  await createProgressForProfile(profileEa.id, Stage.ENTERED_APPRENTICE);
  await createProgressForProfile(profileFc.id, Stage.FELLOW_CRAFT);
  await createProgressForProfile(profileMm.id, Stage.MASTER_MASON);

  // eslint-disable-next-line no-console
  console.log("Seed completed.", {
    district: district.id,
    lodges: [lodge1.id, lodge2.id],
    template: template.id,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
