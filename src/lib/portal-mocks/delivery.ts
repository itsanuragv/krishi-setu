/**
 * Delivery-portal-only mock data (portal redesign v2).
 * Derived from the shared MOCK_DELIVERY_ROUTE in ../mock-data — never edit shared files.
 */
import { MOCK_DELIVERY_ROUTE } from "../mock-data";
import type { BatchStop } from "@/components/portals";

export const DELIVERY_PARTNER = {
  name: "Kailash Jadhav",
  fleet: "Rural Green Fleet",
  vehicle: "Eicher Pro Grain Carrier · MP-09-GH-8210",
  rating: 4.8,
  routeId: MOCK_DELIVERY_ROUTE.id,
};

export const DELIVERY_EARNINGS = {
  today: 640,
  week: 4320,
  perDelivery: 120,
};

export interface CompletedDelivery {
  id: string;
  title: string;
  area: string;
  amount: number;
  time: string;
}

export const DELIVERY_COMPLETED_TODAY: CompletedDelivery[] = [
  {
    id: "DLV-2601",
    title: "Soyabean JS-9560 · 12 Bori",
    area: "Sanwer → Pithampur",
    amount: 120,
    time: "07:40 AM",
  },
  {
    id: "DLV-2602",
    title: "Sharbati Wheat · 30 Bori",
    area: "Bilkisganj → Dewas Naka",
    amount: 150,
    time: "09:05 AM",
  },
  {
    id: "DLV-2603",
    title: "Maize Lot · 20 Bori",
    area: "Sanwer → Indore Mandi",
    amount: 110,
    time: "10:20 AM",
  },
  {
    id: "DLV-2604",
    title: "Soyabean JS-9560 · 8 Bori",
    area: "Dewas Naka → Sanwer Mills",
    amount: 120,
    time: "11:55 AM",
  },
  {
    id: "DLV-2605",
    title: "Sharbati Wheat · 18 Bori",
    area: "Pithampur Silo → Indore",
    amount: 140,
    time: "01:10 PM",
  },
];

/** Demo buyer-side 4-digit PIN for the delivery step of the money moment. */
export const DELIVERY_BUYER_PIN = "3194";

/** Escrow payout breakdown shown on the success screen. */
export const DELIVERY_PAYOUT = {
  escrowId: "ESC-26033-118",
  orderTitle: "Yellow Soyabean JS-9560 · 12 Bori",
  farmerName: "Kailash Choudhary",
  buyerName: "Malwa Protein & Oil Mills",
  farmerPayout: 18240,
  deliveryFee: 120,
};

/** Build the batch manifest from the shared route mock (optimised stop order). */
export function deliveryStops(): BatchStop[] {
  return MOCK_DELIVERY_ROUTE.stops.map((s) => ({
    id: `stop-${s.step}`,
    title: s.title,
    address: `${s.crop} — ${s.location}`,
    kind: s.role === "Farmer Pickup" ? ("pickup" as const) : ("drop" as const),
    packages: s.quantity,
    status:
      s.status === "completed"
        ? ("done" as const)
        : s.status === "scheduled"
          ? ("upcoming" as const)
          : ("current" as const),
  }));
}
