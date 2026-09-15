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
  "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
  "https://images.unsplash.com/photo-1597362925123-778ca5dd1d3d?w=800",
  "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800",
  "https://images.unsplash.com/photo-1615485290382-441e4d049eab?w=800",
];

export const DEMO_OTP = "123456";

export const users: User[] = [
  {
    id: "u-farmer-1",
    role: "farmer",
    name: "Ramesh Yadav",
    phone: "9876543210",
    language: "hi",
    trustScore: 86,
    district: "Nashik",
    state: "Maharashtra",
    village: "Niphad",
  },
  {
    id: "u-consumer-1",
    role: "consumer",
    name: "Ananya Sharma",
    phone: "9876543211",
    language: "en",
    trustScore: 74,
    district: "Pune",
    state: "Maharashtra",
  },
  {
    id: "u-delivery-1",
    role: "delivery",
    name: "Suresh Patil",
    phone: "9876543212",
    language: "hi",
    district: "Nashik",
    state: "Maharashtra",
  },
  {
    id: "u-admin-1",
    role: "admin",
    name: "Krishi Admin",
    phone: "9876543213",
    language: "en",
    district: "Delhi",
    state: "Delhi",
  },
  {
    id: "u-buyer-1",
    role: "bulk_buyer",
    name: "Nashik FPO",
    phone: "9876543214",
    language: "en",
    trustScore: 91,
    district: "Nashik",
    state: "Maharashtra",
  },
];

const crops = [
  { crop: "Tomato", variety: "Abhinav", district: "Nashik", area: "Niphad" },
  { crop: "Onion", variety: "Nasik Red", district: "Nashik", area: "Lasalgaon" },
  { crop: "Wheat", variety: "HD-2967", district: "Indore", area: "Depalpur" },
  { crop: "Potato", variety: "Kufri Jyoti", district: "Agra", area: "Fatehabad" },
  { crop: "Mango", variety: "Alphonso", district: "Ratnagiri", area: "Devgad" },
  { crop: "Chilli", variety: "Byadgi", district: "Haveri", area: "Byadgi" },
];

export const products: Product[] = crops.map((c, i) => ({
  id: `p-${i + 1}`,
  farmerId: "u-farmer-1",
  farmerName: "Ramesh Yadav",
  farmerTrustScore: 86,
  crop: c.crop,
  variety: c.variety,
  quantityKg: 200 + i * 50,
  availableKg: 180 + i * 40,
  pricePerKg: 18 + i * 6,
  grade: (["A", "A", "B", "A", "A", "B"] as const)[i],
  harvestDate: "2026-09-10",
  photos: [PHOTOS[i % PHOTOS.length]],
  location: {
    lat: 19.9975,
    lng: 73.7898,
    area: c.area,
    district: c.district,
  },
  status: "listed",
  description: `Fresh ${c.crop.toLowerCase()} harvested this week. Farm-gate price, no mandi markup.`,
}));

export const matches: Match[] = [
  {
    id: "m-1",
    productId: "p-1",
    buyerId: "u-consumer-1",
    buyerName: "Ananya Sharma",
    buyerType: "consumer",
    crop: "Tomato",
    requestedKg: 20,
    offeredPricePerKg: 24,
    distanceKm: 12,
    score: 88,
    breakdown: { quantity: 18, price: 20, location: 22, quality: 16, trust: 12 },
  },
  {
    id: "m-2",
    productId: "p-2",
    buyerId: "u-buyer-1",
    buyerName: "Nashik FPO",
    buyerType: "bulk_buyer",
    crop: "Onion",
    requestedKg: 400,
    offeredPricePerKg: 21,
    distanceKm: 8,
    score: 79,
    breakdown: { quantity: 12, price: 18, location: 22, quality: 15, trust: 12 },
  },
];

export const orders: Order[] = [
  {
    id: "o-1",
    productId: "p-1",
    crop: "Tomato",
    farmerId: "u-farmer-1",
    farmerName: "Ramesh Yadav",
    buyerId: "u-consumer-1",
    buyerName: "Ananya Sharma",
    quantityKg: 20,
    pricePerKg: 24,
    totalAmount: 480,
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
    amount: 480,
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
