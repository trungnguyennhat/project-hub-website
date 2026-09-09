import bcrypt from "bcrypt";
import { createHash } from "node:crypto";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import { RegisterInput, LoginInput, RefreshInput } from "../schemas/auth.schema";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function createTokenPair(userId: string) {
  const payload = { userId };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const verifiedRefreshToken = verifyRefreshToken(refreshToken);

  if (!verifiedRefreshToken.exp) {
    throw new Error("Refresh token has no expiration");
  }

  return {
    accessToken,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpiredAt: new Date(verifiedRefreshToken.exp * 1000),
  };
}

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

    const tokens = createTokenPair(user.id);

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: tokens.refreshTokenHash,
      expiredAt: tokens.refreshTokenExpiredAt,
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
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  async refresh(input: RefreshInput) {
    try {
      const payload = verifyRefreshToken(input.refreshToken);
      const oldTokenHash = hashToken(input.refreshToken);
      const storedToken = await refreshTokenRepository.findByTokenHash(oldTokenHash);

      if (
        !storedToken ||
        storedToken.userId !== payload.userId ||
        storedToken.expiredAt <= new Date()
      ) {
        throw new AppError("Invalid refresh token", 401);
      }

      const tokens = createTokenPair(payload.userId);
      const rotatedToken = await refreshTokenRepository.rotate(oldTokenHash, {
        userId: payload.userId,
        tokenHash: tokens.refreshTokenHash,
        expiredAt: tokens.refreshTokenExpiredAt,
      });

      if (!rotatedToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        throw new AppError("Invalid refresh token", 401);
      }

      throw error;
    }
  },
};
