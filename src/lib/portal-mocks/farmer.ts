import { useEffect, useState } from "react";
import type { ProduceListing } from "@/lib/mock-data";
import type { Match, MatchBreakdown } from "@/lib/schemas/match";
import type { Order } from "@/lib/schemas/order";

/**
 * Farmer portal mock data. Extends the shared mock-data records with
 * farmer-only demo state (draft listings published this session, buyer
 * matches, escrow orders, reviews, UPI history). Never edit shared files.
 */

export const FARMER_PROFILE = {
  name: "रामेश्वर पाटिल (Rameshwar Patil)",
  shortName: "Rameshwar",
  village: "सांवेर क्लस्टर",
  district: "Indore",
  upiId: "rameshwar.patil@upi",
  trustScore: 86,
  rating: 4.8,
  reviewCount: 34,
  matchBoostPct: 18,
};

// ── Session draft listings (published from dashboard / sell wizard) ──
// Module-level so a listing published on one page is visible on detail
// pages after client-side navigation within the same session.
const draftStore: ProduceListing[] = [];

export function getFarmerListings(base: ProduceListing[]): ProduceListing[] {
  return [...draftStore, ...base];
}

export function addFarmerListing(listing: ProduceListing): void {
  draftStore.unshift(listing);
}

export function findFarmerListing(
  base: ProduceListing[],
  id: string
): ProduceListing | undefined {
  return getFarmerListings(base).find((l) => l.id === id);
}

/** Build a minimal ProduceListing for a voice/wizard draft publish. */
export function buildDraftListing(input: {
  crop: string;
  quantity: number;
  unit: string;
  price: number;
  photo?: string;
}): ProduceListing {
  const crop = input.crop.trim() || "Mixed Crop";
  const zeroBreakdown = {
    priceIndex: { score: 0, detail: "" },
    distance: { score: 0, detail: "" },
    qualityGrade: { score: 0, detail: "" },
    quantityFit: { score: 0, detail: "" },
    reliability: { score: 0, detail: "" },
  };
  return {
    id: `draft-${Date.now()}`,
    name: crop,
    hindiName: crop,
    category: "Grains",
    farmerName: FARMER_PROFILE.name,
    farmerPhone: "+91 98220 00000",
    village: FARMER_PROFILE.village,
    district: `${FARMER_PROFILE.district}, Madhya Pradesh`,
    distanceKm: 0,
    quantityAvailable: input.quantity || 0,
    unit: input.unit || "quintal",
    farmGatePrice: input.price || 0,
    mandiBenchmarkPrice: Math.round((input.price || 0) * 1.25),
    imageUrl:
      input.photo ||
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    matchScore: 0,
    harvestDate: "Today",
    breakdown: zeroBreakdown,
    openCvMetrics: {
      blurScore: 0,
      brightnessPct: 0,
      resolution: "—",
      status: "Review Required",
    },
  };
}

// ── Buyer matches for the farmer's listings ──────────────────────────
function bd(
  quantity: number,
  price: number,
  location: number,
  quality: number,
  trust: number
): MatchBreakdown {
  return { quantity, price, location, quality, trust };
}

export const FARMER_MATCHES: Match[] = [
  {
    id: "fm-1",
    productId: "prod-1",
    buyerId: "b-malwa",
    buyerName: "Malwa Agro Food Mills",
    buyerType: "bulk_buyer",
    crop: "MP Sharbati Golden Wheat",
    requestedKg: 40000,
    offeredPricePerKg: 27.5,
    distanceKm: 8.4,
    score: 94,
    breakdown: bd(20, 21, 20, 19, 20),
  },
  {
    id: "fm-2",
    productId: "prod-1",
    buyerId: "b-ananya",
    buyerName: "Ananya Sharma",
    buyerType: "consumer",
    crop: "MP Sharbati Golden Wheat",
    requestedKg: 500,
    offeredPricePerKg: 34,
    distanceKm: 12.1,
    score: 89,
    breakdown: bd(18, 20, 19, 18, 20),
  },
  {
    id: "fm-3",
    productId: "prod-3",
    buyerId: "b-dewas-fpo",
    buyerName: "Dewas FPO Collective",
    buyerType: "bulk_buyer",
    crop: "Yellow Soyabean JS-9560",
    requestedKg: 25000,
    offeredPricePerKg: 41,
    distanceKm: 18.7,
    score: 91,
    breakdown: bd(20, 19, 18, 20, 19),
  },
  {
    id: "fm-4",
    productId: "prod-2",
    buyerId: "b-shreemaya",
    buyerName: "Hotel Shreemaya",
    buyerType: "bulk_buyer",
    crop: "Pusa 1121 Basmati Paddy",
    requestedKg: 2000,
    offeredPricePerKg: 58,
    distanceKm: 6.8,
    score: 87,
    breakdown: bd(17, 19, 20, 17, 19),
  },
  {
    id: "fm-5",
    productId: "prod-5",
    buyerId: "b-rahul",
    buyerName: "Rahul Deshmukh",
    buyerType: "consumer",
    crop: "Desi Pearl Millet (Bajra)",
    requestedKg: 800,
    offeredPricePerKg: 22,
    distanceKm: 15.2,
    score: 84,
    breakdown: bd(16, 18, 18, 18, 18),
  },
];

