import { prisma } from "../config/prisma";

// 1 object để chỉ định các trường dữ liệu của user khi thao tác vs db
const safeUserSelect = {
    id: true,
    email: true,
    fullName: true,
    avatarUrl: true,
    createdAt: true,
    updatedAt: true,
} as const;

// 1 object userRepository để thao tác với bảng user trong db
// findByEmail: trả về 1 object user chứa toàn bộ thông tin tìm theo email
// create(): tạo 1 user mới trong db với dữ liệu đầu vào là email, passwordHash, fullName và trả về 1 object user chứa các trường dữ liệu được chỉ định trong safeUserSelect
// lưu ý trong create() của prisma: thuộc tính data : data
export const userRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email }});
    },
    create(data: { email: string; passwordHash: string; fullName: string }){
        return prisma.user.create({ data, select: safeUserSelect });
    },
}
