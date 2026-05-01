import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class LogRepository {
  static async logRequest(data: Prisma.RequestLogUncheckedCreateInput): Promise<void> {
    // Fire and forget, we don't need to block on this
    prisma.requestLog.create({ data }).catch((error) => {
      console.error("Failed to log request:", error);
    });
  }

  static async getUsageStats(userId: string) {
    // Aggregation query to get counts per key
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      include: {
        _count: {
          select: { requestLogs: true }
        }
      }
    });

    return apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      maskedKey: key.maskedKey,
      totalRequests: key._count.requestLogs,
      isActive: key.isActive,
      createdAt: key.createdAt
    }));
  }
}
