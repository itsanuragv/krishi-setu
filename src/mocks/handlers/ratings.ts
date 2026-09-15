import { http, HttpResponse } from "msw";
import { delay } from "@/mocks/data";

export const ratingHandlers = [
  http.post("/api/ratings", async ({ request }) => {
    await delay();
    const body = await request.json();
    return HttpResponse.json({ rating: { id: "r-1", ...(body as object) } }, { status: 201 });
  }),
];
