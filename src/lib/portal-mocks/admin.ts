import { MOCK_DISPUTE, type DisputeCase } from "@/lib/mock-data";

/** Admin-only mock data. Deterministic — safe to extend, never touches shared mocks. */

export const MOCK_DISPUTES: DisputeCase[] = [
  MOCK_DISPUTE,
  {
    id: "DISP-2026-8874",
    orderNumber: "KS-ORD-4791",
    cropName: "Nashik Red Onion (Lot #ON-2214)",
    batchWeight: "250 Quintal (5,000 mesh bags)",
    escrowAmount: 425000,
    farmer: {
      name: "Bhagwan Rathod",
      location: "Lasalgaon, Nashik (MH)",
      trustScore: 91,
      bankAccount: "BOI A/C ***7742 (UPI: bhagwan@okboi)",
    },
    buyer: {
      name: "FreshKart Retail Procurement",
      business: "FreshKart Retail Chain",
      location: "Andheri East, Mumbai (MH)",
    },
    farmerDispatchPhoto:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    farmerOpenCvStats: {
      grade: "Grade A (uniform 55–70mm bulbs)",
      blurScore: 93,
      colorUniformity: 95,
      timestamp: "Yesterday 06:40 PM at Lasalgaon Hub",
    },
    buyerReportedPhoto:
      "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=600&auto=format&fit=crop&q=80",
    buyerComplaint:
      "~8% of bags arrived with soft-neck rot. Buyer claims cold-chain deviation during Nagpur transit halt.",
    aiDiscrepancyAnalysis:
      "Dispatch assay showed 96.2% sound bulbs. Arrival photo sampling suggests rot is localised to 2 pallet stacks near the tailgate — consistent with a ~9-hour unventilated halt, not farm-gate quality.",
    recommendedAction:
      "Split: release 92% (₹3,91,000) to Farmer; credit 8% (₹34,000) transit-loss allowance to Buyer from Logistics buffer; flag transporter for ventilation audit.",
    status: "Pending Mediation",
  },
  {
    id: "DISP-2026-8790",
    orderNumber: "KS-ORD-4655",
    cropName: "Desi Tamatar (Lot #TM-7718)",
    batchWeight: "12 Quintal (600 crates)",
    escrowAmount: 26400,
    farmer: {
      name: "Gajanan Patidar",
      location: "Sanwer, Indore (MP)",
      trustScore: 87,
      bankAccount: "HDFC A/C ***3350 (UPI: gajanan@okhdfc)",
    },
    buyer: {
      name: "Hotel Shreemaya",
      business: "HoReCa · Indore",
      location: "AB Road, Indore (MP)",
    },
    farmerDispatchPhoto:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    farmerOpenCvStats: {
      grade: "Grade A (firm, no cracking)",
      blurScore: 90,
      colorUniformity: 92,
      timestamp: "2 days ago 07:05 AM at Sanwer Hub",
    },
    buyerReportedPhoto:
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&auto=format&fit=crop&q=80",
    buyerComplaint:
      "40 crates had overripe/soft tomatoes. Hotel kitchen rejected them — wants partial refund for the rejected crates.",
    aiDiscrepancyAnalysis:
      "Arrival photos confirm overripeness in ~6.7% of crates, all from the top layer — consistent with heat build-up from overstacking, not farm-gate grading failure. Farmer's OpenCV batch record shows no overripe flags at dispatch.",
    recommendedAction:
      "Split: release 93% (₹24,552) to Farmer; refund 7% (₹1,848) to Buyer for rejected crates; issue stacking advisory to transporter.",
    status: "Pending Mediation",
  },
];

/** How long each dispute has been waiting for a decision (mock SLA signal). */
export const DISPUTE_WAIT: Record<string, string> = {
  "DISP-2026-8921": "14h in queue",
  "DISP-2026-8874": "31h in queue",
  "DISP-2026-8790": "52h in queue",
};

export interface ActivityItem {
  id: string;
  time: string;
  text: string;
  kind: "dispute" | "kyc" | "fraud" | "payout" | "listing";
}

