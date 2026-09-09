import { prisma } from "../config/prisma";

export const refreshTokenRepository = {
  async create(data: { userId: string; tokenHash: string; expiredAt: Date }) {
    return prisma.refreshToken.create({ data });
  },

  async findByTokenHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },

  async rotate(oldTokenHash: string, data: { userId: string; tokenHash: string; expiredAt: Date }) {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.refreshToken.deleteMany({
        where: { tokenHash: oldTokenHash },
      });

      if (deleted.count === 0) {
        return null;
      }

      return tx.refreshToken.create({ data });
    });
  },

  async deleteManyByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
};
