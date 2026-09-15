import { http, HttpResponse } from "msw";
import { delay, orders, products } from "@/mocks/data";
import type { Order } from "@/lib/schemas/order";

export const orderHandlers = [
  http.get("/api/orders", async ({ request }) => {
    await delay();
    const uid = request.headers.get("X-User-Id");
    const list = orders.filter((o) => o.farmerId === uid || o.buyerId === uid);
    return HttpResponse.json({ items: uid ? list : orders });
  }),

  http.get("/api/orders/:id", async ({ params }) => {
    await delay();
    const order = orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({ order });
  }),

  http.post("/api/orders", async ({ request }) => {
    await delay(400);
    const uid = request.headers.get("X-User-Id");
    const body = (await request.json()) as {
      productId: string;
      quantityKg: number;
      deliveryMode: Order["deliveryMode"];
    };
    const product = products.find((p) => p.id === body.productId);
    if (!product) return HttpResponse.json({ message: "Product not found" }, { status: 404 });

    const order: Order = {
      id: `o-${crypto.randomUUID().slice(0, 8)}`,
      productId: product.id,
      crop: product.crop,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      buyerId: uid ?? "u-consumer-1",
      buyerName: "Buyer",
      quantityKg: Number(body.quantityKg),
      pricePerKg: product.pricePerKg,
      totalAmount: Number(body.quantityKg) * product.pricePerKg,
      status: "requested",
      deliveryMode: body.deliveryMode,
      createdAt: new Date().toISOString(),
      deadlineAt: new Date(Date.now() + 48 * 3600_000).toISOString(),
      pickupCode: String(Math.floor(1000 + Math.random() * 9000)),
    };
    orders.unshift(order);
    return HttpResponse.json({ order }, { status: 201 });
  }),

  http.patch("/api/orders/:id", async ({ params, request }) => {
    await delay();
    const order = orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const body = (await request.json()) as { status?: Order["status"] };
    if (body.status) order.status = body.status;
    return HttpResponse.json({ order });
  }),
];
