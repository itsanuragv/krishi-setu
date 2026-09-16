import { z } from "zod";

export const cropGradeSchema = z.enum(["A", "B", "C"]);

export const geoPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  area: z.string(),
  district: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  farmerId: z.string(),
  farmerName: z.string(),
  farmerTrustScore: z.number(),
  crop: z.string(),
  variety: z.string().optional(),
  quantityKg: z.number().positive(),
  availableKg: z.number().nonnegative(),
  pricePerKg: z.number().positive(),
  grade: cropGradeSchema,
  harvestDate: z.string(),
  photos: z.array(z.string()),
  location: geoPointSchema,
  status: z.enum(["listed", "matched", "sold", "expired"]),
  description: z.string().optional(),
});

export const createProductSchema = z.object({
  crop: z.string().min(2),
  variety: z.string().optional(),
  quantityKg: z.coerce.number().positive("Quantity must be greater than 0"),
  pricePerKg: z.coerce.number().positive("Price must be greater than 0"),
  grade: cropGradeSchema,
  harvestDate: z.string().min(1, "Harvest date is required"),
  description: z.string().optional(),
  district: z.string().min(2),
  photos: z.array(z.string()).max(6).optional(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
