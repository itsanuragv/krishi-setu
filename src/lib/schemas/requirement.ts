import { z } from "zod";

/**
 * Reverse marketplace requirement: a bulk buyer posts what they need,
 * farmers pool contributions against it.
 */
export const requirementSchema = z.object({
  id: z.string(),
  buyerName: z.string(),
  business: z.string(),
  crop: z.string(),
  quantityKg: z.number().positive(),
  grade: z.string(),
  targetPrice: z.number().positive(),
  district: z.string(),
  deadline: z.string(),
  pooledKg: z.number().nonnegative(),
  contributors: z.number().nonnegative(),
  status: z.enum(["open", "filling", "fulfilled"]),
});

export const createRequirementSchema = z.object({
  crop: z.string().min(2),
  quantityKg: z.coerce.number().positive("Quantity must be greater than 0"),
  grade: z.string().min(1),
  targetPrice: z.coerce.number().positive("Target price must be greater than 0"),
  district: z.string().min(2),
  deadline: z.string().min(1, "Deadline is required"),
});

export type Requirement = z.infer<typeof requirementSchema>;
export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
