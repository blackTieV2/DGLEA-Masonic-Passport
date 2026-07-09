import { PrismaClient, Role, Stage, AssignmentType, ProgressStatus, ScopeType, DegreeType, DegreeStatus, ReferenceSection } from "@prisma/client";

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
  await prisma.staticReferencePage.deleteMany();
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

  // Static Passport reference content (Second Edition Revision 1 – May 2026)
  await prisma.staticReferencePage.createMany({
    data: [
      {
        slug: "introduction",
        title: "Introduction",
        section: ReferenceSection.INTRODUCTION,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `This Masonic Passport is designed as a companion for the newly initiated Brother — a guide to accompany him as he begins his journey through Pure Antient Masonry: the Entered Apprentice, Fellow Craft and Master Mason degrees, culminating in the Royal Arch.

The Passport is structured to support the work of the Lodge Mentor and the Personal Mentor. It provides a flexible framework — not a rigid syllabus — so that each Lodge may adapt it to its own character and needs.

Use this Passport alongside Solomon (http://solomon.ugle.org.uk/), the United Grand Lodge of England's online learning platform, to support guided learning and mentoring.`,
      },
      {
        slug: "profile",
        title: "Brother Profile",
        section: ReferenceSection.PROFILE,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `Record your personal and lodge details here:

- Name of Brother
- Nationality
- Mother Lodge and Lodge Number
- Meeting Dates, Time, Place and Dress Code
- Contact Persons for Details
- Lodge Secretary and Lodge Mentor
- Date of Initiation, Passing, Raising and Exaltation
- Proposer and Seconder contact details
- Personal Mentor name and contact
- Date Registered on Solomon

Your mentor, proposer and seconder are ready to walk with you — offering guidance, encouragement and the resources you need to grow in Freemasonry.`,
      },
      {
        slug: "emergency-information",
        title: "Emergency Information for All Brethren",
        section: ReferenceSection.EMERGENCY,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `In cases of extreme emergency, the District Board of Benevolence is authorised to respond rapidly to the needs of a distressed Brother or his family members, or the widow of a dearly departed Brother.

Please contact your Lodge Almoner and/or your Lodge Charity Sub-Committee for full details.

The Medical Advisory Committee assists Brethren who seek a second opinion. The District is fortunate in having a considerable number of medical specialists as members of private lodges under its jurisdiction, and it is these Brethren who have kindly volunteered their services on the committee.

Please contact your Lodge Almoner and/or your Lodge Charity Sub-Committee for full details.`,
      },
      {
        slug: "code-of-conduct",
        title: "Code of Conduct & Membership Expectations",
        section: ReferenceSection.CONDUCT,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Code of Conduct
- Be law-abiding and respectful of the head of state and civil authority.
- Act honestly, courteously and with self-control.
- Keep the traditional signs, tokens and words private.
- Do not debate politics or religion in Lodge meetings.
- Follow your Lodge's lawful rules, customs and instructions.
- Avoid behaviour that would bring discredit on the Lodge; raise concerns with officers.

## Membership Expectations
- Attend meetings when you can and tell officers if you cannot.
- Meet reasonable financial and time commitments within your means.
- Learn and accept guidance from your Sponsor and Personal Mentor.
- Take part respectfully in ceremonies, rehearsals and social events.
- Keep Lodge business confidential.
- Support Lodge charity work as you are able.
- Expect to progress through degrees; discuss any role expectations with your Mentor.

This summary does not supersede the UGLE Book of Constitutions, DGLEA or local Lodge bylaws. Source: Solomon — http://solomon.ugle.org.uk/`,
      },
      {
        slug: "fees-and-subscriptions",
        title: "Lodge Fees and Subscriptions",
        section: ReferenceSection.FEES,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `Record your lodge financial commitments here:

1. District Dues — Date Payable
2. Lodge Dues — Date Payable
3. Other Dues — Date Payable

Please refer to your Lodge Treasurer for details of dues and payments.

You are welcome at the Lodge. If mobility or other challenges make access difficult, please do not hesitate to let your Personal Mentor or Lodge Mentor know. They will work with you to find a way.`,
      },
      {
        slug: "getting-to-know-the-brethren",
        title: "Getting to Know the Brethren",
        section: ReferenceSection.BRETHREN,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `When you first enter a Lodge, the faces around you may feel unfamiliar. That is normal. Every Brother was once where you are now.

Some of those faces belong to Brethren who will guide you through your initiation. Others will become friends, teachers, or simply quiet companions along the way. Getting to know them — their names, their roles, their stories — is not a task to check off. It is how you begin to belong.

Use this page to write down who they are:

- Worshipful Master
- Senior Warden, Junior Warden
- Chaplain, Treasurer, Secretary
- Director of Ceremonies, Almoner, Charity Steward, Membership Officer, Mentor
- Senior Deacon, Junior Deacon, Assistant Director of Ceremonies
- Organist, Assistant Secretary, Inner Guard, Stewards, Tyler`,
      },
      {
        slug: "entered-apprentice",
        title: "Entered Apprentice",
        section: ReferenceSection.ENTERED_APPRENTICE,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Learning Outcomes
- View the "Welcome Apprentice" Solomon module, a 10-minute video that explains your initiation ceremony.
- Explain the meaning and symbolism of the First Degree.
- Reconfirm grip and word, working tools, and practice salutes.
- Learn questions and answers for passing.
- Learn lodge bylaws and support for Brethren.
- Arrange a visit to a First Degree with debriefing.

## Area of Guidance
- Learn about officers, jewels, collars, aprons and lodge furniture.
- Read summons, agenda, ballots and notices of motion.
- Learn about conduct of business in lodge.
- Introduction to Charity (masonic and non-masonic).

Record mentor sessions, visitations and ceremonies performed in your Passport.`,
      },
      {
        slug: "fellow-craft",
        title: "Fellow Craft",
        section: ReferenceSection.FELLOW_CRAFT,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Learning Outcomes
- Explain meaning and symbolism of the Second Degree.
- Reconfirm grip and word, working tools, practice salutes and tracing board.
- Learn questions and answers for raising.
- Lodge layout and furniture, movable and immovable jewels, pedestal, gavels, carpet, letter G, and Lodge banner.

## Area of Guidance
- Explain lodge history, mother lodge and lodge milestones.
- Lodge special functions, e.g. Ladies Night, festivals, etc.
- Discuss Masonic etiquette, Masonic toasts, dress and demeanour.
- May visit other constitutions with Mentor; with debrief.

Record mentor sessions, visitations and ceremonies performed in your Passport.`,
      },
      {
        slug: "master-mason-and-beyond",
        title: "Master Mason and Beyond",
        section: ReferenceSection.MASTER_MASON,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Learning Outcomes
- Explain meaning and symbolism of the Third Degree.
- Reconfirm grip and word, working tools and practice salutes.
- Ceremony Book.
- Understand DGLEA and District structure.
- Introduction of HRAC and how to join.
- Awareness of other appendant degrees.

## Area of Guidance
- Understand the role of District and Grand Lodge.
- Visiting other Constitutions, especially Third Degree, with debrief.
- Understand the function of the District Board of Benevolence and the District Board of General Purposes.

Record mentor sessions, visitations and ceremonies performed in your Passport.`,
      },
      {
        slug: "preparing-for-exaltation",
        title: "Preparing for Exaltation into the Royal Arch",
        section: ReferenceSection.ROYAL_ARCH,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Learning Objectives
- Understand the relationship between the Craft Third Degree and the Holy Royal Arch, and why the Royal Arch is regarded as the completion of the Third Degree.
- Understand the historical and symbolic background of the Royal Arch story as it relates to Solomon's Temple, the Vault and the discovery of the Volume of the Sacred Law.
- Demonstrate basic familiarity with Chapter etiquette and practice, including attendance expectations, purchase of basic personal regalia and other requirements by the District and Chapter.

## Area of Guidance
- "From Darkness into Light" — concise paper on the Royal Arch allegory and how it completes the Third Degree (search RP0119422-105).
- Solomon articles: "What is the Royal Arch about?" and "What is the difference between Craft and Royal Arch Masonry?"

Record Chapter details, date of exaltation, Chapter Mentor and Scribe E contact details in your Passport.`,
      },
      {
        slug: "consolidation",
        title: "Consolidation Page",
        section: ReferenceSection.CONSOLIDATION,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `Use this page to record your overall progress across degrees:

| Degree | Total Mentoring Sessions | Total Visitations | Number of Ceremonies |
|--------|--------------------------|-------------------|----------------------|
| Entered Apprentice | | | |
| Fellow Craft | | | |
| Master Mason | | | |
| **TOTAL** | | | |

This summary helps you and your Mentor see how your practical experience is building alongside your learning.`,
      },
      {
        slug: "officer-jewels",
        title: "Officer Jewels",
        section: ReferenceSection.OFFICER_JEWELS,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `Reference list of principal officer jewels:

- **Worshipful Master** — The square.
- **Senior Warden** — The level.
- **Junior Warden** — The plumb rule.
- **Past Master** — The square and the diagram of the 47th proposition of the 1st Book of Euclid engraven on a silver plate, pendant within it.
- **Chaplain** — A book on a triangle surmounting a glory.
- **Treasurer** — A key.
- **Secretary** — Two pens in saltire, tied by a ribbon.
- **Director of Ceremonies** — Two rods in saltire, tied by a ribbon.
- **Membership Officer** — A Lewis.
- **Mentor** — Two chisels in saltire.
- **Deacons** — Dove and olive branch.
- **Assistant Director of Ceremonies** — Two rods in saltire, surmounted by a bar bearing the word "Assistant".
- **Almoner** — A scrip-purse, upon which is a heart.
- **Charity Steward** — A trowel.
- **Organist** — A lyre.
- **Assistant Secretary** — Two pens in saltire, surmounted by a bar bearing the word "Assistant".
- **Inner Guard** — Two swords in saltire.
- **Steward** — A cornucopia between the legs of a pair of compasses extended.
- **Tyler** — A sword.`,
      },
      {
        slug: "opening-and-closing-odes",
        title: "Opening and Closing Odes",
        section: ReferenceSection.ODES,
        orderIndex: 1,
        sourceEdition: "Second Edition Revision 1 – May 2026",
        contentMarkdown: `## Opening Ode

Hail! Eternal by whose aid  
All created things were made  
Heaven & Earth Thy vast design  
Hear us Architect Divine

May our work begun in Thee  
Ever blessed with order be  
And may we when labours cease  
Part in harmony and peace

By their glorious Majesty  
By the trust we place in Thee  
By the badge and mystic sign  
Hear us Architect Divine

## Closing Ode

Now the evening shadows closing  
Worn from toil to peaceful rest  
Mystic arts and rites reposing  
Sacred in each faithful breast

God of Light whose love unceasing  
Doth to all Thy works extend  
Crown our order with Thy blessing  
Build, sustain us to the end

Humbly now we bow before Thee  
Grateful for Thine aid Divine  
Everlasting power and glory  
Mighty Architect be Thine`,
      },
    ],
  });

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
