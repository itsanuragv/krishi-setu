export interface ProduceListing {
  id: string;
  name: string;
  hindiName: string;
  category: "Vegetables" | "Fruits" | "Grains" | "Organic";
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  distanceKm: number;
  quantityAvailable: number;
  unit: string;
  farmGatePrice: number; // ₹
  mandiBenchmarkPrice: number; // ₹ (APMC Mandi retail)
  imageUrl: string;
  matchScore: number;
  breakdown: {
    priceIndex: { score: number; detail: string };
    distance: { score: number; detail: string };
    qualityGrade: { score: number; detail: string; grade?: string };
    quantityFit: { score: number; detail: string };
    reliability: { score: number; detail: string; rating?: number };
  };
  openCvMetrics: {
    blurScore: number; // 0-100
    brightnessPct: number; // 0-100
    resolution: string;
    status: "Passed Pre-Check - Auto-Listed" | "Review Required";
  };
}

export interface DeliveryRoute {
  id: string;
  transporterName: string;
  vehicleNumber: string;
  totalDistanceKm: number;
  distanceSavedKm: number;
  fuelReducedPct: number;
  totalPayoutAmount: number;
  requiredPin: string;
  stops: {
    step: number;
    title: string;
    role: "Farmer Pickup" | "Consumer Drop-off" | "Bulk HoReCa Drop";
    location: string;
    crop: string;
    quantity: string;
    eta: string;
    status: "completed" | "in_transit" | "pending_pin" | "scheduled";
    isPinTarget?: boolean;
  }[];
}

export interface DisputeCase {
  id: string;
  orderNumber: string;
  cropName: string;
  batchWeight: string;
  escrowAmount: number;
  farmer: {
    name: string;
    location: string;
    trustScore: number;
    bankAccount: string;
  };
  buyer: {
    name: string;
    business: string;
    location: string;
  };
  farmerDispatchPhoto: string;
  farmerOpenCvStats: {
    grade: string;
    blurScore: number;
    colorUniformity: number;
    timestamp: string;
  };
  buyerReportedPhoto: string;
  buyerComplaint: string;
  aiDiscrepancyAnalysis: string;
  recommendedAction: string;
  status: "Pending Mediation" | "Resolved - Payout Completed" | "Split Mediated";
}

