import { http, HttpResponse } from "msw";
import { delay, deliveries } from "@/mocks/data";

export const deliveryHandlers = [
  http.get("/api/deliveries", async () => {
    await delay();
    return HttpResponse.json({ items: deliveries });
  }),
];
