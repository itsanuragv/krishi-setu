import { faker } from "@faker-js/faker";
import type { User } from "@/lib/schemas/user";
import type { Product } from "@/lib/schemas/product";
import type { Match } from "@/lib/schemas/match";
import type { Order } from "@/lib/schemas/order";
import type { Payment } from "@/lib/schemas/payment";
import type { Delivery } from "@/lib/schemas/delivery";
import type { Dispute } from "@/lib/schemas/dispute";
import type { AdminKpi } from "@/lib/schemas/admin";

faker.seed(26033);

const PHOTOS = [
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800", // Sharbati Wheat
  "https://images.unsplash.com/photo-1536939459926-301728717817?w=800", // Soyabean
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800", // Basmati Rice / Paddy
  "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800", // Corn / Maize
  "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800", // Pearl Millet / Bajra
  "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=800", // Grain Silo / Lot
];

export const DEMO_OTP = "123456";

export const users: User[] = [
  {
    id: "u-farmer-1",
    role: "farmer",
    name: "Rameshwar Yadav",
    phone: "9876543210",
    language: "hi",
    trustScore: 94,
    district: "Sehore",
    state: "Madhya Pradesh",
    village: "Bilkisganj",
  },
  {
    id: "u-consumer-1",
    role: "consumer",
    name: "Ananya Sharma",
    phone: "9876543211",
    language: "en",
    trustScore: 88,
    district: "Indore",
    state: "Madhya Pradesh",
  },
  {
    id: "u-delivery-1",
    role: "delivery",
    name: "Kailash Jadhav",
    phone: "9876543212",
    language: "hi",
    district: "Indore",
    state: "Madhya Pradesh",
  },
  {
    id: "u-admin-1",
    role: "admin",
    name: "Krishi Admin",
    phone: "9876543213",
    language: "en",
    district: "Bhopal",
    state: "Madhya Pradesh",
  },
  {
    id: "u-buyer-1",
    role: "bulk_buyer",
    name: "Malwa Agro Food Mills",
    phone: "9876543214",
    language: "en",
    trustScore: 96,
    district: "Dewas",
    state: "Madhya Pradesh",
  },
];

const crops = [
  { crop: "Wheat", variety: "MP Sharbati Golden A+", district: "Sehore", area: "Bilkisganj", pricePerKg: 34, quantityKg: 15000, grade: "A" as const, desc: "Certified MP Sharbati Golden Wheat, 10.4% moisture, hectolitre weight >82 kg/hl. Ideal for premium stone-ground chakki flour." },
  { crop: "Soyabean", variety: "JS-9560 Bold Grain", district: "Indore", area: "Sanwer", pricePerKg: 48, quantityKg: 10000, grade: "A" as const, desc: "Prime Malwa Yellow Soyabean JS-9560. High protein (39.5%) and oil content (19.8%). Zero foreign matter." },
  { crop: "Rice", variety: "Pusa 1121 Basmati Paddy", district: "Raisen", area: "Goharganj", pricePerKg: 72, quantityKg: 12000, grade: "A" as const, desc: "Pusa 1121 Extra Long Grain Basmati Paddy. 8.2mm kernel length, natural aroma, cured for minimal broken percentage." },
  { crop: "Corn", variety: "Pioneer Hybrid 3396 Yellow Maize", district: "Chhindwara", area: "Sausar", pricePerKg: 24, quantityKg: 18000, grade: "A" as const, desc: "Grade-A Yellow Dent Maize / Corn. High starch content, <12% moisture, suitable for starch processing and animal feed." },
  { crop: "Pearl Millet (Bajra)", variety: "Desi Shanker Shri Anna", district: "Morena", area: "Ambah", pricePerKg: 26, quantityKg: 8000, grade: "A" as const, desc: "Traditional nutrient-dense Pearl Millet (Shri Anna). High iron and fibre, pesticide-free rainfed harvest." },
  { crop: "White Jowar", variety: "M-35-1 Maldandi Bold", district: "Khargone", area: "Barwah", pricePerKg: 52, quantityKg: 6000, grade: "A" as const, desc: "Pearled white Maldandi Jowar (Sorghum). Sweet taste, gluten-free, premium grain quality for diabetic flour blends." },
  { crop: "Dollar Chana", variety: "Malwa Dollar Bold Kabuli", district: "Ujjain", area: "Barnagar", pricePerKg: 68, quantityKg: 9000, grade: "A" as const, desc: "Export Grade 75/80 count Malwa Dollar Chana. Big bold seeds with uniform creamy white finish." },
  { crop: "Mustard Seed", variety: "Pusa Bold Black Sarson", district: "Gwalior", area: "Dabra", pricePerKg: 56, quantityKg: 7000, grade: "A" as const, desc: "Pusa Bold Black Mustard Seed. 41.2% oil content, high pungency, farm-gate lot directly from Chambal basin." },
];