export function matchesForListing(listingId: string): Match[] {
  return FARMER_MATCHES.filter((m) => m.productId === listingId);
}

export function matchCountForListing(listingId: string): number {
  return matchesForListing(listingId).length;
}

// ── Escrow orders (vertical timeline stages 0–3) ─────────────────────
/** 0 = escrow locked → 1 = in transit → 2 = PIN verified → 3 = released */
export interface EscrowOrder extends Order {
  escrowStage: 0 | 1 | 2 | 3;
  etaDays: number;
}

export const FARMER_ORDERS: EscrowOrder[] = [
  {
    id: "ord-1",
    productId: "prod-1",
    crop: "MP Sharbati Golden Wheat",
    farmerId: "f-rameshwar",
    farmerName: FARMER_PROFILE.name,
    buyerId: "b-malwa",
    buyerName: "Malwa Agro Food Mills",
    quantityKg: 40000,
    pricePerKg: 27.5,
    totalAmount: 1100000,
    status: "paid",
    deliveryMode: "platform_delivery",
    createdAt: "2026-09-25",
    pickupCode: "4821",
    escrowStage: 2,
    etaDays: 1,
  },
  {
    id: "ord-2",
    productId: "prod-3",
    crop: "Yellow Soyabean JS-9560",
    farmerId: "f-rameshwar",
    farmerName: FARMER_PROFILE.name,
    buyerId: "b-dewas-fpo",
    buyerName: "Dewas FPO Collective",
    quantityKg: 25000,
    pricePerKg: 41,
    totalAmount: 1025000,
    status: "in_transit",
    deliveryMode: "platform_delivery",
    createdAt: "2026-09-26",
    pickupCode: "7734",
    escrowStage: 1,
    etaDays: 3,
  },
  {
    id: "ord-3",
    productId: "prod-2",
    crop: "Pusa 1121 Basmati Paddy",
    farmerId: "f-rameshwar",
    farmerName: FARMER_PROFILE.name,
    buyerId: "b-shreemaya",
    buyerName: "Hotel Shreemaya",
    quantityKg: 2000,
    pricePerKg: 58,
    totalAmount: 116000,
    status: "delivered",
    deliveryMode: "platform_delivery",
    createdAt: "2026-09-20",
    pickupCode: "3092",
    escrowStage: 3,
    etaDays: 0,
  },
];

// ── Rating history ───────────────────────────────────────────────────
export interface FarmerReview {
  id: string;
  buyerName: string;
  buyerType: string;
  rating: number;
  date: string;
  crop: string;
  comment: string;
}

export const FARMER_REVIEWS: FarmerReview[] = [
  {
    id: "r-1",
    buyerName: "Ananya Sharma",
    buyerType: "Consumer (Indore)",
    rating: 5,
    date: "12 Sep 2026",
    crop: "Wheat (MP Sharbati Golden A+)",
    comment:
      "Exceptional Sharbati wheat quality! Moisture tested at 10.4%, pristine golden amber grains — soft, sweet chakki flour.",
  },
  {
    id: "r-2",
    buyerName: "Malwa Agro Food Mills",
    buyerType: "FPO Bulk Buyer (Dewas)",
    rating: 5,
    date: "08 Sep 2026",
    crop: "Soyabean (JS-9560 Bold Grain)",
    comment:
      "Consistent Grade-A bold grains. Direct truck loading at farm gate went smoothly; oil content assayed above 19.5%.",
  },
  {
    id: "r-3",
    buyerName: "Rahul Deshmukh",
    buyerType: "Grain Wholesaler",
    rating: 5,
    date: "01 Sep 2026",
    crop: "Pearl Millet / Bajra (Desi Shanker Shri Anna)",
    comment:
      "Excellent pesticide-free bajra lot. Moisture under 11%, zero weevils or dust, prompt verified escrow payment.",
  },
];

