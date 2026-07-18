import { NextFunction, Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/api-response";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input);
    sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}