export const MOCK_PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: "prod-1",
    name: "Farm-Fresh Desi Tomatoes",
    hindiName: "देसी ताजा टमाटर",
    category: "Vegetables",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45019",
    village: "Khed Khurd",
    district: "Pune, Maharashtra",
    distanceKm: 6.2,
    quantityAvailable: 450,
    unit: "kg",
    farmGatePrice: 38,
    mandiBenchmarkPrice: 56,
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    matchScore: 97,
    breakdown: {
      priceIndex: { score: 98, detail: "32% lower than Swargate Mandi rate (₹56/kg)" },
      distance: { score: 96, detail: "6.2 km (<1 hour from farm vine to kitchen)" },
      qualityGrade: { score: 99, detail: "Grade A OpenCV verified — Zero transit bruising" },
      quantityFit: { score: 95, detail: "100% exact batch size matching order needs" },
      reliability: { score: 98, detail: "99.4% historical fulfillment, 4.9★ Trust Score" },
    },
    openCvMetrics: {
      blurScore: 94,
      brightnessPct: 88,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
  {
    id: "prod-2",
    name: "Nashik Red Export Onions",
    hindiName: "नासिक लाल प्याज",
    category: "Vegetables",
    farmerName: "Babanrao Shinde",
    farmerPhone: "+91 94210 88219",
    village: "Lasalgaon Road",
    district: "Nashik, Maharashtra",
    distanceKm: 14.8,
    quantityAvailable: 1200,
    unit: "kg",
    farmGatePrice: 24,
    mandiBenchmarkPrice: 42,
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    matchScore: 94,
    breakdown: {
      priceIndex: { score: 95, detail: "43% direct savings over APMC middlemen bids" },
      distance: { score: 91, detail: "14.8 km via NH-60 corridor" },
      qualityGrade: { score: 96, detail: "Grade A, cured skins, dry neck closure verified" },
      quantityFit: { score: 96, detail: "Supports split consumer bags or wholesale bulk" },
      reliability: { score: 93, detail: "48 successfully delivered escrow orders" },
    },
    openCvMetrics: {
      blurScore: 91,
      brightnessPct: 84,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
  {
    id: "prod-3",
    name: "Organic Shimla Green Capsicum",
    hindiName: "हरी शिमला मिर्च",
    category: "Vegetables",
    farmerName: "Anusaya Tai Jadhav",
    farmerPhone: "+91 97632 19283",
    village: "Chakan Agri Belt",
    district: "Pune, Maharashtra",
    distanceKm: 8.4,
    quantityAvailable: 280,
    unit: "kg",
    farmGatePrice: 45,
    mandiBenchmarkPrice: 70,
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80",
    matchScore: 92,
    breakdown: {
      priceIndex: { score: 92, detail: "36% cheaper than premium supermarket shelf price" },
      distance: { score: 94, detail: "8.4 km direct polyhouse dispatch" },
      qualityGrade: { score: 97, detail: "Firm wall thickness, zero pest spots detected" },
      quantityFit: { score: 90, detail: "Optimal lot for retail grocers and HoReCa" },
      reliability: { score: 95, detail: "100% on-time dispatch record" },
    },
    openCvMetrics: {
      blurScore: 95,
      brightnessPct: 91,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
  {
    id: "prod-4",
    name: "Khadki Organic Potatoes (Chandramukhi)",
    hindiName: "चंद्रमुखी जैविक आलू",
    category: "Vegetables",
    farmerName: "Govind Jagtap",
    farmerPhone: "+91 99754 31201",
    village: "Alandi Rural",
    district: "Pune, Maharashtra",
    distanceKm: 11.2,
    quantityAvailable: 800,
    unit: "kg",
    farmGatePrice: 22,
    mandiBenchmarkPrice: 34,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    matchScore: 89,
    breakdown: {
      priceIndex: { score: 91, detail: "35% direct-to-farm advantage" },
      distance: { score: 92, detail: "11.2 km PostGIS radius" },
      qualityGrade: { score: 92, detail: "Even size sorting (50-60mm standard)" },
      quantityFit: { score: 94, detail: "Available in 25kg & 50kg jute sacks" },
      reliability: { score: 90, detail: "Verified PM-KISAN Aadhaar ID holder" },
    },
    openCvMetrics: {
      blurScore: 89,
      brightnessPct: 82,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
  {
    id: "prod-5",
    name: "Sharbati Golden Whole Wheat",
    hindiName: "शरबती शरबती गेहूं",
    category: "Grains",
    farmerName: "Devram Ghorpade",
    farmerPhone: "+91 93701 44820",
    village: "Shirur Taluka",
    district: "Pune Rural, Maharashtra",
    distanceKm: 23.5,
    quantityAvailable: 2500,
    unit: "kg",
    farmGatePrice: 32,
    mandiBenchmarkPrice: 48,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    matchScore: 88,
    breakdown: {
      priceIndex: { score: 94, detail: "₹16/kg farmer floor realization gain" },
      distance: { score: 84, detail: "23.5 km (<25km cluster radius threshold)" },
      qualityGrade: { score: 95, detail: "Moisture 11.2%, heavy golden lustre" },
      quantityFit: { score: 98, detail: "High capacity for FPO aggregation" },
      reliability: { score: 96, detail: "FPO Kisan Vikas Kendra board member" },
    },
    openCvMetrics: {
      blurScore: 92,
      brightnessPct: 86,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
  {
    id: "prod-6",
    name: "Ratnagiri Alphonso Mangoes (GI Tagged)",
    hindiName: "रत्नागिरी हापूस आम",
    category: "Fruits",
    farmerName: "Shantaram Sawant",
    farmerPhone: "+91 94224 81920",
    village: "Rajapur Cluster",
    district: "Ratnagiri, Maharashtra",
    distanceKm: 34.0,
    quantityAvailable: 150,
    unit: "dozens",
    farmGatePrice: 650,
    mandiBenchmarkPrice: 1100,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80",
    matchScore: 84,
    breakdown: {
      priceIndex: { score: 97, detail: "41% lower than city fruit market markups" },
      distance: { score: 72, detail: "34 km direct refrigerated van dispatch" },
      qualityGrade: { score: 98, detail: "Naturally ripened on straw beds, carbide-free" },
      quantityFit: { score: 86, detail: "Packaged in cushioned 1-dozen gift cartons" },
      reliability: { score: 99, detail: "5.0★ GI certified heritage grove" },
    },
    openCvMetrics: {
      blurScore: 96,
      brightnessPct: 94,
      resolution: "1080p Verified",
      status: "Passed Pre-Check - Auto-Listed",
    },
  },
];

export const MOCK_DELIVERY_ROUTE: DeliveryRoute = {
  id: "ROUTE-MH12-VRP-04",
  transporterName: "Kailash Jadhav (Rural Green Fleet)",
  vehicleNumber: "Tata Ace EV (MH-12-EF-4091)",
  totalDistanceKm: 42.6,
  distanceSavedKm: 18.4,
  fuelReducedPct: 28,
  totalPayoutAmount: 14500,
  requiredPin: "7429",
  stops: [
    {
      step: 1,
      title: "Farm-Gate Dispatch #1",
      role: "Farmer Pickup",
      location: "Rameshwar Patil Farm, Khed Khurd",
      crop: "Farm-Fresh Tomatoes (150 kg)",
      quantity: "6 Crates",
      eta: "08:15 AM",
      status: "completed",
    },
    {
      step: 2,
      title: "Farm-Gate Dispatch #2",
      role: "Farmer Pickup",
      location: "Babanrao Shinde Farm, Lasalgaon",
      crop: "Nashik Red Onions (300 kg)",
      quantity: "6 Jute Sacks",
      eta: "09:10 AM",
      status: "completed",
    },
    {
      step: 3,
      title: "Urban Consumer Handover",
      role: "Consumer Drop-off",
      location: "Priya Sharma, Baner Hill View, Pune",
      crop: "50kg Tomato + 25kg Onion Order",
      quantity: "Direct-to-Kitchen Batch",
      eta: "10:30 AM (Active Now)",
      status: "pending_pin",
      isPinTarget: true,
    },
    {
      step: 4,
      title: "Commercial HoReCa Delivery",
      role: "Bulk HoReCa Drop",
      location: "Hotel Annapurna Kitchen, FC Road, Pune",
      crop: "100kg Tomato + 275kg Onion",
      quantity: "Commercial Contract",
      eta: "11:45 AM",
      status: "scheduled",
    },
  ],
};

export const MOCK_DISPUTE: DisputeCase = {
  id: "DISP-SIH-8921",
  orderNumber: "KS-ORD-4820",
  cropName: "Fresh Desi Tomatoes (Batch #4820)",
  batchWeight: "200 kg (8 Crates)",
  escrowAmount: 7600,
  farmer: {
    name: "Rameshwar Patil",
    location: "Khed Khurd, Pune",
    trustScore: 98,
    bankAccount: "SBI A/C ***4891 (UPI: ramesh@oksbi)",
  },
  buyer: {
    name: "Siddharth Verma",
    business: "Hotel Annapurna Executive",
    location: "Shivajinagar, Pune",
  },
  farmerDispatchPhoto: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
  farmerOpenCvStats: {
    grade: "Grade A (97.8% Pristine)",
    blurScore: 94,
    colorUniformity: 96,
    timestamp: "Today 08:15 AM at Farm Gate",
  },
  buyerReportedPhoto: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80",
  buyerComplaint: "Bottom crate sustained road vibration bruising during final 3km city potholes. 15kg showing soft spots.",
  aiDiscrepancyAnalysis:
    "OpenCV edge diff confirms dispatch state was 98% pristine at farm gate. Damage is localized to bottom 7.5% volume during transit handling. Farmer acted in full compliance with harvesting standard APMC-2023.",
  recommendedAction:
    "Disburse 92% (₹6,992) to Farmer's UPI ledger immediately; refund 8% (₹608) transit allowance to Buyer from Logistics buffer.",
  status: "Pending Mediation",
};

export const ADMIN_KPIS = {
  totalEscrowGmv: "₹18,42,500",
  spoilageReductionPct: "32.4%",
  activeProximityNodes: 142,
  avgDispatchHours: "6.8 hrs",
  farmersOnboarded: "3,890",
  intermediaryCutBypassed: "41.8%",
};
