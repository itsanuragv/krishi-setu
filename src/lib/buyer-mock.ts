/**
 * Buyer-portal mock data: demands (RFQs), forward contracts, mandi price
 * intelligence and the demo buyer profile. All values mirror the
 * MOCK_PRODUCE_LISTINGS economics so the portal feels internally consistent.
 */

export interface BuyerDemand {
  id: string;
  crop: string;
  cropHi: string;
  quantity: number;
  unit: string;
  grade: string;
  targetPrice: number; // ₹ per unit the buyer wants
  mandiPrice: number; // ₹ per unit reference
  deliveryBy: string;
  deliveryLocation: string;
  status: "open" | "matched" | "fulfilled";
  bids: number;
  postedAgo: string;
  postedAgoHi: string;
}

export interface BuyerContract {
  id: string;
  contractNo: string;
  lotName: string;
  lotNameHi: string;
  counterparty: string;
  counterpartyHi: string;
  counterpartyType: "FPO" | "Farmer";
  quantity: number;
  unit: string;
  agreedPrice: number; // ₹ per unit
  mandiPrice: number; // ₹ per unit reference
  escrowStage: 0 | 1 | 2 | 3;
  escrowAmount: number; // ₹ locked
  deliveryDate: string;
  handoverPin: string; // demo PIN shown to buyer for the handshake
  status: "active" | "in_transit" | "qc_pending" | "settled";
}

export interface MandiIntelRow {
  crop: string;
  cropHi: string;
  mandiPrice: number;
  farmGateAvg: number;
  arrivals: string;
  trend: "up" | "down" | "stable";
  trendPct: number;
}

export const BUYER_PROFILE = {
  name: "Malwa Agro Mills",
  nameHi: "मालवा एग्रो मिल्स",
  type: "Flour Mill & Grain Processor",
  typeHi: "आटा मिल एवं अनाज प्रोसेसर",
  location: "Pithampur Industrial Area, MP",
  gstVerified: true,
  credibilityScore: 94,
  credibilityGrade: "AA+",
  escrowBalance: 840000,
  memberSince: "2024",
};

/** Extract a short "Grade X" label from an assay detail string. */
export function extractGrade(detail: string): string {
  const m = detail.match(/Grade\s*([ABC])/i) || detail.match(/ग्रेड-?([एबीसी])/);
  if (!m) return "Grade A";
  const map: Record<string, string> = { A: "Grade A", B: "Grade B", C: "Grade C", "ए": "Grade A", "बी": "Grade B", "सी": "Grade C" };
  return map[m[1]] ?? "Grade A";
}

/** Extract a moisture % figure from an assay detail string, if present. */
export function extractMoisture(detail: string): string | null {
  const m = detail.match(/(\d+(?:\.\d+)?)\s*%\s*नमी/) || detail.match(/(\d+(?:\.\d+)?)\s*%\s*moisture/i);
  return m ? `${m[1]}%` : null;
}

export const MOCK_DEMANDS: BuyerDemand[] = [
  {
    id: "dem-1",
    crop: "MP Sharbati Wheat",
    cropHi: "शरबती गेहूं",
    quantity: 500,
    unit: "quintal",
    grade: "Grade A",
    targetPrice: 2700,
    mandiPrice: 3400,
    deliveryBy: "15 Nov 2026",
    deliveryLocation: "Pithampur Plant Gate",
    status: "open",
    bids: 14,
    postedAgo: "2 days ago",
    postedAgoHi: "2 दिन पहले",
  },
  {
    id: "dem-2",
    crop: "Yellow Soyabean",
    cropHi: "पीला सोयाबीन",
    quantity: 300,
    unit: "quintal",
    grade: "Grade A",
    targetPrice: 4900,
    mandiPrice: 5600,
    deliveryBy: "30 Nov 2026",
    deliveryLocation: "Pithampur Plant Gate",
    status: "matched",
    bids: 9,
    postedAgo: "5 days ago",
    postedAgoHi: "5 दिन पहले",
  },
  {
    id: "dem-3",
    crop: "Pusa 1121 Basmati Paddy",
    cropHi: "पूसा 1121 बासमती धान",
    quantity: 200,
    unit: "quintal",
    grade: "Grade A",
    targetPrice: 5800,
    mandiPrice: 7200,
    deliveryBy: "10 Dec 2026",
    deliveryLocation: "Pithampur Plant Gate",
    status: "open",
    bids: 6,
    postedAgo: "1 week ago",
    postedAgoHi: "1 सप्ताह पहले",
  },
];

