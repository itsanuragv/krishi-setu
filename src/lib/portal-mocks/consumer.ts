import {
  MOCK_PRODUCE_LISTINGS,
  FARMER_PHOTOS,
  type ProduceListing,
} from "@/lib/mock-data";

/**
 * Consumer portal mock data. Adapts the shared ProduceListing records into
 * consumer-friendly per-kg cards (photo, trust chips, compact price journey)
 * and holds consumer-only demo data (weekly basket, harvest alerts, escrow
 * orders, dispute issue types). Never edit shared files — extend here.
 */

export interface ConsumerProduct {
  id: string;
  name: string;
  hindiName: string;
  category: ProduceListing["category"];
  imageUrl: string;
  farmerName: string;
  farmerPhoto: string;
  village: string;
  district: string;
  distanceKm: number;
  harvestDate: string;
  grade: string;
  rating: number;
  verified: boolean;
  pricePerKg: number; // farm-gate price, ₹/kg
  retailPricePerKg: number; // mandi retail benchmark, ₹/kg
  unit: "kg";
  gradeSpec: string;
  openCvStatus: string;
  lotQuintal: number; // farm lot size in quintals
  description: string;
}

// Deterministic harvest labels so the demo feels "fresh this week".
const HARVEST_DATES: Record<string, string> = {
  "prod-1": "25 Sep",
  "prod-2": "24 Sep",
  "prod-3": "26 Sep",
  "prod-4": "23 Sep",
  "prod-5": "24 Sep",
  "prod-6": "25 Sep",
  "prod-7": "22 Sep",
};

function gradeFrom(listing: ProduceListing): string {
  const direct = listing.breakdown.qualityGrade.grade;
  if (direct) return direct;
  const m = /Grade ([ABC])/.exec(listing.openCvMetrics.status);
  return m ? m[1] : "A";
}

function adapt(listing: ProduceListing, index: number): ConsumerProduct {
  return {
    id: listing.id,
    name: listing.name,
    hindiName: listing.hindiName,
    category: listing.category,
    imageUrl: listing.imageUrl,
    farmerName: listing.farmerName,
    farmerPhoto: listing.farmerPhoto ?? FARMER_PHOTOS[index % FARMER_PHOTOS.length],
    village: listing.village,
    district: listing.district,
    distanceKm: listing.distanceKm,
    harvestDate: listing.harvestDate ?? HARVEST_DATES[listing.id] ?? "24 Sep",
    grade: gradeFrom(listing),
    rating: listing.breakdown.reliability.rating ?? 4.5,
    verified: true,
    // Mock grain lots are priced per quintal; consumers see per-kg.
    pricePerKg: Math.round((listing.farmGatePrice / 100) * 10) / 10,
    retailPricePerKg: Math.round((listing.mandiBenchmarkPrice / 100) * 10) / 10,
    unit: "kg",
    gradeSpec: listing.gradeSpec ?? listing.breakdown.qualityGrade.detail,
    openCvStatus: listing.openCvMetrics.status,
    lotQuintal: listing.quantityAvailable,
    description: listing.breakdown.qualityGrade.detail,
  };
}

export const CONSUMER_PRODUCTS: ConsumerProduct[] = MOCK_PRODUCE_LISTINGS.map(adapt);

export function getConsumerProduct(id: string | undefined): ConsumerProduct | undefined {
  return CONSUMER_PRODUCTS.find((p) => p.id === id);
}

// ---------- Weekly basket: favourite farmers ----------

export interface BasketFarmer {
  farmerId: string;
  name: string;
  photo: string;
  village: string;
  distanceKm: number;
  crops: string[];
  rating: number;
}

export const WEEKLY_BASKET_FARMERS: BasketFarmer[] = [
  {
    farmerId: "u-farmer-1",
    name: "रामेश्वर पाटिल (Rameshwar Patil)",
    photo: FARMER_PHOTOS[0],
    village: "सांवेर क्लस्टर",
    distanceKm: 6.2,
    crops: ["Sharbati Wheat", "Soyabean"],
    rating: 4.9,
  },
  {
    farmerId: "u-farmer-3",
    name: "कैलाश चंद्र दांगी (Kailash Dangi)",
    photo: FARMER_PHOTOS[2],
    village: "सांवेर क्लस्टर",
    distanceKm: 9.4,
    crops: ["Soyabean JS-9560"],
    rating: 4.7,
  },
  {
    farmerId: "u-farmer-5",
    name: "मोहनलाल मीणा (Mohanlal Meena)",
    photo: FARMER_PHOTOS[1],
    village: "सांवेर क्लस्टर",
    distanceKm: 18.5,
    crops: ["Bajra (Shri Anna)"],
    rating: 4.8,
  },
];

// ---------- Harvest alerts ----------

