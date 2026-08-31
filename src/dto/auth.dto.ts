import { z } from "zod";

// 1. Login Schema
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

// 2. Register Schema
export const RegisterSchema = z.object({
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .max(100, "Fullname max 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email address")
    .max(100, "Email max 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password max 100 characters"),
});

// 3. Type Inference
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
