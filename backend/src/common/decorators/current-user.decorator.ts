import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { CurrentUser as CurrentUserType } from "../guards/firebase-auth.guard";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<Request & { currentUser: CurrentUserType }>();
    return request.currentUser;
  },
);
