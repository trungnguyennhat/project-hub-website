import { z } from "zod";

// tạo 1 object schema để validate dữ liệu đầu vào của user khi đăng ký tài khoản
export const registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required"),
});

// tạo 1 type RegisterInput từ schema registerSchema để sử dụng trong các function khác
export type RegisterInput = z.infer<typeof registerSchema>;
