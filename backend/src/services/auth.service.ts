import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


const SALT_ROUNDS = 10;

export const authService = {
    async register(input: RegisterInput) {
        const existingUser = await userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new AppError("Email already exists", 400);
        }

        const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

        return userRepository.create({
            email: input.email,
            passwordHash,
            fullName: input.fullName,
        });
    },

    async login(input: LoginInput) {
        const user = await userRepository.findByEmail(input.email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const payload = { userId: user.id };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await refreshTokenRepository.create({
            userId: user.id,
            token: refreshToken,
            expiredAt,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            accessToken,
            refreshToken,
        };
    },


};
