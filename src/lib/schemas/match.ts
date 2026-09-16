import { z } from "zod";

export const matchBreakdownSchema = z.object({
  quantity: z.number(),
  price: z.number(),
  location: z.number(),
  quality: z.number(),
  trust: z.number(),
});

export const matchSchema = z.object({
  id: z.string(),
  productId: z.string(),
  buyerId: z.string(),
  buyerName: z.string(),
  buyerType: z.enum(["consumer", "bulk_buyer"]),
  crop: z.string(),
  requestedKg: z.number(),
  offeredPricePerKg: z.number(),
  distanceKm: z.number(),
  score: z.number().min(0).max(100),
  breakdown: matchBreakdownSchema,
});

export type Match = z.infer<typeof matchSchema>;
export type MatchBreakdown = z.infer<typeof matchBreakdownSchema>;
