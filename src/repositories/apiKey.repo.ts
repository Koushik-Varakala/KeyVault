import { prisma } from "@/lib/prisma";
import { ApiKey, Prisma } from "@prisma/client";

export class ApiKeyRepository {
  static async create(data: Prisma.ApiKeyUncheckedCreateInput): Promise<ApiKey> {
    return prisma.apiKey.create({ data });
  }

  static async findByHash(keyHash: string): Promise<ApiKey | null> {
    return prisma.apiKey.findUnique({ where: { keyHash } });
  }

  static async findByUserId(userId: string): Promise<ApiKey[]> {
    return prisma.apiKey.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findAll(): Promise<ApiKey[]> {
    return prisma.apiKey.findMany({
      include: {
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async revoke(id: string, userId: string): Promise<ApiKey> {
    // Only the owner or an admin should do this, but repository layer just enforces userId (or we can skip here and enforce in service)
    return prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
