"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Brand
  brand_title: { en: "Krishi Setu", hi: "कृषि सेतु" },
  brand_hindi: { en: "(कृषि सेतु)", hi: "(Krishi Setu)" },
  brand_subtitle: {
    en: "Kisan Mitra • Direct Agri Marketplace",
    hi: "किसान मित्र • प्रत्यक्ष कृषि बाज़ार",
  },

  // Navbar
  nav_overview: { en: "Overview", hi: "अवलोकन" },
  nav_farmer: { en: "Farmer Intake", hi: "किसान पोर्टल" },
  nav_consumer: { en: "Consumer Match", hi: "उपभोक्ता बाज़ार" },
  nav_buyer: { en: "Bulk Buyers", hi: "थोक खरीदार" },
  nav_delivery: { en: "Delivery Fleet", hi: "डिलीवरी फ्लीट" },
  nav_admin: { en: "Admin Control", hi: "प्रशासन नियंत्रण" },
  nav_badge_farmer: { en: "Voice + OpenCV", hi: "ध्वनि + ओपनसीवी" },
  nav_badge_fpo: { en: "FPO", hi: "एफपीओ" },
  nav_lang_toggle: { en: "हिन्दी", hi: "English" },

  // Farmer Page: Header / Profile
  farmer_name: {
    en: "Rameshwar Patil (रामेश्वर पाटिल)",
    hi: "रामेश्वर पाटिल (Rameshwar Patil)",
  },
  pm_kisan_verified: {
    en: "PM-KISAN Verified",
    hi: "पीएम-किसान सत्यापित",
  },
  farmer_location: {
    en: "Khed Khurd Cluster • Pune District, Maharashtra",
    hi: "खेड खुर्द क्लस्टर • पुणे जिला, महाराष्ट्र",
  },
  escrow_balance_label: {
    en: "Escrow Balance",
    hi: "सुरक्षित एस्क्रो बैलेंस",
  },
  locked_in_razorpay: {
    en: "Locked in Razorpay",
    hi: "रेज़रपे में सुरक्षित",
  },
  trust_rating_label: {
    en: "Trust Rating",
    hi: "विश्वसनीयता रेटिंग",
  },
  ontime_dispatches: {
    en: "99.4% On-time Dispatches",
    hi: "99.4% समय पर डिलीवरी",
  },
  vernacular_voice_btn: {
    en: "Vernacular Voice",
    hi: "ध्वनि सहायक",
  },
  vernacular_voice_sub: {
    en: "Add Crop via Voice",
    hi: "बोलकर फसल जोड़ें",
  },

  // Listing Engine
  phase_tag: {
    en: "Vernacular Voice Listing",
    hi: "स्थानीय भाषा में बोलकर फसल जोड़ें",
  },
  engine_title: {
    en: "Direct Farm-Gate Listing Engine",
    hi: "प्रत्यक्ष फार्म-गेट लिस्टिंग इंजन",
  },
  engine_sub: {
    en: "Designed for zero-learning curve accessibility in Hindi & regional dialects",
    hi: "हिंदी और स्थानीय बोलियों में बिना किसी परेशानी के उपयोग हेतु",
  },
  speech_api_badge: {
    en: "Web Speech API",
    hi: "वेब स्पीच एपीआई",
  },
  voice_sim_title: {
    en: "Test One-Click Voice Simulations:",
    hi: "एक-क्लिक आवाज़ सिमुलेशन:",
  },
  voice_sim_sub: {
    en: "Click to auto-type",
    hi: "ऑटो-टाइप करने के लिए क्लिक करें",
  },
  sim_tomatoes: {
    en: "🎙️ “Selling 50kg Tomatoes at 40 rupees”",
    hi: "🎙️ “50 किलो टमाटर 40 रुपये किलो बेचना है”",
  },
  sim_onions: {
    en: "🎙️ “200kg Nashik Red Onions at 24 rupees”",
    hi: "🎙️ “200 किलो नासिक प्याज 24 रुपये”",
  },
  sim_wheat: {
    en: "🎙️ “100kg Wheat at 28 rupees”",
    hi: "🎙️ “100 किलो शरबती गेहूं 28 रुपये”",
  },
  sim_rice: {
    en: "🎙️ “60kg Basmati Rice at 55 rupees”",
    hi: "🎙️ “60 किलो बासमती चावल 55 रुपये”",
  },

  // Form Fields
  crop_name_label: {
    en: "Crop Name",
    hi: "फसल का नाम",
  },
  crop_name_placeholder: {
    en: "e.g. Tomatoes / Rice / Wheat",
    hi: "उदा. टमाटर / चावल / गेहूं",
  },
  variety_label: {
    en: "Variety / Grade",
    hi: "किस्म / ग्रेड",
  },
  variety_placeholder: {
    en: "e.g. Desi Hybrid / Sharbati / Basmati",
    hi: "उदा. देसी हाइब्रिड / शरबती / बासमती",
  },
  quantity_label: {
    en: "Harvest Quantity",
    hi: "फसल की मात्रा",
  },
  unit_label: {
    en: "Unit",
    hi: "इकाई",
  },
  unit_kg: {
    en: "Kilogram (kg)",
    hi: "किलोग्राम (किलो)",
  },
  unit_quintal: {
    en: "Quintal",
    hi: "क्विंटल",
  },
  unit_crates: {
    en: "Crates",
    hi: "क्रेट्स",
  },
  floor_price_label: {
    en: "Floor Price (₹)",
    hi: "न्यूनतम भाव (₹)",
  },
  mandi_comparison_heading: {
    en: "Agmarknet Mandi Price Comparison:",
    hi: "एगमार्कनेट मंडी मूल्य तुलना:",
  },
  mandi_net_badge: {
    en: "+22% Net Realization",
    hi: "+22% शुद्ध प्राप्ति",
  },
  list_harvest_btn: {
    en: "List Harvest on Direct Hyperlocal Network",
    hi: "सीधे हाइपरलोकल नेटवर्क पर फसल जोड़ें",
  },
  broadcast_success: {
    en: "Harvest successfully broadcast to 24 consumer & HoReCa clusters within 25km!",
    hi: "फसल 25 किमी के भीतर 24 उपभोक्ता और होरेका समूहों को सफलतापूर्वक प्रसारित!",
  },
  view_consumer_feed: {
    en: "View in Consumer Feed",
    hi: "उपभोक्ता फ़ीड में देखें",
  },

  // OpenCV Pre-Check
  opencv_title: {
    en: "OpenCV Client-Side Quality Pre-Check",
    hi: "ओपनसीवी गुणवत्ता पूर्व-जांच (Client-Side)",
  },
  opencv_sub: {
    en: "Edge-based blur & illumination validation before listing",
    hi: "लिस्टिंग से पहले ब्लर और प्रकाश की लाइव जांच",
  },
  btn_take_live_photo: {
    en: "Take Live Photo",
    hi: "लाइव फोटो खींचें",
  },
  btn_rescan: {
    en: "Re-Scan Produce",
    hi: "पुनः स्कैन करें",
  },
  btn_analyzing: {
    en: "Analyzing...",
    hi: "विश्लेषण जारी...",
  },
  blur_score_label: {
    en: "Blur Score",
    hi: "शार्पनेस स्कोर",
  },
  sharp_edges: {
    en: "Sharp Edges ✓",
    hi: "स्पष्ट किनारे ✓",
  },
  slight_blur: {
    en: "Slight Blur",
    hi: "हल्का धुंधला",
  },
  brightness_label: {
    en: "Brightness",
    hi: "प्रकाश / रोशनी",
  },
  optimal_lux: {
    en: "Optimal Lux ✓",
    hi: "उचित रोशनी ✓",
  },
  resolution_label: {
    en: "Resolution",
    hi: "रिज़ॉल्यूशन",
  },
  macro_ready: {
    en: "Macro-Ready ✓",
    hi: "मैक्रो-रेडी ✓",
  },
  passed_precheck_badge: {
    en: "Passed Pre-Check — Auto-Listed",
    hi: "पूर्व-जांच सफल — स्वतः सूचीबद्ध",
  },
  passed_apmc_desc: {
    en: "Meets National Grade-A Horticultural APMC Standards",
    hi: "राष्ट्रीय ग्रेड-ए गुणवत्ता मानकों के अनुरूप",
  },
  grade_a_verified: {
    en: "Grade A Verified",
    hi: "ग्रेड ए सत्यापित",
  },
  ai_crop_grading_title: {
    en: "AI Produce Quality & Grading",
    hi: "एआई फसल गुणवत्ता एवं ग्रेडिंग",
  },
  ai_crop_grading_sub: {
    en: "Multimodal vision analyzing maturity, defects & APMC standards",
    hi: "मल्टीमॉडल विज़न द्वारा परिपक्वता, दोष व एपीएमसी ग्रेड की जांच",
  },
  analyzing_produce_ai: {
    en: "AI Assayer inspecting crop...",
    hi: "एआई परीक्षक फसल की जांच कर रहा है...",
  },
  tier1_passed_tag: {
    en: "Tier 1: Focus & Lighting OK",
    hi: "चरण 1: शार्पनेस व प्रकाश सही",
  },
  tier2_graded_tag: {
    en: "Tier 2: AI Quality Graded",
    hi: "चरण 2: एआई गुणवत्ता जांची गई",
  },
  ripeness_label: {
    en: "Ripeness",
    hi: "पकाव स्तर",
  },
  defect_label: {
    en: "Defects / Blemishes",
    hi: "सतही दोष",
  },
  shelf_life_label: {
    en: "Est. Shelf Life",
    hi: "शेल्फ लाइफ",
  },
  market_fit_label: {
    en: "Best Market Fit",
    hi: "उपयुक्त बाज़ार",
  },
  assayer_notes_title: {
    en: "AI Assayer Notes (किसान सलाह)",
    hi: "एआई परीक्षक सलाह (किसान मित्र)",
  },
  btn_listen_report: {
    en: "Listen to AI Report",
    hi: "रिपोर्ट सुनें",
  },
  btn_stop_audio: {
    en: "Stop Audio",
    hi: "आवाज़ रोकें",
  },
  price_premium_label: {
    en: "Price Premium",
    hi: "मूल्य लाभ",
  },
  test_sample_crops: {
    en: "Test Sample Crops:",
    hi: "नमूना फसलें जांचें:",
  },
  tech_advantage_title: {
    en: "Technical Advantage: Two-Tier Hybrid QC",
    hi: "तकनीकी लाभ: दोहरा हाइब्रिड गुणवत्ता ढांचा",
  },
  tech_advantage_desc: {
    en: "Tier 1 client-side OpenCV verifies camera focus and lighting on-device to save rural mobile data. Tier 2 Gemini 1.5 Flash Multimodal Vision evaluates ripeness, cosmetic blemishes, and AGMARK/APMC commercial grade.",
    hi: "चरण 1 में क्लाइंट-साइड ओपनसीवी मोबाइल डेटा बचाने हेतु फोकस व रोशनी की तुरंत जांच करता है। चरण 2 में जेमिनी 1.5 फ्लैश विज़न एआई फसल के पकाव, दाग-धब्बे और व्यापारिक ग्रेड का सटीक मूल्यांकन करता है।",
  },
  network_overhead: {
    en: "Network Overhead: <10 KB",
    hi: "नेटवर्क डेटा: <10 KB",
  },
  zero_gpu_bill: {
    en: "Zero Server GPU Bill",
    hi: "शून्य सर्वर खर्च",
  },

  // Active Produce Listings
  active_listings_title: {
    en: "Your Active Produce Listings",
    hi: "आपकी सक्रिय फसलें",
  },
  active_listings_sub: {
    en: "Live PostGIS broadcasts with automated 5-factor buyer matching",
    hi: "स्वचालित 5-कारक खरीदार मिलान के साथ लाइव पोस्टजीआईएस प्रसारण",
  },
  lots_active: {
    en: "Lots Active",
    hi: "लॉट सक्रिय",
  },
  top_match: {
    en: "Top Match",
    hi: "उत्कृष्ट मिलान",
  },
  available: {
    en: "Available:",
    hi: "उपलब्ध:",
  },
  opencv_verified: {
    en: "OpenCV Verified",
    hi: "ओपनसीवी सत्यापित",
  },
  radius: {
    en: "Radius:",
    hi: "दायरा:",
  },

  // Hero & Cluster Telemetry
  live_cluster_badge: {
    en: "🟢 LIVE CLUSTER: 24 ACTIVE FARMS (<25KM) • AVG DISPATCH: 8.4 HRS",
    hi: "🟢 लाइव क्लस्टर: 24 सक्रिय खेत (<25 किमी) • औसत डिस्पैच: 8.4 घंटे",
  },
  hero_headline_prefix: {
    en: "Bharat's Direct",
    hi: "भारत का अपना",
  },
  hero_headline_gradient: {
    en: "Farm-to-Kitchen",
    hi: "खेत से रसोई तक",
  },
  hero_headline_suffix: {
    en: "Highway.",
    hi: "डिजिटल सेतु।",
  },
  hero_subheadline: {
    en: "Bharat's Digital Agriculture Gateway • Connecting Farmers Directly with Consumers & Bulk Buyers",
    hi: "भारत का अपना डिजिटल कृषि सेतु • किसान से सीधे उपभोक्ता एवं थोक बाज़ार तक",
  },
  hero_description: {
    en: "Disintermediating agricultural trade. Connect smallholder farmers directly with urban consumers, retail grocers, and HoReCa buyers with vernacular voice AI, on-device OpenCV quality pre-check, PostGIS hyperlocal matching, and guaranteed UPI escrow settlement.",
    hi: "बिचौलियों और आढ़तियों की भारी कमीशन कटौती समाप्त। छोटे व सीमांत किसानों को सीधे उपभोक्ताओं, किराना व्यापारियों और होटल खरीदारों से जोड़ें — बोलकर फसल लिस्ट करने वाले वॉइस एआई, मोबाइल पर कैमरा क्वालिटी जांच, 25 किमी निकटता मिलान और सुरक्षित एस्क्रो भुगतान के साथ।",
  },
  btn_start_selling: {
    en: "Start Selling (फसल बेचें)",
    hi: "फसल बेचना शुरू करें",
  },
  btn_shop_produce: {
    en: "Shop Fresh Produce (उपज खरीदें)",
    hi: "ताज़ा उपज खरीदें",
  },
  btn_how_it_works: {
    en: "How It Works (गाइड)",
    hi: "यह कैसे काम करता है (गाइड)",
  },

  // 4-Pillar Telemetry
  stat_farmer_realization: { en: "Farmer Realization", hi: "किसान की आय" },
  stat_farmer_realization_val: { en: "+15% to +20%", hi: "+15% से +20%" },
  stat_farmer_realization_sub: { en: "Recovers 35-50% middlemen cuts", hi: "35-50% बिचौलियों का कमीशन बचत" },
  stat_transit: { en: "Compressed Transit", hi: "तेज़ परिवहन" },
  stat_transit_val: { en: "<12 to 24 Hrs", hi: "<12 से 24 घंटे" },
  stat_transit_sub: { en: "PostGIS radius <25km matching", hi: "25 किमी दायरे में ताज़ा डिलीवरी" },
  stat_spoilage: { en: "Perishable Spoilage", hi: "उपज की बर्बादी" },
  stat_spoilage_val: { en: "-25% to -30%", hi: "-25% से -30%" },
  stat_spoilage_sub: { en: "Direct farm-gate cold dispatch", hi: "खेत से सीधा शीत-श्रृंखला डिस्पैच" },
  stat_escrow: { en: "Smart Escrow", hi: "सुरक्षित एस्क्रो" },
  stat_escrow_val: { en: "100% Protected", hi: "100% सुरक्षित" },
  stat_escrow_sub: { en: "Released upon delivery PIN", hi: "4-अंकीय डिलीवरी पिन पर भुगतान" },

  // Mandi Ticker
  ticker_title: {
    en: "Live Mandi Price Benchmark vs Krishi Setu Farm-Gate Rates:",
    hi: "लाइव मंडी भाव बनाम कृषि सेतु फार्म-गेट मूल्य:",
  },
  crop_tomato: { en: "Fresh Desi Tomatoes", hi: "ताज़ा देसी टमाटर" },
  crop_rice: { en: "Basmati Paddy Rice", hi: "बासमती धान चावल" },
  crop_onion: { en: "Nashik Red Onions", hi: "नासिक लाल प्याज" },
  crop_wheat: { en: "Sharbati Golden Wheat", hi: "शरबती सुनहरा गेहूँ" },
  crop_capsicum: { en: "Green Bell Capsicum", hi: "हरी शिमला मिर्च" },
  crop_potato: { en: "Desi Jyoti Potatoes", hi: "देसी ज्योति आलू" },
  lower_label: { en: "Lower", hi: "सस्ता" },
  realization_label: { en: "Realization", hi: "अधिक लाभ" },

  // Ecosystem Portals
  ecosystem_title: {
    en: "Ecosystem Portals & Actor Gateways",
    hi: "प्लेटफ़ॉर्म पोर्टल्स एवं यूज़र गेटवे",
  },
  ecosystem_sub: {
    en: "Select your role to access dedicated tools engineered for farmers, buyers, fleet partners, and administrators",
    hi: "किसानों, उपभोक्ताओं, थोक व्यापारियों, डिलीवरी पार्टनर्स और व्यवस्थापकों के लिए विशेष डिजिटल टूल्स",
  },
  role_farmer_title: { en: "Farmer / Producer (किसान)", hi: "किसान व उत्पादक" },
  role_farmer_tagline: { en: "Voice Listing + On-Device Quality QC", hi: "बोलकर लिस्टिंग + मोबाइल कैमरा क्वालिटी जांच" },
  role_farmer_desc: {
    en: "Speak in Hindi or English to list crops instantly. On-device camera pre-check tests blur and brightness. Guaranteed UPI escrow payout upon delivery.",
    hi: "हिंदी या अंग्रेजी में बोलकर तुरंत फसल जोड़ें। मोबाइल कैमरा तुरंत रोशनी व गुणवत्ता जांचता है। डिलीवरी पर बैंक खाते में 100% सुरक्षित भुगतान।",
  },
  role_farmer_f1: { en: "Vernacular Voice-to-Form AI", hi: "बोलकर फॉर्म भरने वाला वॉइस एआई" },
  role_farmer_f2: { en: "OpenCV Edge Quality QC", hi: "कैमरे से तुरंत गुणवत्ता जांच" },
  role_farmer_f3: { en: "Direct Farm-Gate UPI Payout", hi: "खेत से सीधा यूपीआई भुगतान" },
  role_farmer_cta: { en: "Enter Farmer Portal", hi: "किसान पोर्टल खोलें" },

  role_consumer_title: { en: "Consumer & Retail (उपभोक्ता)", hi: "उपभोक्ता एवं खुदरा बाज़ार" },
  role_consumer_tagline: { en: "Hyperlocal Proximity (<25km) & 5-Factor Match", hi: "निकटतम खेत (<25 किमी) एवं 5-कारक मिलान" },
  role_consumer_desc: {
    en: "Direct vine-to-kitchen farm produce harvested <12h ago. Algorithmic transparency evaluating price, distance, grade, and farmer trust score.",
    hi: "खेत से सीधे 12 घंटे के भीतर तोड़ी गई ताज़ा सब्जियां और फल। कीमत, दूरी, ग्रेड और किसान रेटिंग के आधार पर पारदर्शी मिलान।",
  },
  role_consumer_f1: { en: "PostGIS <25km Proximity Slider", hi: "दूरी के अनुसार निकटतम खेत स्लाइडर" },
  role_consumer_f2: { en: "5-Factor Match Scoring", hi: "पारदर्शी 5-कारक गुणवत्ता स्कोर" },
  role_consumer_f3: { en: "Ledger-Locked Escrow PIN", hi: "4-अंकीय सुरक्षित डिलीवरी पिन" },
  role_consumer_cta: { en: "Shop Fresh Harvest", hi: "ताज़ा उपज खरीदें" },

  role_buyer_title: { en: "Bulk Buyer & HoReCa (थोक खरीदार)", hi: "थोक व्यापारी एवं होरेका (होटल/रेस्टोरेंट)" },
  role_buyer_tagline: { en: "FPO Aggregation & Commercial Lots", hi: "एफपीओ एकत्रीकरण एवं व्यावसायिक लॉट" },
  role_buyer_desc: {
    en: "Procure multi-quintal commercial lots directly from farmer collectives and FPOs with digital quality verification and standardized tax invoices.",
    hi: "किसान उत्पादक संगठनों (FPO) से सीधे कई क्विंटल व्यावसायिक लॉट खरीदें — डिजिटल गुणवत्ता रिपोर्ट और जीएसटी चालान के साथ।",
  },
  role_buyer_f1: { en: "FPO Forward Contracts", hi: "एफपीओ अग्रिम खरीद अनुबंध" },
  role_buyer_f2: { en: "Direct Multi-Quintal Lots", hi: "सीधे बड़े क्विंटल लॉट" },
  role_buyer_f3: { en: "GST Invoicing & Escrow", hi: "जीएसटी बिलिंग एवं सुरक्षित एस्क्रो" },
  role_buyer_cta: { en: "Institutional Procurement", hi: "थोक खरीद पोर्टल" },

  role_delivery_title: { en: "Delivery Transporter (परिवहन नेटवर्क)", hi: "डिलीवरी व वाहन चालक नेटवर्क" },
  role_delivery_tagline: { en: "OR-Tools Optimized Multi-Stop Routing", hi: "अनुकूलित बहु-स्टॉप वाहन मार्ग (रूटिंग)" },
  role_delivery_desc: {
    en: "Multi-stop farm pickups and consumer drop-offs with distance optimization, vehicle routing algorithms, and instant 4-digit PIN verification settlement.",
    hi: "खेतों से उठान और डिलीवरी के लिए कम दूरी और ईंधन बचत वाला रूट। डिलीवरी पूरा होने पर तुरंत 4-अंकीय पिन से किराया निपटान।",
  },
  role_delivery_badge: { en: "VRP Multi-Stop", hi: "स्मार्ट रूटिंग" },
  role_delivery_cta: { en: "Explore Delivery Portal", hi: "डिलीवरी पोर्टल खोलें" },

  role_admin_title: { en: "Governance & Mediation (प्रशासन व निगरानी)", hi: "प्रशासन, विवाद व निगरानी" },
  role_admin_tagline: { en: "Escrow GMV & Split-Screen Dispute Resolution", hi: "एस्क्रो राशि व स्प्लिट-स्क्रीन विवाद समाधान" },
  role_admin_desc: {
    en: "Mediate produce quality disputes with side-by-side OpenCV farm photo vs consumer arrival photo. MeitY DPDP Act 2023 compliance monitor.",
    hi: "खेत की फोटो और डिलीवरी फोटो की तुलना करके विवादों का निष्पक्ष निपटारा। भारत सरकार के डेटा सुरक्षा (DPDP 2023) नियमों का पालन।",
  },
  role_admin_badge: { en: "DPDP Act 2023", hi: "डेटा संरक्षण" },
  role_admin_cta: { en: "Explore Admin Panel", hi: "प्रशासन पैनल खोलें" },

  // Innovation & Architecture
  tech_infra_tag: { en: "Decentralized Agritech Infrastructure", hi: "पारदर्शी आधुनिक कृषि तकनीक" },
  tech_infra_title: { en: "How Krishi Setu Disintermediates Agricultural Trade", hi: "कृषि सेतु कैसे बिचौलियों की निर्भरता को समाप्त करता है" },
  btn_arch_tour: { en: "Interactive Architecture Guide", hi: "इंटरैक्टिव आर्किटेक्चर गाइड" },
  tech_card1_title: { en: "Zero Intermediaries (Pure P2P)", hi: "शून्य बिचौलिए (सीधा लेन-देन)" },
  tech_card1_desc: { en: "Eliminates multiple commission agent cuts. Direct farm-gate pickup completed within 12-24 hours.", hi: "आढ़तियों और दलालों का कमीशन शून्य। खेत से सीधे 12 से 24 घंटे में उठाव और डिलीवरी।" },
  tech_card2_title: { en: "Edge OpenCV Pre-QC", hi: "मोबाइल पर गुणवत्ता की पूर्व-जांच" },
  tech_card2_desc: { en: "Instant blur, brightness & resolution validation at the device edge, eliminating manual assayer delays.", hi: "मोबाइल से ही फोटो की शार्पनेस और रोशनी की पुष्टि, जिससे गलत दावों और विवादों की गुंजाइश नहीं रहती।" },
  tech_card3_title: { en: "PostGIS & UPI Smart Escrow", hi: "निकटता आधारित स्मार्ट एस्क्रो" },
  tech_card3_desc: { en: "Hyperlocal proximity (<25km) matching coupled with escrow release exclusively upon 4-digit handover PIN.", hi: "25 किमी के भीतर त्वरित मिलान और खरीदार द्वारा 4-अंकीय पिन दर्ज करने पर ही किसान को भुगतान रिलीज।" },

  // Testimonials
  testimonials_title: { en: "Verified Farmer & Buyer Impact Stories", hi: "सत्यापित किसान और खरीदारों के अनुभव" },
  testimonials_sub: { en: "Real-world results from farmers, grocers, and consumers across Maharashtra", hi: "महाराष्ट्र और भारत के किसानों, खुदरा विक्रेताओं और परिवारों के वास्तविक अनुभव" },
  badge_pmkisan_verified: { en: "PM-KISAN Verified", hi: "पीएम-किसान सत्यापित" },
  badge_buyer_verified: { en: "Verified Buyer", hi: "सत्यापित खरीदार" },
  badge_institutional_partner: { en: "Institutional Partner", hi: "व्यावसायिक भागीदार" },
  dummy_rating_badge: { en: "Sample Demo Rating", hi: "डमी रेटिंग (डेमो)" },
  dummy_rating_disclaimer: { 
    en: "Prototype Showcase · Simulated demonstration ratings & feedback", 
    hi: "प्रोटोटाइप प्रदर्शन · प्रदर्शन हेतु नमूना डमी रेटिंग व अनुभव" 
  },

  test_1_name: { en: "Rameshwar Patil", hi: "रामेश्वर पाटिल" },
  test_1_role: { en: "Smallholder Farmer (Pune, Maharashtra)", hi: "छोटे किसान (पुणे, महाराष्ट्र)" },
  test_1_crop: { en: "Tomatoes & Basmati Rice", hi: "टमाटर एवं बासमती धान" },
  test_1_text: {
    en: "Earlier at APMC Mandi, commission agents cut 30-40% of my earnings. On Krishi Setu, I just spoke to create my listing, and direct payment reached my bank the next day.",
    hi: "पहले APMC मंडी में आढ़तिये 30-40% कमीशन काट लेते थे। कृषि सेतु पर मैंने बस बोलकर अपनी फसल जोड़ी, और अगले ही दिन पूरा पैसा सीधे मेरे बैंक खाते में आ गया।",
  },

  test_2_name: { en: "Priya Sharma", hi: "प्रिया शर्मा" },
  test_2_role: { en: "Urban Retail Consumer (Baner, Pune)", hi: "शहरी उपभोक्ता (बाणेर, पुणे)" },
  test_2_crop: { en: "Weekly Fresh Kitchen Basket", hi: "साप्ताहिक ताज़ी सब्जी बास्केट" },
  test_2_text: {
    en: "Getting fresh vegetables harvested under 12 hours ago directly from farmers within 20km is incredible. The 4-digit delivery PIN gives complete peace of mind.",
    hi: "12 घंटे पहले तोड़ी गई ताज़ा सब्जियां सीधे 20 किमी के भीतर के किसान से मिलना अद्भुत है। 4-अंकीय डिलीवरी पिन से विश्वास रहता है कि पैसा तभी कटेगा जब माल सही मिलेगा।",
  },

  test_3_name: { en: "Siddharth Verma", hi: "सिद्धार्थ वर्मा" },
  test_3_role: { en: "Procurement Lead (Hotel Annapurna)", hi: "खरीद प्रमुख (होटल अन्नपूर्णा)" },
  test_3_crop: { en: "Bulk Onions & Seasonal Vegetables", hi: "थोक प्याज व मौसमी सब्जियां" },
  test_3_text: {
    en: "We procure 300kg weekly directly from FPO collectives. Consistent OpenCV quality grading and GST compliant escrow settlement saved our restaurant chain 22% in procurement costs.",
    hi: "हम हर हफ्ते 300 किलो माल सीधे किसान समूहों (FPO) से मंगाते हैं। कैमरे से प्रमाणित गुणवत्ता और पक्के जीएसटी बिल के साथ हमारे होटल की खरीद लागत में 22% की बचत हुई है।",
  },

  // Compliance
  compliance_dpdp: { en: "DPDP Act 2023 Compliant", hi: "डेटा संरक्षण (DPDP 2023) प्रमाणित" },
  compliance_dpdp_sub: { en: "Digital Personal Data Protection for farmers", hi: "किसानों की व्यक्तिगत जानकारी पूर्णतः सुरक्षित" },
  compliance_pmkisan: { en: "PM-KISAN ID Verified", hi: "पीएम-किसान आईडी सत्यापित" },
  compliance_pmkisan_sub: { en: "Authentic smallholder farmer verification", hi: "सत्यापित वास्तविक किसान पहचान" },
  compliance_escrow: { en: "256-Bit Escrow Protection", hi: "256-बिट सुरक्षित एस्क्रो" },
  compliance_escrow_sub: { en: "Razorpay / UPI delivery-locked settlement", hi: "यूपीआई / रेज़रपे डिलीवरी-लॉक भुगतान" },

  // Footer
  footer_tagline: {
    en: "Bharat's direct farm-to-buyer digital highway empowering smallholder farmers, local retail grocers, and commercial buyers with transparent pricing and escrow safety.",
    hi: "भारत का अपना प्रत्यक्ष कृषि डिजिटल हाईवे जो छोटे किसानों, खुदरा व्यापारियों और परिवारों को पारदर्शी मूल्य और सुरक्षित भुगतान से सशक्त बनाता है।",
  },
  footer_helpline: {
    en: "Kisan Helpline: 1800-180-1551 (Toll Free 24x7)",
    hi: "किसान हेल्पलाइन: 1800-180-1551 (टोल-फ्री 24x7)",
  },
  footer_portals: { en: "Ecosystem Portals", hi: "मुख्य पोर्टल्स" },
  footer_innovations: { en: "Core Innovations", hi: "प्रमुख नवाचार" },
  footer_compliance: { en: "Compliance & Security", hi: "कानूनी सुरक्षा व अनुपालन" },
  footer_link_farmer: { en: "Farmer Intake Engine", hi: "किसान लिस्टिंग इंजन" },
  footer_link_consumer: { en: "Consumer Discovery", hi: "उपभोक्ता बाज़ार" },
  footer_link_buyer: { en: "FPO Bulk Contracts", hi: "एफपीओ थोक अनुबंध" },
  footer_link_delivery: { en: "Logistics & Fleet", hi: "परिवहन एवं लॉजिस्टिक्स" },
  footer_link_admin: { en: "Governance & Escrow", hi: "प्रशासन एवं एस्क्रो" },
  footer_link_voice: { en: "Vernacular Voice AI", hi: "स्थानीय भाषा वॉइस AI" },
  footer_link_opencv: { en: "OpenCV Edge QC", hi: "ओपनसीवी कैमरा गुणवत्ता" },
  footer_link_proximity: { en: "PostGIS Proximity (<25km)", hi: "पोस्टजीआईएस निकटता (<25 किमी)" },
  footer_link_match: { en: "5-Factor Match Algorithm", hi: "5-कारक मिलान तकनीक" },
  footer_link_arch: { en: "Architecture Tour", hi: "आर्किटेक्चर टूर" },
  footer_legal_dpdp: { en: "DPDP Act 2023 Compliant", hi: "DPDP कानून 2023 अनुपालन" },
  footer_legal_pmkisan: { en: "PM-KISAN Verified Ledger", hi: "पीएम-किसान सत्यापित खाता" },
  footer_legal_escrow: { en: "UPI 2.0 Escrow Settlement", hi: "UPI 2.0 एस्क्रो निपटान" },
  footer_legal_gst: { en: "GST Invoicing for HoReCa", hi: "होटल/व्यापार हेतु GST बिल" },
  footer_copyright: {
    en: "© 2026 Krishi Setu Network (कृषि सेतु). Built for Indian Agriculture (Kisan Mitra).",
    hi: "© 2026 कृषि सेतु नेटवर्क। भारतीय कृषि और किसानों के हित में समर्पित (किसान मित्र)।",
  },
  footer_node: {
    en: "Hyperlocal Proximity: Baner / Pune Node",
    hi: "हाइपरलोकल नोड: बाणेर / पुणे क्लस्टर",
  },

  // Consumer Hub
  consumer_hub_title: { en: "Consumer & Retail Discovery Hub", hi: "उपभोक्ता व खुदरा उपज खोज केंद्र" },
  match_engine_badge: { en: "5-Factor Match Engine", hi: "5-कारक स्मार्ट मैच इंजन" },
  delivery_zone: { en: "Your Delivery Zone: Baner / Aundh Corridor, Pune (<12h Vine-to-Kitchen)", hi: "डिलीवरी क्षेत्र: बाणेर / औंध कॉरिडोर, पुणे (<12 घंटे में खेत से रसोई)" },
  postgis_query_badge: { en: "PostGIS Spatial Query", hi: "पोस्टजीआईएस दूरी खोज" },
  postgis_radius: { en: "ST_DWithin: <25 km Radius", hi: "खोज दायरा: <25 किमी" },
  voice_first_tag: { en: "Voice-First AI Discovery", hi: "वॉइस-फर्स्ट AI खोज" },
  voice_search_banner_title: { en: "बोलकर या लिखकर ताज़ा उपज खोजें", hi: "बोलकर या लिखकर ताज़ा उपज खोजें" },
  voice_search_banner_sub: { en: "Direct from farms within <25km. Press mic and say 'Tomato' or 'Mango'.", hi: "सीधे खेत से ताज़ा सब्जियां, फल और अनाज। माइक दबाएं और कहें 'ताज़ा टमाटर' या 'अल्फांसो आम'।" },
  voice_search_placeholder: { en: "Search produce (e.g. Tomato, Onion, Mango)...", hi: "सब्जी या फल खोजें (जैसे: टमाटर, प्याज, आम)..." },
  voice_search_btn_speak: { en: "बोलें", hi: "बोलें" },
  voice_search_listening: { en: "सुन रहे हैं...", hi: "सुन रहे हैं..." },
  voice_suggestions_label: { en: "Suggestions:", hi: "सुझाव:" },
  proximity_radius_label: { en: "Hyperlocal Proximity Radius:", hi: "निकटता दायरा (दूरी):" },
  farms_matched_count: { en: "Farms Matched", hi: "खेत उपलब्ध" },
  ultra_local_label: { en: "5 km (Ultra-Local)", hi: "5 किमी (अति-निकट)" },
  optimal_freshness_label: { en: "25 km (Optimal Freshness Radius)", hi: "25 किमी (उत्तम ताज़गी दायरा)" },
  district_corridor_label: { en: "40 km (District Corridor)", hi: "40 किमी (ज़िला क्लस्टर)" },
  cat_all: { en: "All", hi: "सभी" },
  cat_vegetables: { en: "Vegetables", hi: "सब्जियां" },
  cat_fruits: { en: "Fruits", hi: "फल" },
  cat_grains: { en: "Grains", hi: "अनाज" },
  card_match_suffix: { en: "% Match", hi: "% मैच" },
  card_away_suffix: { en: "km away", hi: "किमी दूर" },
  card_farmer_label: { en: "Farmer:", hi: "किसान:" },
  card_direct_price_label: { en: "Direct Farm-Gate Price", hi: "खेत की सीधी कीमत" },
  card_mandi_rate_label: { en: "APMC Mandi Rate", hi: "मंडी भाव" },
  card_save_label: { en: "Save", hi: "बचत" },
  card_cheaper_label: { en: "Cheaper", hi: "सस्ता" },
  card_trust_score: { en: "Trust Score", hi: "रेटिंग" },
  btn_view_match: { en: "View 5 Factors", hi: "5-कारक विवरण" },
  btn_secure_escrow_order: { en: "Buy via Escrow", hi: "एस्क्रो से खरीदें" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ks_language") as Language | null;
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch {
      // ignore localStorage errors in SSR/sandboxes
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ks_language", lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
