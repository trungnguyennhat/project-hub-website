import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { sendError } from "../utils/api-response";

// sendError trả về một phản hồi lỗi API cho browser gồm: statusCode, và chuỗi json
export function notFoundHandler(req: Request, res: Response) {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

// khai báo 4 tham số -> middleware xử lý lỗi -> next(error) hoặc throw error sẽ được xử lý tại đây

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
    // nếu lỗi được xử lý là object của AppError -> gửi phản hồi lỗi API qua sendError
    // ví dụ: throw new AppError("Not Found", statusCode) -> sẽ được xử lý tại đây
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error(err);
  sendError(res, "Internal Server Error", 500);
}
