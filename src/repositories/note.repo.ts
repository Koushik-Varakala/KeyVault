import { prisma } from "@/lib/prisma";

export class NoteRepository {
  static async findAllByUser(userId: string) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string, userId: string) {
    return prisma.note.findFirst({ where: { id, userId } });
  }

  static async create(userId: string, data: { title: string; content: string }) {
    return prisma.note.create({ data: { ...data, userId } });
  }

  static async update(id: string, userId: string, data: { title?: string; content?: string }) {
    return prisma.note.updateMany({ where: { id, userId }, data });
  }

  static async delete(id: string, userId: string) {
    return prisma.note.deleteMany({ where: { id, userId } });
  }
}
