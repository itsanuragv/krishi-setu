import { http, HttpResponse } from "msw";
import { delay, products, users } from "@/mocks/data";
import type { Product } from "@/lib/schemas/product";

export const productHandlers = [
  http.get("/api/products", async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const crop = url.searchParams.get("crop")?.toLowerCase();
    const maxPrice = Number(url.searchParams.get("maxPrice") ?? 0);
    const grade = url.searchParams.get("grade");
    let list = [...products];
    if (crop) list = list.filter((p) => p.crop.toLowerCase().includes(crop));
    if (maxPrice) list = list.filter((p) => p.pricePerKg <= maxPrice);
    if (grade) list = list.filter((p) => p.grade === grade);
    return HttpResponse.json({ items: list, total: list.length });
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay();
    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({ product });
  }),

  http.post("/api/products", async ({ request }) => {
    await delay(500);
    const uid = request.headers.get("X-User-Id");
    const farmer = users.find((u) => u.id === uid);
    const body = (await request.json()) as Partial<Product> & {
      district?: string;
    };
    const product: Product = {
      id: `p-${crypto.randomUUID().slice(0, 8)}`,
      farmerId: farmer?.id ?? "u-farmer-1",
      farmerName: farmer?.name ?? "Farmer",
      farmerTrustScore: farmer?.trustScore ?? 50,
      crop: body.crop ?? "Crop",
      variety: body.variety,
      quantityKg: Number(body.quantityKg ?? 0),
      availableKg: Number(body.quantityKg ?? 0),
      pricePerKg: Number(body.pricePerKg ?? 0),
      grade: (body.grade as Product["grade"]) ?? "B",
      harvestDate: String(body.harvestDate ?? new Date().toISOString().slice(0, 10)),
      photos: body.photos?.length ? body.photos : ["/window.svg"],
      location: {
        lat: 19.99,
        lng: 73.78,
        area: farmer?.village ?? "Village",
        district: body.district ?? farmer?.district ?? "Sehore",
      },
      status: "listed",
      description: body.description,
    };
    products.unshift(product);
    return HttpResponse.json({ product }, { status: 201 });
  }),
];