export const MOCK_CONTRACTS: BuyerContract[] = [
  {
    id: "con-1",
    contractNo: "KS-C-2026-1042",
    lotName: "MP Sharbati Golden Wheat",
    lotNameHi: "सीहोर शरबती प्रीमियम गेहूं",
    counterparty: "Sanwer FPO Collective",
    counterpartyHi: "सांवेर FPO समूह",
    counterpartyType: "FPO",
    quantity: 150,
    unit: "quintal",
    agreedPrice: 2650,
    mandiPrice: 3400,
    escrowStage: 2,
    escrowAmount: 397500,
    deliveryDate: "28 Oct 2026",
    handoverPin: "7429",
    status: "in_transit",
  },
  {
    id: "con-2",
    contractNo: "KS-C-2026-1038",
    lotName: "Yellow Soyabean Bold Grain",
    lotNameHi: "पीला सोयाबीन बोल्ड दाना",
    counterparty: "Rameshwar Patil",
    counterpartyHi: "रामेश्वर पाटिल",
    counterpartyType: "Farmer",
    quantity: 120,
    unit: "quintal",
    agreedPrice: 4850,
    mandiPrice: 5600,
    escrowStage: 1,
    escrowAmount: 582000,
    deliveryDate: "02 Nov 2026",
    handoverPin: "3817",
    status: "active",
  },
  {
    id: "con-3",
    contractNo: "KS-C-2026-1021",
    lotName: "Malwa Dollar Chana",
    lotNameHi: "मालवा डॉलर चना",
    counterparty: "Dewas FPO Collective",
    counterpartyHi: "देवास FPO समूह",
    counterpartyType: "FPO",
    quantity: 80,
    unit: "quintal",
    agreedPrice: 6800,
    mandiPrice: 7900,
    escrowStage: 3,
    escrowAmount: 0,
    deliveryDate: "18 Oct 2026",
    handoverPin: "9054",
    status: "settled",
  },
];

export const MOCK_MANDI_INTEL: MandiIntelRow[] = [
  { crop: "Sharbati Wheat", cropHi: "शरबती गेहूं", mandiPrice: 3400, farmGateAvg: 2650, arrivals: "1,240 qtl", trend: "up", trendPct: 2.4 },
  { crop: "Basmati Paddy", cropHi: "बासमती धान", mandiPrice: 7200, farmGateAvg: 5600, arrivals: "860 qtl", trend: "up", trendPct: 1.8 },
  { crop: "Soyabean", cropHi: "सोयाबीन", mandiPrice: 5600, farmGateAvg: 4850, arrivals: "2,150 qtl", trend: "down", trendPct: 1.2 },
  { crop: "Dollar Chana", cropHi: "डॉलर चना", mandiPrice: 7900, farmGateAvg: 6800, arrivals: "640 qtl", trend: "stable", trendPct: 0.3 },
  { crop: "Hybrid Maize", cropHi: "संकर मक्का", mandiPrice: 3100, farmGateAvg: 2520, arrivals: "1,980 qtl", trend: "down", trendPct: 0.9 },
  { crop: "Yellow Mustard", cropHi: "पीली सरसों", mandiPrice: 6200, farmGateAvg: 5270, arrivals: "720 qtl", trend: "up", trendPct: 3.1 },
];

export const ESCROW_STAGE_LABELS = [
  { en: "Advance locked", hi: "एडवांस लॉक" },
  { en: "In transit", hi: "रास्ते में" },
  { en: "QC passed", hi: "गुणवत्ता स्वीकृत" },
  { en: "Settled", hi: "भुगतान पूर्ण" },
];
