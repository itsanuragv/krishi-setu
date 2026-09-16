import { z } from "zod";
import { ROLES } from "@/lib/auth/roles";

export const roleSchema = z.enum(ROLES);

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
  name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  language: z.enum(["en", "hi"]).default("en"),
  trustScore: z.number().min(0).max(100).optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  village: z.string().optional(),
});

export const loginRequestSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  role: roleSchema.optional(),
});

export const registerSchema = z.object({
  role: roleSchema,
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  village: z.string().optional(),
  language: z.enum(["en", "hi"]),
});

export type User = z.infer<typeof userSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
