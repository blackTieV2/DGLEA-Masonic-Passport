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

function createPrismaMock(
  usersByFirebaseUid: Record<string, unknown>,
  usersById: Record<string, unknown>,
): PrismaService & { findUniqueMock: jest.Mock } {
  const findUniqueMock = jest.fn(({ where }: { where: { firebaseUid?: string; id?: string } }) => {
    if (where.firebaseUid && usersByFirebaseUid[where.firebaseUid]) {
      return Promise.resolve(usersByFirebaseUid[where.firebaseUid]);
    }
    if (where.id && usersById[where.id]) {
      return Promise.resolve(usersById[where.id]);
    }
    return Promise.resolve(null);
  });

  const prisma = {
    user: {
      findUnique: findUniqueMock,
    },
  } as unknown as PrismaService & { findUniqueMock: jest.Mock };

  prisma.findUniqueMock = findUniqueMock;
  return prisma;
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

  it("allows dev-auth via header when ALLOW_DEV_AUTH=true and NODE_ENV is not production", async () => {
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

  it("allows dev-auth via fallback DEV_AUTH_USER_ID when ALLOW_DEV_AUTH=true", async () => {
    const request: RequestWithUser = {
      headers: {},
    };

    const prisma = createPrismaMock(
      {},
      {
        "fallback-user": {
          id: "fallback-user",
          email: "fallback@example.local",
          displayName: "Fallback",
          roleAssignments: [],
        },
      },
    );

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
    expect(request.currentUser?.id).toBe("fallback-user");
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
      {
        "fallback-user": {
          id: "fallback-user",
          email: "fallback@example.local",
          displayName: "Fallback",
          roleAssignments: [],
        },
      },
    );

    const guard = createGuard(
      {
        NODE_ENV: "development",
        ALLOW_DEV_AUTH: "true",
        DEV_AUTH_USER_ID: "fallback-user",
      },
      prisma,
    );

    const findUniqueMock = prisma.findUniqueMock;

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

  it("valid Bearer token takes precedence over DEV_AUTH_USER_ID fallback", async () => {
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
      {
        "fallback-user": {
          id: "fallback-user",
          email: "fallback@example.local",
          displayName: "Fallback",
          roleAssignments: [],
        },
      },
    );

    const guard = createGuard(
      {
        NODE_ENV: "development",
        ALLOW_DEV_AUTH: "true",
        DEV_AUTH_USER_ID: "fallback-user",
      },
      prisma,
    );

    const findUniqueMock = prisma.findUniqueMock;

    const allowed = await guard.canActivate(createExecutionContext(request));

    expect(allowed).toBe(true);
    expect(request.currentUser?.id).toBe("user-from-token");
    expect(verifyIdTokenMock).toHaveBeenCalledWith("valid-token");
    expect(findUniqueMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "fallback-user" },
      }),
    );
  });

  it("valid Bearer token takes precedence over X-Dev-Auth-Firebase-Uid header", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Bearer valid-token",
        "x-dev-auth-firebase-uid": "dev-brother-ea",
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

    const findUniqueMock = prisma.findUniqueMock;

    const allowed = await guard.canActivate(createExecutionContext(request));

    expect(allowed).toBe(true);
    expect(request.currentUser?.id).toBe("user-from-token");
    expect(verifyIdTokenMock).toHaveBeenCalledWith("valid-token");
    expect(findUniqueMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { firebaseUid: "dev-brother-ea" },
      }),
    );
  });

  it("invalid Bearer token does not fall back to dev-auth", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Bearer invalid-token",
        "x-dev-auth-firebase-uid": "dev-brother-ea",
      },
    };

    const verifyIdTokenMock = jest.fn().mockRejectedValue(new Error("Invalid token"));
    (getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: verifyIdTokenMock,
    });

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

    await expect(guard.canActivate(createExecutionContext(request))).rejects.toThrow("Invalid token");
    expect(request.currentUser).toBeUndefined();
  });

  it("rejects a non-Bearer authorization header without falling back to dev-auth", async () => {
    const request: RequestWithUser = {
      headers: {
        authorization: "Basic dXNlcjpwYXNz",
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

    await expect(guard.canActivate(createExecutionContext(request))).rejects.toThrow(
      "Missing or invalid authorization header",
    );
    expect(request.currentUser).toBeUndefined();
  });
});