// ── UPI history ──────────────────────────────────────────────────────
export interface UpiTxn {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: "success";
}

export const FARMER_UPI_HISTORY: UpiTxn[] = [
  { id: "upi-1", label: "Tamatar · 120kg · Hotel Shreemaya", amount: 2640, date: "24 Sep", status: "success" },
  { id: "upi-2", label: "Bajra · 8 quintal · Rahul Deshmukh", amount: 16400, date: "18 Sep", status: "success" },
  { id: "upi-3", label: "Maize · 20 quintal · Poultry Farm", amount: 37000, date: "10 Sep", status: "success" },
  { id: "upi-4", label: "Wheat · 5 quintal · Ananya Sharma", amount: 13250, date: "02 Sep", status: "success" },
];

// ── Simulated first-paint loading (mock data, no network) ────────────
/** Returns false for a beat so pages can show skeleton shimmer on mount. */
export function usePortalReady(delayMs = 450): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);
  return ready;
}

/** Naive voice-transcript parser: crop keywords, qty near unit words, price near ₹/rupee words. */
export function parseVoiceDraft(text: string): {
  crop: string;
  quantity: number;
  unit: string;
  price: number;
} {
  const lower = text.toLowerCase();
  const cropHints: Array<[RegExp, string]> = [
    [/(sharbati|wheat|gehun|गेहूं)/, "Sharbati Wheat"],
    [/(soyabean|soya\b|सोयाबीन)/, "Soyabean"],
    [/(basmati|paddy|धान)/, "Basmati Paddy"],
    [/(bajra|बाजरा|pearl millet)/, "Bajra"],
    [/(maize|corn|मक्का)/, "Maize"],
    [/(jowar|ज्वार|sorghum)/, "Jowar"],
    [/(tamatar|tomato|टमाटर)/, "Tomato"],
    [/(pyaz|onion|प्याज)/, "Onion"],
    [/(aloo|potato|आलू)/, "Potato"],
    [/(sarson|mustard|सरसों)/, "Mustard"],
    [/(chana|चना|gram)/, "Chana"],
    [/(kapas|cotton|कपास)/, "Cotton"],
    [/(dhan|rice|चावल)/, "Rice"],
  ];
  let crop = "";
  for (const [re, name] of cropHints) {
    if (re.test(lower)) {
      crop = name;
      break;
    }
  }

  const unit = /(quintal|क्विंटल|\bqtl\b)/.test(lower) ? "quintal" : "kg";

  const nums = [...text.matchAll(/[\d,]+(?:\.\d+)?/g)].map((m) =>
    parseFloat(m[0].replace(/,/g, ""))
  );

  let quantity = 0;
  const qtyMatch = lower.match(/([\d,]+(?:\.\d+)?)\s*(quintal|क्विंटल|qtl|\bkg\b|किलो)/);
  if (qtyMatch) quantity = parseFloat(qtyMatch[1].replace(/,/g, ""));

  let price = 0;
  const priceMatch = lower.match(/([\d,]+(?:\.\d+)?)\s*(₹|rs\.?|rupees?|रुपये|रुपए)/);
  if (priceMatch) price = parseFloat(priceMatch[1].replace(/,/g, ""));

  if (!quantity && nums.length > 0) quantity = nums[0];
  if (!price && nums.length > 1) price = nums[nums.length - 1];

  return { crop, quantity, unit, price };
}

/** Look up a mandi benchmark for a crop name (for the sell-wizard slider). */
export function mandiRateForCrop(crop: string, base: ProduceListing[]): number {
  const needle = crop.trim().toLowerCase();
  if (needle) {
    const hit = base.find(
      (l) =>
        l.name.toLowerCase().includes(needle) || needle.includes(l.name.toLowerCase().split(" ")[0])
    );
    if (hit) return hit.mandiBenchmarkPrice;
  }
  return 3000;
}
