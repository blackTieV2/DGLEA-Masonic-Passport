import { PrismaClient } from "@prisma/client";

export default async function globalSetup(): Promise<void> {
  process.env.NODE_ENV = "test";

  const testDbUrl = process.env.DATABASE_URL_TEST;
  if (!testDbUrl) {
    // eslint-disable-next-line no-console
    console.warn("Integration tests skipped: DATABASE_URL_TEST is not set.");
    process.env.DB_AVAILABLE = "false";
    return;
  }

  process.env.DATABASE_URL = testDbUrl;

  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    process.env.DB_AVAILABLE = "true";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.warn(`Integration tests skipped: test database unreachable. ${message}`);
    process.env.DB_AVAILABLE = "false";
  }
}
