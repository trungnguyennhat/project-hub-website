import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import { RegisterInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

export const authService = {
    async register(input: RegisterInput){
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
    }
};
