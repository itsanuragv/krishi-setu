import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amount: z.number(),
  status: z.enum(["created", "authorized", "captured", "refunded", "failed"]),
  method: z.enum(["upi", "card", "netbanking"]).optional(),
  settlementStatus: z.enum(["pending", "processing", "settled"]),
});

export type Payment = z.infer<typeof paymentSchema>;
