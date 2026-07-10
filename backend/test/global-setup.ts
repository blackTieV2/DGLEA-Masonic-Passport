import { PrismaClient } from "@prisma/client";

export default async function globalSetup(): Promise<void> {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    process.env.DATABASE_URL_TEST ??
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@127.0.0.1:5432/dglea_passport_test";

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