export const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  { id: "a1", time: "12 min ago", text: "Dispute DISP-2026-8921 escalated — ₹3,40,000 escrow awaiting mediation", kind: "dispute" },
  { id: "a2", time: "38 min ago", text: "KYC approved: Dinesh Choudhary (Farmer, Sehore) — PM-KISAN verified", kind: "kyc" },
  { id: "a3", time: "1h ago", text: "Fraud signal: photo duplication on listing prod-118 (97% hash match)", kind: "fraud" },
  { id: "a4", time: "2h ago", text: "Payout released: ₹11,840 to Malwa Agro farmer pool (40 quintal Sharbati)", kind: "payout" },
  { id: "a5", time: "3h ago", text: "Listing prod-203 auto-listed after OpenCV pre-check (Grade A, blur 94)", kind: "listing" },
  { id: "a6", time: "4h ago", text: "KYC rejected: duplicate Aadhaar on application kyc-9", kind: "kyc" },
  { id: "a7", time: "5h ago", text: "Dispute DISP-2026-8790 — AI analysis ready, recommended split 93/7", kind: "dispute" },
];

/** GMV today ticker: starts here and ticks up while the page is open. */
export const GMV_TICKER_START = 186400;

/** 14-day GMV trend for the analytics sparkline (₹). Deterministic. */
export const MOCK_GMV_TREND: { day: string; gmv: number }[] = [
  { day: "14", gmv: 142000 },
  { day: "15", gmv: 168000 },
  { day: "16", gmv: 151000 },
  { day: "17", gmv: 186000 },
  { day: "18", gmv: 174000 },
  { day: "19", gmv: 201000 },
  { day: "20", gmv: 195000 },
  { day: "21", gmv: 164000 },
  { day: "22", gmv: 178000 },
  { day: "23", gmv: 212000 },
  { day: "24", gmv: 228000 },
  { day: "25", gmv: 205000 },
  { day: "26", gmv: 236000 },
  { day: "27", gmv: 186400 },
];

/** Orders placed by district for the bar-row chart (deterministic). */
export const MOCK_ORDERS_BY_DISTRICT: { district: string; orders: number }[] = [
  { district: "Indore", orders: 214 },
  { district: "Nashik", orders: 168 },
  { district: "Bhopal", orders: 142 },
  { district: "Ujjain", orders: 117 },
  { district: "Dewas", orders: 93 },
  { district: "Sehore", orders: 71 },
  { district: "Ratlam", orders: 54 },
];

/** Dispute rate per week (% of orders) for the trend line. */
export const MOCK_DISPUTE_RATE_TREND: { week: string; rate: number }[] = [
  { week: "W31", rate: 1.8 },
  { week: "W32", rate: 1.6 },
  { week: "W33", rate: 2.1 },
  { week: "W34", rate: 1.4 },
  { week: "W35", rate: 1.2 },
  { week: "W36", rate: 1.3 },
  { week: "W37", rate: 1.1 },
  { week: "W38", rate: 1.1 },
];

export const MOCK_PAYOUT_TAT = { value: 3.4, target: 4.0, unit: "hrs" };

export interface FraudThreshold {
  level: "friction" | "restrict" | "suspend";
  label: string;
  trigger: string;
  effect: string;
}

/** Enforcement ladder explainer for the fraud-review page. */
export const MOCK_FRAUD_THRESHOLDS: FraudThreshold[] = [
  {
    level: "friction",
    label: "Add friction",
    trigger: "1 low/medium signal, or first medium flag on an account.",
    effect: "Step-up verification before next action: OTP re-verify, mandatory photo re-scan, manual PIN confirm. No listing takedowns.",
  },
  {
    level: "restrict",
    label: "Restrict",
    trigger: "2+ medium signals, or 1 high signal, or a repeated offence within 90 days.",
    effect: "Listing cap (3/day), escrow auto-hold on new orders, trust score docked 10 pts. Account stays live but throttled.",
  },
  {
    level: "suspend",
    label: "Suspend",
    trigger: "1 confirmed high-severity fraud (collusion, refund gaming) or 3 restricted offences.",
    effect: "Account frozen immediately; open escrow held for mediation; case moved to the dispute queue. Appeal window 7 days.",
  },
];