export interface HarvestAlert {
  id: string;
  farmerName: string;
  photo: string;
  crop: string;
  expectedDate: string;
  qtyAvailable: string;
  productId: string;
}

export const HARVEST_ALERTS: HarvestAlert[] = [
  {
    id: "alert-1",
    farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
    photo: FARMER_PHOTOS[0],
    crop: "MP Sharbati Golden Wheat",
    expectedDate: "Mon, 29 Sep",
    qtyAvailable: "150 kg",
    productId: "prod-1",
  },
  {
    id: "alert-2",
    farmerName: "सुरेश पटेल (Suresh Patel)",
    photo: FARMER_PHOTOS[3],
    crop: "Pioneer Hybrid Yellow Maize",
    expectedDate: "Wed, 1 Oct",
    qtyAvailable: "200 kg",
    productId: "prod-4",
  },
  {
    id: "alert-3",
    farmerName: "राधेश्याम पाटीदार (Radheshyam Patidar)",
    photo: FARMER_PHOTOS[1],
    crop: "Malwa Dollar Chana",
    expectedDate: "Fri, 3 Oct",
    qtyAvailable: "120 kg",
    productId: "prod-7",
  },
];

// ---------- Order mocks with escrow state (fallback when API is empty) ----------

export type EscrowState = "locked" | "released";

export interface ConsumerOrder {
  id: string;
  crop: string;
  farmerName: string;
  quantityKg: number;
  totalAmount: number;
  status: string;
  pickupCode?: string;
  escrow: EscrowState;
  createdAt: string;
}

export const MOCK_CONSUMER_ORDERS: ConsumerOrder[] = [
  {
    id: "o-1",
    crop: "MP Sharbati Golden Wheat",
    farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
    quantityKg: 25,
    totalAmount: 662.5,
    status: "paid",
    pickupCode: "4821",
    escrow: "locked",
    createdAt: "26 Sep 2026",
  },
  {
    id: "o-2",
    crop: "Yellow Soyabean JS-9560",
    farmerName: "कैलाश चंद्र दांगी (Kailash Dangi)",
    quantityKg: 10,
    totalAmount: 395,
    status: "delivered",
    pickupCode: "7390",
    escrow: "released",
    createdAt: "20 Sep 2026",
  },
];

export function escrowFromStatus(status: string): EscrowState {
  return status === "delivered" ? "released" : "locked";
}

/** Fallback order used by the track page when the API has no record. */
export function mockConsumerOrder(id: string): ConsumerOrder {
  return (
    MOCK_CONSUMER_ORDERS.find((o) => o.id === id) ?? {
      id,
      crop: "MP Sharbati Golden Wheat",
      farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
      quantityKg: 25,
      totalAmount: 662.5,
      status: "in_transit",
      pickupCode: "4821",
      escrow: "locked",
      createdAt: "26 Sep 2026",
    }
  );
}

// ---------- Delivery timeline ----------

export interface TimelineStep {
  key: string;
  labelKey: string;
  subKey: string;
}

/** Fixed 6-step delivery journey ending in PIN handover + payout release. */
export const ORDER_TIMELINE: TimelineStep[] = [
  { key: "placed", labelKey: "consumer_step_placed", subKey: "consumer_step_placed_sub" },
  { key: "packed", labelKey: "consumer_step_packed", subKey: "consumer_step_packed_sub" },
  { key: "transit", labelKey: "consumer_step_transit", subKey: "consumer_step_transit_sub" },
  { key: "out", labelKey: "consumer_step_out", subKey: "consumer_step_out_sub" },
  { key: "pin", labelKey: "consumer_step_pin", subKey: "consumer_step_pin_sub" },
  { key: "payout", labelKey: "consumer_step_payout", subKey: "consumer_step_payout_sub" },
];

/** Map an order status onto the 6-step timeline index. */
export function timelineIndexForStatus(status: string): number {
  switch (status) {
    case "requested":
    case "accepted":
    case "paid":
      return 0;
    case "assigned":
      return 1;
    case "picked_up":
    case "in_transit":
      return 2;
    case "out_for_delivery":
      return 3;
    case "delivered":
      return 5;
    case "disputed":
    case "cancelled":
      return -1;
    default:
      return 2;
  }
}

// ---------- Dispute issue types ----------

export interface IssueType {
  key: string;
  labelKey: string;
}

export const DISPUTE_ISSUE_TYPES: IssueType[] = [
  { key: "quality", labelKey: "consumer_issue_quality" },
  { key: "short_qty", labelKey: "consumer_issue_short_qty" },
  { key: "late", labelKey: "consumer_issue_late" },
  { key: "damaged", labelKey: "consumer_issue_damaged" },
  { key: "wrong_item", labelKey: "consumer_issue_wrong_item" },
];
