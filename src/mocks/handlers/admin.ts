import { http, HttpResponse } from "msw";
import { adminKpis, delay, users } from "@/mocks/data";

export const adminHandlers = [
  http.get("/api/admin/kpis", async () => {
    await delay();
    return HttpResponse.json(adminKpis);
  }),
  http.get("/api/admin/users", async () => {
    await delay();
    return HttpResponse.json({ items: users });
  }),
];
