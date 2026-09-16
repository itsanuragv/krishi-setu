import { z } from "zod";

export const adminKpiSchema = z.object({
  users: z.number(),
  activeListings: z.number(),
  openDisputes: z.number(),
  gmvToday: z.number(),
  fraudFlags: z.number(),
});

export type AdminKpi = z.infer<typeof adminKpiSchema>;
