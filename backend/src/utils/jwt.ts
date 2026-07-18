import jwt from "jsonwebtoken"
import { env } from "../config/env"
import type { StringValue } from "ms";

// tạo ra interface của typescript để định nghĩa các thông tin cần có trong object payload được truyền vào hàm generate (userId)
export interface TokenPayload {
    userId: string;
}

export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
    });
}

export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
    })
}

// hàm verify kiểm tra string token và trả về payload chứa userId
export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}