export const products: Product[] = crops.map((c, i) => ({
  id: `p-${i + 1}`,
  farmerId: "u-farmer-1",
  farmerName: "Rameshwar Yadav",
  farmerTrustScore: 94,
  crop: c.crop,
  variety: c.variety,
  quantityKg: c.quantityKg,
  availableKg: Math.round(c.quantityKg * 0.9),
  pricePerKg: c.pricePerKg,
  grade: c.grade,
  harvestDate: "2026-09-12",
  photos: [PHOTOS[i % PHOTOS.length]],
  location: {
    lat: 23.2599,
    lng: 77.4126,
    area: c.area,
    district: c.district,
  },
  status: "listed",
  description: c.desc,
}));

export const matches: Match[] = [
  {
    id: "m-1",
    productId: "p-1",
    buyerId: "u-consumer-1",
    buyerName: "Ananya Sharma",
    buyerType: "consumer",
    crop: "Wheat",
    requestedKg: 500,
    offeredPricePerKg: 35,
    distanceKm: 14,
    score: 96,
    breakdown: { quantity: 20, price: 20, location: 22, quality: 18, trust: 16 },
  },
  {
    id: "m-2",
    productId: "p-2",
    buyerId: "u-buyer-1",
    buyerName: "Malwa Agro Food Mills",
    buyerType: "bulk_buyer",
    crop: "Soyabean",
    requestedKg: 5000,
    offeredPricePerKg: 49,
    distanceKm: 18,
    score: 94,
    breakdown: { quantity: 20, price: 19, location: 21, quality: 18, trust: 16 },
  },
];

export const orders: Order[] = [
  {
    id: "o-1",
    productId: "p-1",
    crop: "Wheat",
    farmerId: "u-farmer-1",
    farmerName: "Rameshwar Yadav",
    buyerId: "u-buyer-1",
    buyerName: "Malwa Agro Food Mills",
    quantityKg: 5000,
    pricePerKg: 34,
    totalAmount: 170000,
    status: "paid",
    deliveryMode: "platform_delivery",
    createdAt: new Date().toISOString(),
    deadlineAt: new Date(Date.now() + 36 * 3600_000).toISOString(),
    pickupCode: "4821",
  },
];

export const payments: Payment[] = [
  {
    id: "pay-1",
    orderId: "o-1",
    amount: 170000,
    status: "captured",
    method: "upi",
    settlementStatus: "pending",
  },
];

export const deliveries: Delivery[] = [
  {
    id: "d-1",
    orderId: "o-1",
    partnerId: "u-delivery-1",
    partnerName: "Suresh Patil",
    pickupCode: "4821",
    status: "assigned",
    etaMinutes: 45,
    fromArea: "Niphad",
    toArea: "Pune Camp",
  },
];

export const disputes: Dispute[] = [
  {
    id: "ds-1",
    orderId: "o-1",
    raisedBy: "u-consumer-1",
    reason: "Quantity short by 2kg at delivery.",
    status: "open",
    evidenceUrls: [],
    createdAt: new Date().toISOString(),
  },
];

export const adminKpis: AdminKpi = {
  users: users.length,
  activeListings: products.filter((p) => p.status === "listed").length,
  openDisputes: disputes.filter((d) => d.status === "open").length,
  gmvToday: 128400,
  fraudFlags: 2,
};

export function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}
