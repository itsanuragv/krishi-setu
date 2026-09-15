import { http, HttpResponse } from "msw";
import { delay, payments } from "@/mocks/data";

export const paymentHandlers = [
  http.get("/api/payments", async () => {
    await delay();
    return HttpResponse.json({ items: payments });
  }),
  http.post("/api/payments", async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { orderId: string; amount: number };
    const payment = {
      id: `pay-${crypto.randomUUID().slice(0, 6)}`,
      orderId: body.orderId,
      amount: body.amount,
      status: "captured" as const,
      method: "upi" as const,
      settlementStatus: "pending" as const,
    };
    payments.unshift(payment);
    return HttpResponse.json({ payment, checkout: { mock: true } }, { status: 201 });
  }),
];
