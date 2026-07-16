import { Response } from "express";

// các hàm nhận dữ liệu
// và phản hồi dữ liệu API cho browser gồm: statusCode, và chuỗi json
export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function sendError(res: Response, message: string, statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}
