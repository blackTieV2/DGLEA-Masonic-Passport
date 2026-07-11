import { PrismaClient } from "@prisma/client";

const dbAvailable = process.env.DB_AVAILABLE === "true";

beforeEach(async () => {
  if (!dbAvailable) return;
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    // Truncate all application tables in dependency order. CASCADE handles remaining FKs.
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE
        "audit_events",
        "notifications",
        "reviews",
        "passport_progress",
        "milestone_templates",
        "passport_sections",
        "passport_templates",
        "mentor_sessions",
        "visitations",
        "ritual_performances",
        "section_signoffs",
        "degree_progress",
        "mentor_assignments",
        "brother_profiles",
        "lodge_profiles",
        "role_assignments",
        "users",
        "lodges",
        "districts",
        "static_reference_pages"
      RESTART IDENTITY CASCADE;
    `);
  } finally {
    await prisma.$disconnect();
  }
});
