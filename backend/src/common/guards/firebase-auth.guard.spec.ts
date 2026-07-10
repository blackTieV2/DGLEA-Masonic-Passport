import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { FirebaseAuthGuard } from "./firebase-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

describe("FirebaseAuthGuard", () => {
  it("prefers the dev firebase uid header over the fallback dev auth user", async () => {
    const request: any = {
      headers: {
        authorization: "Bearer ignored",
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const prisma = {
      user: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.firebaseUid === "dev-brother-ea") {
            return Promise.resolve({
              id: "user-from-header",
              email: "brother@example.local",
              displayName: "Brother",
              roleAssignments: [],
            });
          }

          if (where.id === "fallback-user") {
            return Promise.resolve({
              id: "fallback-user",
              email: "fallback@example.local",
              displayName: "Fallback",
              roleAssignments: [],
            });
          }

          return Promise.resolve(null);
        }),
      },
    } as unknown as PrismaService;

    const guard = new FirebaseAuthGuard(
      {
        get: jest.fn((key: string) => {
          if (key === "DEV_AUTH_USER_ID") return "fallback-user";
          if (key === "NODE_ENV") return "development";
          return undefined;
        }),
      } as unknown as ConfigService,
      {
        getAllAndOverride: jest.fn().mockReturnValue(false),
      } as unknown as Reflector,
      prisma,
    );

    const context = {
      getHandler: () => function handler() {},
      getClass: () => class GuardTestClass {},
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const allowed = await guard.canActivate(context);

    expect(allowed).toBe(true);
    expect(request.currentUser.id).toBe("user-from-header");
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { firebaseUid: "dev-brother-ea" },
      }),
    );
  });
});
