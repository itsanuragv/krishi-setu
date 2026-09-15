import { http, HttpResponse } from "msw";
import { delay, disputes } from "@/mocks/data";
import type { Dispute } from "@/lib/schemas/dispute";

export const disputeHandlers = [
  http.get("/api/disputes", async () => {
    await delay();
    return HttpResponse.json({ items: disputes });
  }),
  http.post("/api/disputes", async ({ request }) => {
    await delay();
    const uid = request.headers.get("X-User-Id") ?? "unknown";
    const body = (await request.json()) as Partial<Dispute>;
    const dispute: Dispute = {
      id: `ds-${crypto.randomUUID().slice(0, 6)}`,
      orderId: body.orderId ?? "",
      raisedBy: uid,
      reason: body.reason ?? "",
      status: "open",
      evidenceUrls: body.evidenceUrls ?? [],
      createdAt: new Date().toISOString(),
    };
    disputes.unshift(dispute);
    return HttpResponse.json({ dispute }, { status: 201 });
  }),
];
