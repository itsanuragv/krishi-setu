import { z } from "zod";

export const deliverySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  partnerId: z.string().optional(),
  partnerName: z.string().optional(),
  pickupCode: z.string(),
  status: z.enum(["unassigned", "assigned", "picked_up", "in_transit", "delivered"]),
  etaMinutes: z.number().optional(),
  fromArea: z.string(),
  toArea: z.string(),
});

export type Delivery = z.infer<typeof deliverySchema>;
