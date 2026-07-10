import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Role, ScopeType } from "@prisma/client";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { PrismaService } from "../prisma/prisma.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

export interface CurrentUserRoleAssignment {
  role: Role;
  scopeType: ScopeType;
  scopeId: string | null;
}

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  roles: CurrentUserRoleAssignment[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser: CurrentUser;
    }
  }
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    const devAuthUserId = this.configService.get<string>("DEV_AUTH_USER_ID");
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    const devFirebaseUid =
      typeof request.headers["x-dev-auth-firebase-uid"] === "string"
        ? request.headers["x-dev-auth-firebase-uid"]
        : undefined;

    if (devFirebaseUid && nodeEnv !== "production") {
      const user = await this.loadUserByFirebaseUid(devFirebaseUid);
      if (!user) {
        throw new UnauthorizedException("Dev auth firebase uid not found");
      }
      request.currentUser = user;
      return true;
    }

    if (devAuthUserId && nodeEnv !== "production") {
      const user = await this.loadUser(devAuthUserId);
      if (!user) {
        throw new UnauthorizedException("Dev auth user not found");
      }
      request.currentUser = user;
      return true;
    }

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Missing Bearer token");
    }

    let decoded: DecodedIdToken;
    try {
      decoded = await getAuth().verifyIdToken(token);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Token verification failed";
      throw new UnauthorizedException(message);
    }

    if (!decoded.uid) {
      throw new UnauthorizedException("Invalid token payload");
    }

    const user = await this.loadUserByFirebaseUid(decoded.uid);
    if (!user) {
      throw new UnauthorizedException("User not registered");
    }

    request.currentUser = user;
    return true;
  }

  private async loadUser(userId: string): Promise<CurrentUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          where: {
            activeFrom: { lte: new Date() },
            OR: [{ activeTo: null }, { activeTo: { gt: new Date() } }],
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roleAssignments.map((ra) => ({
        role: ra.role,
        scopeType: ra.scopeType,
        scopeId: ra.scopeId,
      })),
    };
  }

  private async loadUserByFirebaseUid(firebaseUid: string): Promise<CurrentUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        roleAssignments: {
          where: {
            activeFrom: { lte: new Date() },
            OR: [{ activeTo: null }, { activeTo: { gt: new Date() } }],
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roleAssignments.map((ra) => ({
        role: ra.role,
        scopeType: ra.scopeType,
        scopeId: ra.scopeId,
      })),
    };
  }
}
