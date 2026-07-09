import { Injectable, ForbiddenException } from "@nestjs/common";
import { execSync } from "child_process";

@Injectable()
export class DevService {
  seedReset(nodeEnv: string): { message: string } {
    if (nodeEnv === "production") {
      throw new ForbiddenException("Seed reset is not allowed in production");
    }

    execSync("npx prisma migrate reset --force && tsx prisma/seed.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    return { message: "Database reset and seeded" };
  }
}
