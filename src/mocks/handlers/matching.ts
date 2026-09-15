import { http, HttpResponse } from "msw";
import { delay, matches } from "@/mocks/data";

export const matchingHandlers = [
  http.get("/api/matches", async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const list = productId ? matches.filter((m) => m.productId === productId) : matches;
    return HttpResponse.json({ items: list });
  }),
];
