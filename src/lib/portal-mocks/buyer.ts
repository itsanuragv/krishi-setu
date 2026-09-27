/**
 * Bulk Buyer (HoReCa procurement) portal mocks.
 * New mock data lives here ONLY — shared files are never edited.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeliverySlot } from "@/components/portals";
import type { PriceSlab } from "@/components/portals";
import type { ProduceListing } from "@/lib/mock-data";

/* ---------------- Cart ---------------- */

export interface CartItem {
  listingId: string;
  name: string;
  farmerName: string;
  qtyKg: number;
  unitPrice: number; // ₹/kg at the active slab when added
  unit: string;
}

const CART_KEY = "ks_buyer_cart_v2";
const CART_EVENT = "ks:buyer-cart-v2";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable — state still works in-memory via event
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

/** Shared bulk-buyer cart (localStorage-backed, same-tab sync via event). */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const cur = readCart();
    const i = cur.findIndex((c) => c.listingId === item.listingId);
    if (i >= 0) {
      cur[i] = {
        ...cur[i],
        qtyKg: cur[i].qtyKg + item.qtyKg,
        unitPrice: item.unitPrice,
      };
    } else {
      cur.push(item);
    }
    writeCart(cur);
  }, []);

  const remove = useCallback((listingId: string) => {
    writeCart(readCart().filter((c) => c.listingId !== listingId));
  }, []);

  const setQty = useCallback((listingId: string, qtyKg: number) => {
    const cur = readCart().map((c) =>
      c.listingId === listingId ? { ...c, qtyKg: Math.max(0, qtyKg) } : c
    );
    writeCart(cur.filter((c) => c.qtyKg > 0));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const count = items.length;
  const totalQtyKg = items.reduce((s, c) => s + c.qtyKg, 0);
  const subtotal = items.reduce((s, c) => s + c.qtyKg * c.unitPrice, 0);

  return { items, add, remove, setQty, clear, count, totalQtyKg, subtotal };
}

export interface VendorGroup {
  vendor: string;
  items: CartItem[];
  qtyKg: number;
  total: number;
}

/** Group cart items by farmer/vendor for per-vendor PO splitting. */
export function groupCartByVendor(items: CartItem[]): VendorGroup[] {
  const map = new Map<string, CartItem[]>();
  for (const i of items) {
    const arr = map.get(i.farmerName) ?? [];
    arr.push(i);
    map.set(i.farmerName, arr);
  }
  return [...map.entries()].map(([vendor, vendorItems]) => ({
    vendor,
    items: vendorItems,
    qtyKg: vendorItems.reduce((s, c) => s + c.qtyKg, 0),
    total: vendorItems.reduce((s, c) => s + c.qtyKg * c.unitPrice, 0),
  }));
}

/* ---------------- Slab pricing ---------------- */

/**
 * Deterministic 3-tier bulk slabs (₹/kg).
 * Uses listing.priceSlabs when present; otherwise derives tiers from farmGatePrice.
 */
export function slabsForListing(l: ProduceListing): PriceSlab[] {
  if (l.priceSlabs && l.priceSlabs.length >= 3) return l.priceSlabs;
  const perKg = l.farmGatePrice / 100;
  const r = (n: number) => Math.max(1, Math.round(n));
  return [
    { minQty: 50, price: r(perKg) },
    { minQty: 200, price: r(perKg * 0.94) },
    { minQty: 500, price: r(perKg * 0.88) },
  ];
}

/** Slab price unlocked by qtyKg (₹/kg). */
export function slabPriceFor(slabs: PriceSlab[], qtyKg: number): number {
  const sorted = [...slabs].sort((a, b) => a.minQty - b.minQty);
  let price = sorted[0]?.price ?? 0;
  for (const s of sorted) {
    if (qtyKg >= s.minQty) price = s.price;
  }
  return price;
}

/* ---------------- Quick order lists ---------------- */

export interface QuickOrderList {
  id: string;
  name: string;
  repeat: string;
  items: { listingId: string; qtyKg: number }[];
}

export const QUICK_ORDER_LISTS: QuickOrderList[] = [
  {
    id: "qol-1",
    name: "Weekly Kitchen Vegetables",
    repeat: "Weekly",
    items: [
      { listingId: "prod-1", qtyKg: 120 },
      { listingId: "prod-3", qtyKg: 80 },
    ],
  },
  {
    id: "qol-2",
    name: "Grain & Pulse Refill",
    repeat: "Weekly",
    items: [
      { listingId: "prod-1", qtyKg: 500 },
      { listingId: "prod-7", qtyKg: 300 },
    ],
  },
];

/* ---------------- Standing orders ---------------- */

export interface StandingOrder {
  id: string;
  crop: string;
  qtyKg: number;
  vendor: string;
  frequency: string;
  due: "today" | "tomorrow";
}

export const STANDING_ORDERS: StandingOrder[] = [
  {
    id: "so-1",
    crop: "Sharbati Wheat",
    qtyKg: 500,
    vendor: "Sanwer FPO Collective",
    frequency: "Weekly",
    due: "today",
  },
  {
    id: "so-2",
    crop: "Yellow Soyabean JS-9560",
    qtyKg: 300,
    vendor: "Rameshwar Patil",
    frequency: "Weekly",
    due: "today",
  },
  {
    id: "so-3",
    crop: "Dollar Chana (Kabuli)",
    qtyKg: 200,
    vendor: "Dewas FPO Collective",
    frequency: "Weekly",
    due: "tomorrow",
  },
];

/* ---------------- Delivery slots (6 AM kitchen-prep) ---------------- */

export const KITCHEN_SLOTS: DeliverySlot[] = [
  { id: "slot-1", label: "6:00 – 8:00 AM", sub: "Kitchen prep · today", available: false },
  { id: "slot-2", label: "8:00 – 10:00 AM", sub: "Kitchen prep · today", available: true },
  { id: "slot-3", label: "10:00 AM – 12 PM", sub: "Midday restock", available: true },
  { id: "slot-4", label: "2:00 – 4:00 PM", sub: "Afternoon restock", available: true },
  { id: "slot-5", label: "4:00 – 6:00 PM", sub: "Evening prep", available: false },
  { id: "slot-6", label: "6:00 – 8:00 AM", sub: "Kitchen prep · tomorrow", available: true },
];

export interface TodayDelivery {
  id: string;
  crop: string;
  qtyKg: number;
  vendor: string;
  slot: string;
  status: "arrived" | "in_transit" | "scheduled";
}

export const TODAY_DELIVERIES: TodayDelivery[] = [
  {
    id: "td-1",
    crop: "Sharbati Wheat",
    qtyKg: 500,
    vendor: "Sanwer FPO Collective",
    slot: "6:00 – 8:00 AM",
    status: "arrived",
  },
  {
    id: "td-2",
    crop: "Yellow Soyabean JS-9560",
    qtyKg: 300,
    vendor: "Rameshwar Patil",
    slot: "8:00 – 10:00 AM",
    status: "in_transit",
  },
  {
    id: "td-3",
    crop: "Dollar Chana (Kabuli)",
    qtyKg: 200,
    vendor: "Dewas FPO Collective",
    slot: "10:00 AM – 12 PM",
    status: "scheduled",
  },
];

/* ---------------- Spend ---------------- */

export const MONTH_SPEND = {
  total: 1847500,
  vsLastMonthPct: -8,
  activePos: 5,
};
