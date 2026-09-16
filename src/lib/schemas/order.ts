import { z } from "zod";

export const orderStatusSchema = z.enum([
  "requested",
  "accepted",
  "paid",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
  "disputed",
]);

export const orderSchema = z.object({
  id: z.string(),
  productId: z.string(),
  crop: z.string(),
  farmerId: z.string(),
  farmerName: z.string(),
  buyerId: z.string(),
  buyerName: z.string(),
  quantityKg: z.number(),
  pricePerKg: z.number(),
  totalAmount: z.number(),
  status: orderStatusSchema,
  deliveryMode: z.enum(["pickup", "platform_delivery"]),
  createdAt: z.string(),
  deadlineAt: z.string().optional(),
  pickupCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  productId: z.string(),
  quantityKg: z.coerce.number().positive(),
  deliveryMode: z.enum(["pickup", "platform_delivery"]),
});

export type Order = z.infer<typeof orderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
