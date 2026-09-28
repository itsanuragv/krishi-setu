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
  harvestDate?: string; // e.g. "24 Sep"
  farmerPhoto?: string;
  gradeSpec?: string; // e.g. "Grade A: 80–120g, no blemish"
  priceSlabs?: { minQty: number; price: number }[];
  payoutEtaDays?: number;
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
    status: "Passed Pre-Check - Auto-Listed" | "Review Required" | string;
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
    role: "Farmer Pickup" | "Consumer Drop-off" | "Bulk HoReCa Drop" | "Grain Silo Drop-off" | "Agro Processing Drop";
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
    name: "MP Sharbati Golden Wheat",
    hindiName: "सीहोर शरबती प्रीमियम गेहूं",
    category: "Grains",
    farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
    farmerPhone: "+91 98221 45019",
    village: "सांवेर क्लस्टर",
    district: "Indore, Madhya Pradesh",
    distanceKm: 6.2,
    quantityAvailable: 150,
    unit: "quintal",
    farmGatePrice: 2650,
    mandiBenchmarkPrice: 3400,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    matchScore: 98,
    breakdown: {
      priceIndex: { score: 98, detail: "₹750/क्विंटल शुद्ध अतिरिक्त लाभ पारंपरिक आढ़त के मुकाबले" },
      distance: { score: 96, detail: "6.2 km सांवेer वेयरहाउस हब के सीधे निकट" },
      qualityGrade: { score: 99, detail: "Grade A OpenCV Assayed — 10.4% नमी, चमकदार सुनहरा दाना" },
      quantityFit: { score: 96, detail: "150 क्विंटल लॉट आटा मिलों व रिटेल एग्रीगेटर्स के अनुकूल" },
      reliability: { score: 99, detail: "4.9★ PM-KISAN सत्यापित किसान लेजर" },
    },
    openCvMetrics: {
      blurScore: 95,
      brightnessPct: 90,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-2",
    name: "Pusa 1121 Basmati Paddy / Rice",
    hindiName: "पूसा 1121 बासमती धान / चावल",
    category: "Grains",
    farmerName: "दिग्विजय सिंह (Digvijay Singh)",
    farmerPhone: "+91 94210 88219",
    village: "रायसेन फार्म्स",
    district: "Raisen, Madhya Pradesh",
    distanceKm: 14.8,
    quantityAvailable: 240,
    unit: "quintal",
    farmGatePrice: 5600,
    mandiBenchmarkPrice: 7200,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    matchScore: 96,
    breakdown: {
      priceIndex: { score: 97, detail: "₹1,600/क्विंटल प्रीमियम एक्सपोर्ट ग्रेड चावल भाव" },
      distance: { score: 92, detail: "14.8 km भोपाल-रायसेन एग्री कॉरिडोर" },
      qualityGrade: { score: 98, detail: "Grade A, 8.4mm दाना लंबाई, 11.8% नमी, सुगंधित" },
      quantityFit: { score: 95, detail: "सीधे राइस मिलर्स व एक्सपोर्ट बायर्स के लिए उपयुक्त" },
      reliability: { score: 97, detail: "52 सफल एस्क्रो डिलीवरी रिकॉर्ड" },
    },
    openCvMetrics: {
      blurScore: 94,
      brightnessPct: 88,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-3",
    name: "Yellow Soyabean JS-9560",
    hindiName: "पीला सोयाबीन (JS-9560 बोल्ड दाना)",
    category: "Grains",
    farmerName: "कैलाश चंद्र दांगी (Kailash Dangi)",
    farmerPhone: "+91 97632 19283",
    village: "आष्टा क्लस्टर",
    district: "Sehore, Madhya Pradesh",
    distanceKm: 9.4,
    quantityAvailable: 180,
    unit: "quintal",
    farmGatePrice: 3950,
    mandiBenchmarkPrice: 4850,
    imageUrl: "https://images.pexels.com/photos/4518588/pexels-photo-4518588.jpeg?auto=compress&cs=tinysrgb&w=800",
    matchScore: 95,
    breakdown: {
      priceIndex: { score: 95, detail: "₹900/क्विंटल सीधा मुनाफा, 0% आढ़त कटौती" },
      distance: { score: 94, detail: "9.4 km सीहोर सोयाबीन बेल्ट" },
      qualityGrade: { score: 97, detail: "20.8% तेल अंश, 40% प्रोटीन, कचरा <0.5%" },
      quantityFit: { score: 94, detail: "सॉल्वेंट एक्सट्रैक्शन प्लांट व तेल मिलों के अनुकूल" },
      reliability: { score: 96, detail: "100% ऑन-टाइम डिस्पैच हिस्ट्री" },
    },
    openCvMetrics: {
      blurScore: 96,
      brightnessPct: 89,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-4",
    name: "Pioneer Hybrid Yellow Maize (Corn)",
    hindiName: "देशी हाइब्रिड पीला मक्का (कॉर्न)",
    category: "Grains",
    farmerName: "सुरेश पटेल (Suresh Patel)",
    farmerPhone: "+91 99754 31201",
    village: "छिंदवाड़ा एग्री बेल्ट",
    district: "Chhindwara, Madhya Pradesh",
    distanceKm: 12.2,
    quantityAvailable: 300,
    unit: "quintal",
    farmGatePrice: 1850,
    mandiBenchmarkPrice: 2350,
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    matchScore: 93,
    breakdown: {
      priceIndex: { score: 94, detail: "₹500/क्विंटल मंडी दलाल कटौती से बचत" },
      distance: { score: 91, detail: "12.2 km स्टार्च व पोल्ट्री फीड क्लस्टर" },
      qualityGrade: { score: 95, detail: "12% नमी, ठोस दाना, फंगस शून्य" },
      quantityFit: { score: 97, detail: "बल्क लॉट 300 क्विंटल उपलब्ध" },
      reliability: { score: 94, detail: "वेरिफाइड पीएम-किसान आधार कार्ड धारक" },
    },
    openCvMetrics: {
      blurScore: 92,
      brightnessPct: 85,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-5",
    name: "Desi Pearl Millet (Bajra) - Shri Anna",
    hindiName: "संकर देशी बाजरा (श्री अन्न)",
    category: "Grains",
    farmerName: "मोहनलाल मीणा (Mohanlal Meena)",
    farmerPhone: "+91 93701 44820",
    village: "मुरैना चंबल क्लस्टर",
    district: "Morena, Madhya Pradesh",
    distanceKm: 18.5,
    quantityAvailable: 120,
    unit: "quintal",
    farmGatePrice: 2050,
    mandiBenchmarkPrice: 2600,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/A_closeup_of_Pearl_Millet_%28Cumbu%29.JPG",
    matchScore: 92,
    breakdown: {
      priceIndex: { score: 94, detail: "₹550/क्विंटल अतिरिक्त लाभ (मिलेट प्रोत्साहन योजना)" },
      distance: { score: 88, detail: "18.5 km एग्री लॉजिस्टिक्स लिंक" },
      qualityGrade: { score: 96, detail: "आयरन व जिंक से भरपूर, 9.8% नमी, साफ दाना" },
      quantityFit: { score: 92, detail: "एफपीओ और मिलेट प्रोसेसिंग यूनिट्स के लिए" },
      reliability: { score: 95, detail: "एफपीओ किसान विकास केंद्र संचालक" },
    },
    openCvMetrics: {
      blurScore: 93,
      brightnessPct: 87,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-6",
    name: "Maldandi White Jowar (Sorghum)",
    hindiName: "मालदांडी सफेद ज्वार (M-35-1 श्री अन्न)",
    category: "Grains",
    farmerName: "गजानन पाटिल (Gajanan Patil)",
    farmerPhone: "+91 94224 81920",
    village: "खंडवा फार्म्स",
    district: "Khandwa, Madhya Pradesh",
    distanceKm: 16.0,
    quantityAvailable: 100,
    unit: "quintal",
    farmGatePrice: 3950,
    mandiBenchmarkPrice: 5200,
    imageUrl: "https://cpimg.tistatic.com/6544102/b/4/milky-white-sorghum.jpg",
    matchScore: 94,
    breakdown: {
      priceIndex: { score: 95, detail: "₹1,250/क्विंटल प्रीमियम मिलेट सुपरफूड भाव" },
      distance: { score: 90, detail: "16.0 km निमाड़ एग्री बेल्ट" },
      qualityGrade: { score: 97, detail: "मोती जैसा सफेद दाना, मीठा स्वाद, ग्लूटन-फ्री" },
      quantityFit: { score: 93, detail: "सीधे ऑर्गेनिक स्टोर्स और चक्की ब्रांड्स हेतु" },
      reliability: { score: 96, detail: "जैविक प्रमाणित (NPOP Certified)" },
    },
    openCvMetrics: {
      blurScore: 95,
      brightnessPct: 91,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
  {
    id: "prod-7",
    name: "Malwa Dollar Chana (Kabuli Chickpea)",
    hindiName: "मालवा डॉलर चना (बोल्ड दाना)",
    category: "Grains",
    farmerName: "राधेश्याम पाटीदार (Radheshyam Patidar)",
    farmerPhone: "+91 94224 81920",
    village: "उज्जैन बड़नगर",
    district: "Ujjain, Madhya Pradesh",
    distanceKm: 22.0,
    quantityAvailable: 110,
    unit: "quintal",
    farmGatePrice: 5400,
    mandiBenchmarkPrice: 6800,
    imageUrl: "https://images.pexels.com/photos/7382912/pexels-photo-7382912.jpeg?auto=compress&cs=tinysrgb&w=800",
    matchScore: 95,
    breakdown: {
      priceIndex: { score: 96, detail: "₹1,400/क्विंटल प्रीमियम एक्सपोर्ट ग्रेड काबुली चना" },
      distance: { score: 86, detail: "22 km मालवा पल्स कॉरिडोर" },
      qualityGrade: { score: 98, detail: "11-12mm एक्स्ट्रा बोल्ड दाना, 9.5% नमी, ग्रेड-ए" },
      quantityFit: { score: 95, detail: "सीधे दाल मिलर्स व मसाला निर्माताओं हेतु" },
      reliability: { score: 98, detail: "4.9★ सत्यापित किसान उत्पादक संगठन (FPO)" },
    },
    openCvMetrics: {
      blurScore: 96,
      brightnessPct: 92,
      resolution: "1080p Verified",
      status: "Grade A - Auto-Listed",
    },
  },
];

export const MOCK_DELIVERY_ROUTE: DeliveryRoute = {
  id: "ROUTE-MH12-VRP-04",
  transporterName: "Kailash Jadhav (Rural Green Fleet)",
  vehicleNumber: "Eicher Pro Grain Carrier (MP-09-GH-8210)",
  totalDistanceKm: 58.4,
  distanceSavedKm: 24.2,
  fuelReducedPct: 31,
  totalPayoutAmount: 48500,
  requiredPin: "7429",
  stops: [
    {
      step: 1,
      title: "Farm-Gate Dispatch #1",
      role: "Farmer Pickup",
      location: "Shivpal Yadav Farm, Bilkisganj, Sehore (MP)",
      crop: "MP Sharbati Golden Wheat (120 Quintal)",
      quantity: "120 Jute Bori",
      eta: "08:15 AM",
      status: "completed",
    },
    {
      step: 2,
      title: "Farm-Gate Dispatch #2",
      role: "Farmer Pickup",
      location: "Kailash Choudhary Farm, Sanwer, Indore (MP)",
      crop: "Yellow Soyabean JS-9560 (80 Quintal)",
      quantity: "80 Jute Bori",
      eta: "09:30 AM",
      status: "completed",
    },
    {
      step: 3,
      title: "Regional Storage & Silos Handover",
      role: "Grain Silo Drop-off",
      location: "Malwa Central Grain Warehousing, Pithampur / Dewas Naka",
      crop: "120 Quintal Sharbati Wheat Lot",
      quantity: "Certified Bulk Grain Lot",
      eta: "11:15 AM (Active Now)",
      status: "pending_pin",
      isPinTarget: true,
    },
    {
      step: 4,
      title: "Commercial Agro Processing Delivery",
      role: "Agro Processing Drop",
      location: "Malwa Protein & Oil Processing Mills, Sanwer Industrial Area",
      crop: "80 Quintal Soyabean + 50 Quintal Maize",
      quantity: "Commercial Milling Contract",
      eta: "12:45 PM",
      status: "scheduled",
    },
  ],
};

export const MOCK_DISPUTE: DisputeCase = {
  id: "DISP-2026-8921",
  orderNumber: "KS-ORD-4820",
  cropName: "MP Sharbati Golden Wheat (Lot #SB-9410)",
  batchWeight: "100 Quintal (100 Jute Sacks)",
  escrowAmount: 340000,
  farmer: {
    name: "Shivpal Singh Yadav",
    location: "Bilkisganj, Sehore (MP)",
    trustScore: 98,
    bankAccount: "SBI A/C ***4891 (UPI: shivpal@oksbi)",
  },
  buyer: {
    name: "Siddharth Verma",
    business: "Malwa Modern Flour Mills & Agro Trading",
    location: "Dewas Naka, Indore (MP)",
  },
  farmerDispatchPhoto: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
  farmerOpenCvStats: {
    grade: "Grade A (98.4% Amber Luster)",
    blurScore: 95,
    colorUniformity: 97,
    timestamp: "Today 08:15 AM at Sehore Farm Gate",
  },
  buyerReportedPhoto: "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=600&auto=format&fit=crop&q=80",
  buyerComplaint: "Top 2 bags had slight rain tarp moisture seepage during highway transit. Requested moisture re-check.",
  aiDiscrepancyAnalysis:
    "OpenCV grain edge assay and spectrophotometry verify core moisture is 10.6% (well under 12% safe storage threshold). Grain hectolitre weight is >82 kg/hl. 98.8% of lot is pristine Grade A Sharbati.",
  recommendedAction:
    "Disburse 98% (₹3,33,200) to Farmer's UPI ledger immediately; credit 2% (₹6,800) drying/sieving allowance to Buyer from Logistics buffer.",
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

// ---------------------------------------------------------------------------
// Portal v2 additive mock extensions (faker seed 26033 preserved — deterministic)
// ---------------------------------------------------------------------------

export const FARMER_PHOTOS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&auto=format&fit=crop&q=60",
];

/** Reverse marketplace: buyer posts a requirement, farmers pool contributions. */
export interface Requirement {
  id: string;
  buyerName: string;
  business: string;
  crop: string;
  quantityKg: number;
  grade: string;
  targetPrice: number;
  district: string;
  deadline: string;
  pooledKg: number;
  contributors: number;
  status: "open" | "filling" | "fulfilled";
}

export const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: "req-1",
    buyerName: "Hotel Shreemaya",
    business: "HoReCa · Indore",
    crop: "Tamatar (Tomato)",
    quantityKg: 500,
    grade: "Grade A",
    targetPrice: 22,
    district: "Indore",
    deadline: "30 Sep",
    pooledKg: 320,
    contributors: 6,
    status: "filling",
  },
  {
    id: "req-2",
    buyerName: "Malwa Agro Mills",
    business: "Processor · Ujjain",
    crop: "Soyabean JS-9560",
    quantityKg: 3000,
    grade: "Grade A",
    targetPrice: 48,
    district: "Ujjain",
    deadline: "2 Oct",
    pooledKg: 3000,
    contributors: 14,
    status: "fulfilled",
  },
  {
    id: "req-3",
    buyerName: "FreshKart Retail",
    business: "Retail chain · Bhopal",
    crop: "Shimla Mirch (Capsicum)",
    quantityKg: 800,
    grade: "Grade A",
    targetPrice: 35,
    district: "Bhopal",
    deadline: "4 Oct",
    pooledKg: 120,
    contributors: 3,
    status: "open",
  },
];

export interface FraudSignal {
  id: string;
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

export const MOCK_FRAUD_SIGNALS: FraudSignal[] = [
  {
    id: "fs-1",
    label: "Photo duplication detected",
    detail: "Listing prod-118 reuses dispatch photos from 3 older listings (perceptual hash match 97%).",
    severity: "high",
  },
  {
    id: "fs-2",
    label: "Serial complainant",
    detail: "Buyer u-consumer-7 raised 4 disputes in 90 days (threshold >3). Win-rate 0% — possible refund gaming.",
    severity: "medium",
  },
  {
    id: "fs-3",
    label: "Velocity anomaly",
    detail: "Farmer u-farmer-12 listed 22 lots in 6 hours from a single device. Possible account sharing.",
    severity: "medium",
  },
  {
    id: "fs-4",
    label: "Collusion flag",
    detail: "Farmer u-farmer-3 and buyer u-consumer-2 share a UPI VPA and device fingerprint across 9 orders.",
    severity: "high",
  },
  {
    id: "fs-5",
    label: "Grade inflation",
    detail: "2 listings claim Grade A but OpenCV blur scores <60. Downgraded to B pending re-scan.",
    severity: "low",
  },
];

export interface KycApplicant {
  id: string;
  name: string;
  role: "farmer" | "delivery" | "buyer";
  district: string;
  submittedAgo: string;
  documents: string[];
}

export const MOCK_KYC_QUEUE: KycApplicant[] = [
  { id: "kyc-1", name: "Dinesh Choudhary", role: "farmer", district: "Sehore", submittedAgo: "2h ago", documents: ["Aadhaar", "PM-KISAN ID", "Land record"] },
  { id: "kyc-2", name: "Sunita Verma", role: "delivery", district: "Indore", submittedAgo: "5h ago", documents: ["Aadhaar", "Driving licence", "Vehicle RC"] },
  { id: "kyc-3", name: "Annapurna Foods", role: "buyer", district: "Bhopal", submittedAgo: "1d ago", documents: ["GSTIN", "FSSAI licence"] },
  { id: "kyc-4", name: "Prakash Malviya", role: "farmer", district: "Dewas", submittedAgo: "1d ago", documents: ["Aadhaar", "PM-KISAN ID"] },
];

export interface HealthKpi {
  id: string;
  label: string;
  value: string;
  target: string;
  onTrack: boolean;
  hint?: string;
}

export const MOCK_HEALTH_KPIS: HealthKpi[] = [
  { id: "hk-1", label: "Dispute rate", value: "1.1%", target: "<1.5%", onTrack: true },
  { id: "hk-2", label: "Median resolution", value: "9.2h", target: "<12h", onTrack: true },
  { id: "hk-3", label: "Auto-resolved", value: "64%", target: ">60%", onTrack: true },
  { id: "hk-4", label: "Farmer payout TAT", value: "3.4h", target: "<4h", onTrack: true, hint: "PIN → UPI release" },
];

export interface PayoutItem {
  id: string;
  label: string;
  amount: number;
  etaDays: number;
  status: "incoming" | "released";
}

export const MOCK_PAYOUT_SCHEDULE: PayoutItem[] = [
  { id: "po-1", label: "Tamatar · 120kg · Hotel Shreemaya", amount: 2640, etaDays: 0, status: "released" },
  { id: "po-2", label: "Sharbati Wheat · 40 quintal · Malwa Agro", amount: 11840, etaDays: 2, status: "incoming" },
  { id: "po-3", label: "Soyabean · 25 quintal · FPO pool", amount: 121250 - 106770, etaDays: 4, status: "incoming" },
];
