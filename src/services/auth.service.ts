import { UserRepository } from "@/repositories/user.repo";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { z } from "zod";
import { registerSchema, loginSchema } from "@/validators/auth";

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const user = await UserRepository.create({
      email: data.email,
      passwordHash,
      // First user is ADMIN for demonstration purposes, otherwise USER
      role: data.email.includes("admin") ? "ADMIN" : "USER",
    });

    return user;
  }

  static async login(data: z.infer<typeof loginSchema>) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }
}
