import { prisma } from "../config/prisma";

export const refreshTokenRepository = {
    async create(data: { userId: string; token: string; expiredAt: Date }) {
        return prisma.refreshToken.create({ data });
    },

    async findByToken(token: string) {
        return prisma.refreshToken.findUnique({ where: { token } });
    },

    async deleteByToken(token: string) {
        return prisma.refreshToken.delete({ where: { token } });
    },

    async deleteManyByUserId(userId: string) {
        return prisma.refreshToken.deleteMany({ where: { userId } });
    },

}