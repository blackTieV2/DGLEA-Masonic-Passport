import { Injectable } from "@nestjs/common";
import { AuditAction, Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface RecordAuditEventInput {
  actorUserId?: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string | null;
  scope?: string | null;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    input: RecordAuditEventInput,
    client: Prisma.TransactionClient | PrismaService = this.prisma,
  ): Promise<void> {
    await client.auditEvent.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? null,
        scope: input.scope ?? null,
        metadataJson: (input.metadata ?? {}) as never,
      },
    });
  }
}
