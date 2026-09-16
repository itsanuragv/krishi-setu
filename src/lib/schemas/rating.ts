import { z } from "zod";

export const ratingSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const createRatingSchema = z.object({
  orderId: z.string(),
  toUserId: z.string(),
  stars: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type Rating = z.infer<typeof ratingSchema>;
