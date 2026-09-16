import { z } from "zod";

export const disputeSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  raisedBy: z.string(),
  reason: z.string(),
  status: z.enum(["open", "under_review", "resolved", "rejected"]),
  evidenceUrls: z.array(z.string()),
  createdAt: z.string(),
});

export const createDisputeSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(10, "Please describe the issue"),
  evidenceUrls: z.array(z.string()).default([]),
});

export type Dispute = z.infer<typeof disputeSchema>;
