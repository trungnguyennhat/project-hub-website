import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import type { StringValue } from "ms";

// tạo ra interface của typescript để định nghĩa các thông tin cần có trong object payload được truyền vào hàm generate (userId)
export interface TokenPayload {
  userId: string;
}

export type VerifiedTokenPayload = TokenPayload & jwt.JwtPayload;

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
    jwtid: randomUUID(),
  });
}

// hàm verify kiểm tra string token và trả về payload chứa userId
function verifyToken(token: string, secret: string): VerifiedTokenPayload {
  const payload = jwt.verify(token, secret);

  if (typeof payload === "string" || typeof payload.userId !== "string") {
    throw new jwt.JsonWebTokenError("Invalid token payload");
  }

  return payload as VerifiedTokenPayload;
}

export function verifyAccessToken(token: string): VerifiedTokenPayload {
  return verifyToken(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): VerifiedTokenPayload {
  return verifyToken(token, env.JWT_REFRESH_SECRET);
}
