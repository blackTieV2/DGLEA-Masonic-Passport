import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { getAuth } from "firebase-admin/auth";
import { FirebaseAuthGuard } from "./firebase-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

jest.mock("firebase-admin/auth", () => ({
  getAuth: jest.fn(),
}));

interface RequestWithUser {
  headers: Record<string, string>;
  currentUser?: { id: string };
}

function createGuard(
  configValues: Record<string, string | undefined>,
  prisma: PrismaService,
): FirebaseAuthGuard {
  const configService = {
    get: jest.fn((key: string) => configValues[key]),
  } as unknown as ConfigService;

  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  } as unknown as Reflector;

  return new FirebaseAuthGuard(configService, reflector, prisma);
}

function createExecutionContext(request: RequestWithUser): ExecutionContext {
  return {
    getHandler: () => function handler() {},
    getClass: () => class GuardTestClass {},
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function createPrismaMock(usersByFirebaseUid: Record<string, unknown>, usersById: Record<string, unknown>) {
  return {
    user: {
      findUnique: jest.fn(({ where }: { where: { firebaseUid?: string; id?: string } }) => {
        if (where.firebaseUid && usersByFirebaseUid[where.firebaseUid]) {
          return Promise.resolve(usersByFirebaseUid[where.firebaseUid]);
        }
        if (where.id && usersById[where.id]) {
          return Promise.resolve(usersById[where.id]);
        }
        return Promise.resolve(null);
      }),
    },
  } as unknown as PrismaService;
}

describe("FirebaseAuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects dev-auth by default when ALLOW_DEV_AUTH is not enabled", async () => {
    const request: RequestWithUser = {
      headers: {
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const prisma = createPrismaMock(
      {
        "dev-brother-ea": {
          id: "user-from-header",
          email: "brother@example.local",
          displayName: "Brother",
          roleAssignments: [],
        },
      },
      {},
    );

    const guard = createGuard(
      {
        NODE_ENV: "development",
      },
      prisma,
    );

    await expect(guard.canActivate(createExecutionContext(request))).rejects.toThrow(
      "Missing or invalid authorization header",
    );
    expect(request.currentUser).toBeUndefined();
  });

  it("allows dev-auth when ALLOW_DEV_AUTH=true and NODE_ENV is not production", async () => {
    const request: RequestWithUser = {
      headers: {
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const prisma = createPrismaMock(
      {
        "dev-brother-ea": {
          id: "user-from-header",
          email: "brother@example.local",
          displayName: "Brother",
          roleAssignments: [],
        },
      },
      {},
    );

    const guard = createGuard(
      {
        NODE_ENV: "development",
        ALLOW_DEV_AUTH: "true",
      },
      prisma,
    );

    const allowed = await guard.canActivate(createExecutionContext(request));

    expect(allowed).toBe(true);
    expect(request.currentUser?.id).toBe("user-from-header");
  });

  it("rejects dev-auth in production even when ALLOW_DEV_AUTH=true", async () => {
    const request: RequestWithUser = {
      headers: {
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const prisma = createPrismaMock({}, {});

    const guard = createGuard(
      {
        NODE_ENV: "production",
        ALLOW_DEV_AUTH: "true",
      },
      prisma,
    );

    await expect(guard.canActivate(createExecutionContext(request))).rejects.toThrow(
      "Missing or invalid authorization header",
    );
    expect(request.currentUser).toBeUndefined();
  });

  it("prefers the dev firebase uid header over the fallback dev auth user", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Bearer ignored",
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const findUniqueMock = jest.fn(({ where }: { where: { firebaseUid?: string; id?: string } }) => {
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
    });

    const prisma = {
      user: {
        findUnique: findUniqueMock,
      },
    } as unknown as PrismaService;

    const guard = createGuard(
      {
        NODE_ENV: "development",
        ALLOW_DEV_AUTH: "true",
        DEV_AUTH_USER_ID: "fallback-user",
      },
      prisma,
    );

    const allowed = await guard.canActivate(createExecutionContext(request));

    expect(allowed).toBe(true);
    expect(request.currentUser?.id).toBe("user-from-header");
    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { firebaseUid: "dev-brother-ea" },
      }),
    );
  });

  it("authenticates a real Firebase ID token when dev-auth is disabled", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const verifyIdTokenMock = jest.fn().mockResolvedValue({ uid: "real-firebase-uid" });
    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: verifyIdTokenMock,
    });

    const prisma = createPrismaMock(
      {
        "real-firebase-uid": {
          id: "user-from-token",
          email: "token@example.local",
          displayName: "Token User",
          roleAssignments: [],
        },
      },
      {},
    );

    const guard = createGuard(
      {
        NODE_ENV: "production",
        ALLOW_DEV_AUTH: "false",
      },
      prisma,
    );

    const allowed = await guard.canActivate(createExecutionContext(request));

    expect(allowed).toBe(true);
    expect(request.currentUser?.id).toBe("user-from-token");
    expect(verifyIdTokenMock).toHaveBeenCalledWith("valid-token");
  });

  it("rejects invalid Firebase ID tokens", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const verifyIdTokenMock = jest.fn().mockRejectedValue(new Error("Invalid token"));
    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: verifyIdTokenMock,
    });

    const prisma = createPrismaMock({}, {});

    const guard = createGuard(
      {
        NODE_ENV: "production",
        ALLOW_DEV_AUTH: "false",
      },
      prisma,
    );

    await expect(guard.canActivate(createExecutionContext(request))).rejects.toThrow("Invalid token");
    expect(request.currentUser).toBeUndefined();
  });
});
