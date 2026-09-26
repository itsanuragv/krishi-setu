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
    en: "Sanwer Cluster • Indore District, Madhya Pradesh",
    hi: "सांवेर क्लस्टर • इंदौर जिला, मध्य प्रदेश",
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
    en: "🎙️ “Selling 100 quintal Sharbati Wheat at 3400 rupees”",
    hi: "🎙️ “100 क्विंटल सीहोर शरबती गेहूं 3400 रुपये क्विंटल बेचना है”",
  },
  sim_onions: {
    en: "🎙️ “50 quintal Yellow Soyabean JS-9560 at 4850 rupees”",
    hi: "🎙️ “50 क्विंटल पीला सोयाबीन JS-9560 4850 रुपये”",
  },
  sim_wheat: {
    en: "🎙️ “80 quintal Hybrid Yellow Maize at 2350 rupees”",
    hi: "🎙️ “80 क्विंटल देशी पीला मक्का 2350 रुपये”",
  },
  sim_rice: {
    en: "🎙️ “150 quintal Pusa 1121 Basmati Paddy at 7200 rupees”",
    hi: "🎙️ “150 क्विंटल पूसा 1121 बासमती धान 7200 रुपये”",
  },

  // Form Fields
  crop_name_label: {
    en: "Crop Name",
    hi: "फसल का नाम",
  },
  crop_name_placeholder: {
    en: "e.g. Sharbati Wheat / Soyabean / Basmati Rice",
    hi: "उदा. शरबती गेहूं / सोयाबीन / बासमती धान",
  },
  variety_label: {
    en: "Variety / Grade",
    hi: "किस्म / ग्रेड",
  },
  variety_placeholder: {
    en: "e.g. MP Sharbati Golden / JS-9560 / Pusa 1121",
    hi: "उदा. सीहोर शरबती / JS-9560 / पूसा 1121",
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
  crop_wheat: { en: "MP Sharbati Golden Wheat", hi: "सीहोर शरबती गेहूं (MP)" },
  crop_soyabean: { en: "Yellow Soyabean (JS-9560)", hi: "पीला सोयाबीन (JS-9560)" },
  crop_rice: { en: "Pusa 1121 Basmati Paddy", hi: "पूसा 1121 बासमती धान" },
  crop_corn: { en: "Pioneer Hybrid Yellow Maize", hi: "देशी पीला मक्का (कॉर्न)" },
  crop_bajra: { en: "Desi Pearl Millet (Bajra)", hi: "देशी बाजरा (श्री अन्न)" },
  crop_jowar: { en: "Maldandi White Jowar", hi: "मालदांडी सफेद ज्वार (श्री अन्न)" },
  crop_chana: { en: "Malwa Dollar Chana", hi: "मालवा डॉलर चना (काबुली)" },
  crop_tomato: { en: "MP Sharbati Golden Wheat", hi: "सीहोर शरबती गेहूं (MP)" },
  crop_onion: { en: "Yellow Soyabean (JS-9560)", hi: "पीला सोयाबीन (JS-9560)" },
  crop_capsicum: { en: "Pioneer Hybrid Yellow Maize", hi: "देशी पीला मक्का (कॉर्न)" },
  crop_potato: { en: "Desi Pearl Millet (Bajra)", hi: "देशी बाजरा (श्री अन्न)" },
  lower_label: { en: "Lower", hi: "सस्ता" },
  // How Krishi Setu Works: 3 Steps
  how_it_works_badge: {
    en: "How It Works",
    hi: "कार्यप्रणाली (How It Works)",
  },
  how_it_works_title: {
    en: "From Farm Gate to Kitchen: Direct Digital Highway",
    hi: "खेत से रसोई तक: सीधा डिजिटल मार्ग",
  },
  how_it_works_sub: {
    en: "Zero middlemen markups — seamless direct highway connecting farmers, consumers, and delivery partners",
    hi: "बिना बिचौलियों के — किसान, उपभोक्ता और डिलीवरी नेटवर्क कैसे आपस में जुड़ते हैं",
  },
  how_step1_badge: {
    en: "🌾 Farmer",
    hi: "🌾 किसान (Farmer)",
  },
  how_step1_title: {
    en: "Voice-Assisted Listing & AI Quality QC",
    hi: "बोलकर लिस्टिंग व एआई क्वालिटी जांच",
  },
  how_step1_desc: {
    en: "Farmers speak in their local dialect to set crop, quantity, and price. On-device camera pre-check instantly validates Grade A/B/C quality.",
    hi: "किसान अपनी भाषा में बोलकर फसल, मात्रा और भाव तय करते हैं। मोबाइल कैमरे से ऑन-डिवाइस OpenCV ग्रेड A/B/C की तुरंत जांच होती है।",
  },
  how_step1_link: {
    en: "Farmer Portal",
    hi: "किसान पोर्टल",
  },
  how_step1_tag: {
    en: "0% Commission Deduction",
    hi: "0% आढ़त कटौती",
  },

  how_step2_badge: {
    en: "🛒 Consumer",
    hi: "🛒 उपभोक्ता (Consumer)",
  },
  how_step2_title: {
    en: "<25km Hyperlocal Discovery & 30-40% Savings",
    hi: "<25km ताज़ा खोज व 30-40% बचत",
  },
  how_step2_desc: {
    en: "Consumers discover farm produce harvested <12h ago directly at farm-gate rates with certified AI grade and transparent shelf-life.",
    hi: "उपभोक्ता अपने पास के खेतों से 12 घंटे में कटी ताज़ा फसलें सीधे फार्म-गेट भाव पर खरीदते हैं। खरीदने से पहले एआई ग्रेड व शेल्फ लाइफ दिखती है।",
  },
  how_step2_link: {
    en: "Consumer Marketplace",
    hi: "उपभोक्ता बाज़ार",
  },
  how_step2_tag: {
    en: "30-40% Direct Savings",
    hi: "30-40% सीधी बचत",
  },

  how_step3_badge: {
    en: "🔒 Secure Escrow & Logistics",
    hi: "🔒 सुरक्षित एस्क्रो व डिलीवरी",
  },
  how_step3_title: {
    en: "4-Digit PIN Handover & Direct UPI Release",
    hi: "4-अंकीय पिन से सुरक्षित हैंडओवर",
  },
  how_step3_desc: {
    en: "Funds stay locked in smart escrow. Upon doorstep inspection and 4-digit PIN handover, the farmer receives instant direct UPI payout.",
    hi: "रुपये सुरक्षित एस्क्रो में रहते हैं। उपभोक्ता द्वारा दरवाज़े पर सामान देखकर 4-अंकीय पिन साझा करने पर ही किसान को तुरंत यूपीआई भुगतान मिलता है।",
  },
  how_step3_link: {
    en: "View Detailed Architecture",
    hi: "विस्तृत गाइड देखें",
  },
  how_step3_tag: {
    en: "100% Protected Payout",
    hi: "100% सुरक्षित भुगतान",
  },

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
  testimonials_sub: { en: "Real-world results from farmers, grocers, and consumers across Madhya Pradesh", hi: "मध्य प्रदेश और भारत के किसानों, खुदरा विक्रेताओं और परिवारों के वास्तविक अनुभव" },
  badge_pmkisan_verified: { en: "PM-KISAN Verified", hi: "पीएम-किसान सत्यापित" },
  badge_buyer_verified: { en: "Verified Buyer", hi: "सत्यापित खरीदार" },
  badge_institutional_partner: { en: "Institutional Partner", hi: "व्यावसायिक भागीदार" },
  dummy_rating_badge: { en: "Sample Demo Rating", hi: "डमी रेटिंग (डेमो)" },
  dummy_rating_disclaimer: { 
    en: "Prototype Showcase · Simulated demonstration ratings & feedback", 
    hi: "प्रोटोटाइप प्रदर्शन · प्रदर्शन हेतु नमूना डमी रेटिंग व अनुभव" 
  },

  test_1_name: { en: "Rameshwar Patil", hi: "रामेश्वर पाटिल" },
  test_1_role: { en: "Smallholder Farmer (Indore, Madhya Pradesh)", hi: "छोटे किसान (इंदौर, मध्य प्रदेश)" },
  test_1_crop: { en: "MP Sharbati Wheat & Basmati Paddy", hi: "शरबती गेहूं एवं बासमती धान" },
  test_1_text: {
    en: "Earlier at APMC Mandi, commission agents cut 30-40% of my earnings. On Krishi Setu, I just spoke to create my grain listing, and direct payment reached my bank the next day.",
    hi: "पहले APMC मंडी में आढ़तिये 30-40% कमीशन काट लेते थे। कृषि सेतु पर मैंने बस बोलकर अपनी गेहूं व धान की फ़सल जोड़ी, और अगले ही दिन पूरा पैसा सीधे मेरे बैंक खाते में आ गया।",
  },

  test_2_name: { en: "Priya Sharma", hi: "प्रिया शर्मा" },
  test_2_role: { en: "Urban Retail Consumer (Vijay Nagar, Indore)", hi: "शहरी उपभोक्ता (विजय नगर, इंदौर)" },
  test_2_crop: { en: "Pure Whole Grain & Millet Basket", hi: "शुद्ध खाद्यान्न व श्री अन्न बास्केट" },
  test_2_text: {
    en: "Getting pure stone-ground Sharbati wheat and organic millets directly from farmers within 20km is incredible. The 4-digit delivery PIN gives complete peace of mind.",
    hi: "खेत से सीधे 20 किमी के भीतर के किसान से शुद्ध शरबती गेहूं और जैविक श्री अन्न मिलना अद्भुत है। 4-अंकीय डिलीवरी पिन से विश्वास रहता है कि भुगतान तभी होगा जब माल सही मिलेगा।",
  },

  test_3_name: { en: "Siddharth Verma", hi: "सिद्धार्थ वर्मा" },
  test_3_role: { en: "Procurement Lead (Malwa Agro Mills)", hi: "खरीद प्रमुख (मालवा एग्रो मिल्स)" },
  test_3_crop: { en: "Bulk Soyabean & Certified Grain Lots", hi: "थोक सोयाबीन व प्रमाणित खाद्यान्न लॉट्स" },
  test_3_text: {
    en: "We procure 30 quintals weekly directly from FPO collectives. Consistent OpenCV moisture & grain grading with GST compliant escrow settlement saved our processing unit 18% in procurement costs.",
    hi: "हम हर हफ्ते 30 क्विंटल अनाज व सोयाबीन सीधे किसान उत्पादक संगठनों (FPO) से मंगाते हैं। कैमरे से प्रमाणित नमी व ग्रेडिंग और पक्के जीएसटी बिल से हमारे प्रोसेसिंग प्लांट की खरीद लागत में 18% की बचत हुई है।",
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
  delivery_zone: { en: "Your Delivery Zone: Vijay Nagar / Palasia Corridor, Indore, MP (<12h Vine-to-Kitchen)", hi: "डिलीवरी क्षेत्र: विजय नगर / पलासिया कॉरिडोर, इंदौर, म.प्र. (<12 घंटे में खेत से रसोई)" },
  postgis_query_badge: { en: "PostGIS Spatial Query", hi: "पोस्टजीआईएस दूरी खोज" },
  postgis_radius: { en: "ST_DWithin: <25 km Radius", hi: "खोज दायरा: <25 किमी" },
  voice_first_tag: { en: "Voice-First AI Discovery", hi: "वॉइस-फर्स्ट AI खोज" },
  voice_search_banner_title: { en: "बोलकर या लिखकर ताज़ा अनाज व फसल खोजें", hi: "बोलकर या लिखकर ताज़ा अनाज व फसल खोजें" },
  voice_search_banner_sub: { en: "Direct from farms across MP Mandis. Press mic and say 'Wheat' or 'Soyabean'.", hi: "सीधे खेत व मंडी से उत्तम गुणवत्ता अनाज व श्री अन्न। माइक दबाएं और कहें 'शरबती गेहूं' या 'पीला सोयाबीन'।" },
  voice_search_placeholder: { en: "Search grains & millets (e.g. Sharbati Wheat, Soyabean, Bajra)...", hi: "अनाज या श्री अन्न खोजें (जैसे: शरबती गेहूं, सोयाबीन, बाजरा)..." },
  voice_search_btn_speak: { en: "बोलें", hi: "बोलें" },
  voice_search_listening: { en: "सुन रहे हैं...", hi: "सुन रहे हैं..." },
  voice_suggestions_label: { en: "Suggestions:", hi: "सुझाव:" },
  proximity_radius_label: { en: "Hyperlocal Proximity Radius:", hi: "निकटता दायरा (दूरी):" },
  farms_matched_count: { en: "Farms Matched", hi: "खेत उपलब्ध" },
  ultra_local_label: { en: "5 km (Ultra-Local)", hi: "5 किमी (अति-निकट)" },
  optimal_freshness_label: { en: "25 km (Optimal Freshness Radius)", hi: "25 किमी (उत्तम ताज़गी दायरा)" },
  district_corridor_label: { en: "40 km (District Corridor)", hi: "40 किमी (ज़िला क्लस्टर)" },
  cat_all: { en: "All Field Crops", hi: "सभी फसलें" },
  cat_vegetables: { en: "Millets (Shri Anna)", hi: "श्री अन्न (बाजरा, ज्वार)" },
  cat_fruits: { en: "Oilseeds & Pulses", hi: "तिलहन व दलहन (सोयाबीन, चना)" },
  cat_grains: { en: "Grains & Cereals", hi: "अनाज (गेहूं, धान, मक्का)" },
  card_match_suffix: { en: "% Match", hi: "% मैच" },
  card_away_suffix: { en: "km away", hi: "किमी दूर" },
  card_farmer_label: { en: "Farmer:", hi: "किसान:" },
  card_direct_price_label: { en: "Direct Farm-Gate Price", hi: "खेत की सीधी कीमत" },
  card_mandi_rate_label: { en: "APMC Mandi Rate", hi: "मंडी भाव" },
  card_save_label: { en: "Save", hi: "बचत" },
  card_cheaper_label: { en: "Cheaper", hi: "सस्ता" },
  card_above_mandi_label: { en: "above mandi rate", hi: "मंडी भाव से ऊपर" },
  card_trust_score: { en: "Trust Score", hi: "रेटिंग" },
  btn_view_match: { en: "View 5 Factors", hi: "5-कारक विवरण" },
  btn_secure_escrow_order: { en: "Buy via Escrow", hi: "एस्क्रो से खरीदें" },

  // Delivery Fleet Portal
  delivery_portal_title: { en: "Delivery Fleet & Transit Network", hi: "डिलीवरी फ्लीट एवं परिवहन नेटवर्क" },
  delivery_or_tools_active: { en: "Google OR-Tools Active", hi: "गूगल OR-Tools सक्रिय" },
  delivery_vehicle_label: { en: "Vehicle:", hi: "वाहन:" },
  delivery_active_vrp_route: { en: "Active Multi-Stop VRP Route", hi: "सक्रिय बहु-स्टॉप वीआरपी रूट" },
  delivery_dist_saved: { en: "Distance Saved", hi: "दूरी की बचत" },
  delivery_or_solver_tag: { en: "OR-Tools VRP Solver", hi: "OR-Tools VRP सॉल्वर" },
  delivery_fuel_reduced: { en: "Fuel Reduced", hi: "ईंधन बचत" },
  delivery_zero_deadheads: { en: "Zero Empty Deadheads", hi: "शून्य खाली फेरे" },
  delivery_escrow_hold: { en: "Escrow On-Hold", hi: "सुरक्षित एस्क्रो राशि" },
  delivery_auto_release_tag: { en: "Auto-Releases on PIN", hi: "पिन सत्यापन पर तुरंत रिलीज" },
  delivery_path_heading: { en: "Google OR-Tools Optimized Multi-Stop Path", hi: "गूगल OR-Tools अनुकूलित बहु-स्टॉप रूट" },
  delivery_path_sub: { en: "Algorithmic clustering combining farm pickups with door-to-door deliveries", hi: "खेत से उठाव व सीधे ग्राहक तक डिलीवरी का अनुकूलित कलस्टर मार्ग" },
  delivery_stops_active_count: { en: "Stops Active", hi: "स्टॉप सक्रिय" },
  delivery_produce_label: { en: "Produce:", hi: "फसल:" },
  delivery_load_label: { en: "Load:", hi: "वजन:" },
  delivery_action_pin_required: { en: "Action Required: Request 4-Digit PIN from", hi: "आवश्यक कार्रवाई: 4-अंकीय पिन प्राप्त करें -" },
  delivery_handover_title: { en: "Handover PIN Settlement", hi: "हैंडओवर पिन निपटान (भुगतान)" },
  delivery_handover_sub: { en: "Physical delivery confirmation triggers instant UPI payout", hi: "डिलीवरी सत्यापन होते ही सीधे किसान के बैंक खाते में UPI भुगतान" },
  delivery_enter_pin_label: { en: "Enter Consumer's 4-Digit Delivery PIN:", hi: "उपभोक्ता का 4-अंकीय डिलीवरी पिन दर्ज करें:" },
  delivery_demo_pin_hint: { en: "Demo Secret PIN is:", hi: "डेमो टेस्ट पिन:" },
  delivery_autofill_btn: { en: "💡 Auto-Fill PIN “7429”", hi: "💡 ऑटो-फिल पिन “7429”" },
  delivery_verify_btn: { en: "Verify PIN & Release UPI Escrow", hi: "पिन सत्यापित करें और UPI एस्क्रो भुगतान जारी करें" },
  delivery_verifying_btn: { en: "Verifying with Razorpay...", hi: "रेज़रपे से सत्यापन जारी..." },
  delivery_settlement_confirmed: { en: "Settlement Confirmed", hi: "भुगतान सफलतापूर्वक संपन्न" },
  delivery_disbursed_title: { en: "Disbursed via UPI", hi: "UPI द्वारा सीधे बैंक खाते में भेजा गया" },
  delivery_escrow_released_to: { en: "Escrow released to", hi: "एस्क्रो भुगतान प्राप्तकर्ता:" },
  delivery_txn_ref: { en: "Transaction Reference:", hi: "लेनदेन संदर्भ (Txn Ref):" },
  delivery_time_elapsed: { en: "Time Elapsed:", hi: "कुल समय:" },
  delivery_driver_cut: { en: "Driver Payout Cut:", hi: "चालक भाड़ा भुगतान:" },
  delivery_credited: { en: "Credited", hi: "जमा हुआ" },
  delivery_reset_demo: { en: "Reset Demo PIN Verification", hi: "डेमो पिन सत्यापन रीसेट करें" },
  delivery_zero_delay_title: { en: "Zero-Payment-Delay Guarantee:", hi: "शून्य भुगतान देरी की गारंटी:" },
  delivery_zero_delay_desc: {
    en: "Unlike traditional mandis where farmers wait 15-45 days for middleman clearing cheques, Krishi Setu executes straight-through processing to UPI upon 4-digit PIN delivery.",
    hi: "पारंपरिक मंडियों के विपरीत जहाँ किसानों को बिचौलियों के चेकों के लिए 15-45 दिन भटकना पड़ता है, कृषि सेतु 4-अंकीय पिन मिलते ही सीधे UPI द्वारा तुरंत बैंक खाते में भुगतान करता है।",
  },

  // Admin Governance Portal
  admin_room_title: { en: "Admin Governance & Dispute Mediation Control Room", hi: "प्रशासन, निगरानी एवं विवाद समाधान कंट्रोल रूम" },
  admin_super_badge: { en: "Super-Admin", hi: "मुख्य प्रशासक" },
  admin_room_sub: { en: "Real-time escrow oversight, automated AI evidence mediation, and DPDP Act 2023 compliance", hi: "वास्तविक समय एस्क्रो निगरानी, एआई साक्ष्य विश्लेषण और डिजिटल डेटा संरक्षण (DPDP 2023) अनुपालन" },
  admin_data_governance: { en: "Data Governance", hi: "डेटा प्रशासन" },
  admin_dpdp_badge: { en: "DPDP Act 2023 Compliant", hi: "DPDP कानून 2023 अनुपालन" },
  admin_kpi_gmv_title: { en: "Total Escrow GMV", hi: "कुल सुरक्षित एस्क्रो लेन-देन" },
  admin_kpi_gmv_sub: { en: "100% Financial Protection", hi: "100% वित्तीय सुरक्षा" },
  admin_kpi_spoilage_title: { en: "Spoilage Saved", hi: "फसल बर्बादी रोकथाम" },
  admin_kpi_spoilage_sub: { en: "<12h Farm-Gate Transit", hi: "<12 घंटे में खेत से आपूर्ति" },
  admin_kpi_nodes_title: { en: "Proximity Nodes", hi: "सक्रिय निकटता क्लस्टर" },
  admin_kpi_nodes_sub: { en: "PostGIS Hyperlocal Clusters", hi: "पोस्टजीआईएस हाइपरलोकल नोड्स" },
  admin_kpi_speed_title: { en: "Dispatch Speed", hi: "औसत डिस्पैच समय" },
  admin_kpi_speed_sub: { en: "Farm-to-Fork Direct", hi: "खेत से सीधा प्रेषण" },
  admin_case_label: { en: "Case", hi: "मामला" },
  admin_order_label: { en: "Order:", hi: "ऑर्डर:" },
  admin_dispute_workspace: { en: "Visual Evidence Dispute Workspace", hi: "दृश्य साक्ष्य विवाद समाधान कार्यक्षेत्र" },
  admin_escrow_locked_label: { en: "Escrow Locked:", hi: "सुरक्षित एस्क्रो राशि:" },
  admin_farmer_dispatch_header: { en: "Farmer Farm-Gate Dispatch (OpenCV Scan)", hi: "किसान खेत-गेट प्रेषण (ओपनसीवी स्कैन)" },
  admin_consumer_unloading_header: { en: "Consumer Unloading Photo", hi: "उपभोक्ता माल आगमन फोटो" },
  admin_bruising_reported: { en: "Bruising Reported", hi: "दाग/खराबी की शिकायत" },
  admin_blur_score: { en: "Blur Score", hi: "शार्पनेस स्कोर" },
  admin_illumination: { en: "Illum", hi: "प्रकाश" },
  admin_transit_vibration: { en: "Transit Vibration Impact: ~7.5%", hi: "परिवहन कंपन प्रभाव: ~7.5%" },
  admin_producer_label: { en: "Producer:", hi: "उत्पादक किसान:" },
  admin_buyer_label: { en: "Buyer:", hi: "खरीदार:" },
  admin_complaint_label: { en: "Complaint:", hi: "शिकायत:" },
  admin_reg_upi_label: { en: "Registered UPI:", hi: "पंजीकृत UPI:" },
  admin_ai_analysis_header: { en: "AI Computer Vision Edge Discrepancy Analysis:", hi: "एआई कंप्यूटर विज़न अंतर एवं क्षति विश्लेषण:" },
  admin_rec_algorithm_verdict: { en: "Recommended Algorithm Verdict:", hi: "एआई एल्गोरिदम अनुशंसित फैसला:" },
  admin_discretion_heading: { en: "Admin Discretion & Ledger Settlement:", hi: "प्रशासक निर्णय एवं लेज़र भुगतान निपटान:" },
  admin_btn_split: { en: "Execute 92/8 Fair Split (Recommended)", hi: "92/8 न्यायसंगत बंटवारा निष्पादित करें (अनुशंसित)" },
  admin_btn_farmer_100: { en: "Release 100% to Farmer", hi: "किसान को 100% भुगतान जारी करें" },
  admin_btn_buyer_100: { en: "Full Refund to Buyer", hi: "खरीदार को 100% वापसी करें" },
  admin_dpdp_framework_title: { en: "Digital Personal Data Protection (DPDP) Act 2023 Compliance Framework", hi: "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 अनुपालन ढांचा" },
  admin_dpdp_pillar1_title: { en: "1. Zero Raw Aadhaar Storage", hi: "1. शून्य आधार डेटा संग्रहण (Zero Raw Aadhaar)" },
  admin_dpdp_pillar1_desc: {
    en: "Farmer identification is verified through PM-KISAN UIDAI hash tokens with zero biometric or national ID persistence.",
    hi: "किसान की पहचान पीएम-किसान यूआईडीएआई हैश टोकन से सत्यापित होती है, कोई भी बायोमेट्रिक या राष्ट्रीय पहचान पत्र सर्वर पर सेव नहीं होता।",
  },
  admin_dpdp_pillar2_title: { en: "2. Differential GPS Bounding", hi: "2. डिफरेंशियल जीपीएस बाउंडिंग" },
  admin_dpdp_pillar2_desc: {
    en: "Farm coordinates are fuzz-clustered to 200m centroids on public feeds to protect smallholder land boundary privacy.",
    hi: "खेत के वास्तविक जीपीएस निर्देशांकों को 200 मीटर के सुरक्षित दायरे में क्लस्टर किया जाता है ताकि किसान की भूमि सीमा की गोपनीयता बनी रहे।",
  },
  admin_dpdp_pillar3_title: { en: "3. Verifiable Consent Receipts", hi: "3. सत्यापन योग्य सहमति रसीदें" },
  admin_dpdp_pillar3_desc: {
    en: "Every produce listing generates an immutable consent record for photo AI analysis and buyer price discovery.",
    hi: "हर फसल लिस्टिंग के साथ फोटो के एआई विश्लेषण और खरीदार मूल्य खोज हेतु अपरिवर्तनीय डिजिटल सहमति रिकॉर्ड बनाया जाता है।",
  },

  // Additional Farmer Intake & OpenCV Keys
  farmer_studio_badge: { en: "Produce Intake Studio", hi: "फसल लिस्टिंग स्टूडियो" },
  farmer_no_commission: { en: "0% Brokerage Commission", hi: "0% आढ़ती कमीशन" },
  farmer_studio_title: { en: "Sell Your Fresh Harvest Directly to Buyers", hi: "अपनी ताज़ा फसल सीधे खरीदार को बेचें" },
  farmer_studio_sub: { en: "Direct farm-gate sale, instant UPI payment & digital weight verification", hi: "फार्म-गेट पर सीधी बिक्री, तुरंत यूपीआई भुगतान और डिजिटल वजन सत्यापन" },
  farmer_quick_crops: { en: "Quick Pick Crop:", hi: "त्वरित फसल चुनें:" },
  farmer_autofill_tag: { en: "1-Tap Autofill", hi: "1-टैप ऑटोफिल" },
  crop_name_field: { en: "Crop Name", hi: "फसल का नाम" },
  crop_name_ph: { en: "e.g. Sharbati Wheat, Soyabean, Basmati Paddy, Corn, Bajra...", hi: "जैसे: शरबती गेहूं, बासमती धान, पीला सोयाबीन, मक्का, बाजरा..." },
  variety_field: { en: "Variety / Grade", hi: "किस्म / प्रजाति" },
  variety_ph: { en: "e.g. Sehore 306 Sharbati, Pusa 1121, JS-9560, Pioneer...", hi: "जैसे: सीहोर 306 शरबती, पूसा 1121, JS-9560, पायनियर..." },
  quantity_field: { en: "Available Quantity", hi: "उपलब्ध मात्रा" },
  unit_field: { en: "Unit", hi: "इकाई" },
  floor_price_field: { en: "Farm-Gate Price", hi: "फार्म-गेट भाव" },
  mandi_calc_heading: { en: "Traditional Mandi vs Krishi Setu Profit Calculator:", hi: "पारंपरिक मंडी बनाम कृषि सेतु बचत कैलकुलेटर:" },
  mandi_extra_profit: { en: "Extra Net Profit", hi: "अतिरिक्त शुद्ध लाभ" },
  mandi_after_deduction: { en: "Traditional Mandi (Post-Cut):", hi: "पारंपरिक मंडी एजेंट कटौती बाद:" },
  mandi_cut_note: { en: "(Commission, Weighing, Transit Loss)", hi: "(आढ़त, तुलाई, ढुलाई नुकसान)" },
  krishi_farmgate_direct: { en: "Krishi Setu Direct Farm-Gate:", hi: "कृषि सेतु डायरेक्ट फार्म-गेट:" },
  krishi_direct_payout: { en: "100% Direct Bank / UPI Payout", hi: "100% बैंक/यूपीआई में भुगतान" },
  calculator_lot_note_prefix: { en: "💡 On this", hi: "💡 इस" },
  calculator_lot_note_middle: { en: "lot you will earn directly", hi: "लॉट पर आपको सीधे" },
  calculator_lot_note_suffix: { en: "extra net profit!", hi: "अतिरिक्त शुद्ध मुनाफा मिलेगा!" },
  qc_verified_badge: { en: "QC Verified", hi: "QC सत्यापित" },
  verification_code_label: { en: "Verification Code:", hi: "सत्यापन कोड:" },
  publish_harvest_btn: { en: "🌾 Publish Listing on Direct Agri Network", hi: "🌾 फसल तुरंत लिस्ट करें (Publish Live Listing)" },
  listing_live_banner: { en: "Produce is now live! Buyers can now contact you directly.", hi: "फसल लाइव हो चुकी है! खरीदार अब सीधे आपसे संपर्क कर सकते हैं।" },
  view_in_market_btn: { en: "View in Market", hi: "बाज़ार में देखें" },
  farmer_ai_guarantee_title: { en: "Krishi Setu AI Assayer Quality Guarantee", hi: "कृषि सेतु AI Assayer गुणवत्ता गारंटी" },
  farmer_ai_guarantee_desc: {
    en: "Our OpenCV and Gemini 2.0 vision models accurately analyze ripeness, surface defects, size uniformity and color, providing buyers with 100% trust and securing higher premiums for you.",
    hi: "हमारा OpenCV और Gemini 2.0 विज़न मॉडल हर फसल की ताजगी, सतह के दोष, आकार एकरूपता और रंग का सटीक विश्लेषण करता है, जिससे खरीदारों को 100% विश्वास मिलता है और आपको उच्च प्रीमियम भाव मिलता है।",
  },
  farmer_dispute_stat: { en: "Quality Disputes:", hi: "गुणवत्ता विवाद:" },
  farmer_avg_payout_stat: { en: "Avg Settlement Time:", hi: "औसत भुगतान समय:" },
  farmer_within_15min: { en: "Within 15 mins of delivery", hi: "डिलीवरी के 15 मिनट में" },
  active_listings_heading: { en: "Your Active Field Crop Listings", hi: "आपकी सक्रिय फसल लिस्टिंग्स" },
  active_listings_subtitle: { en: "Live on direct network, visible to nearby consumers, millers and commercial buyers", hi: "सीधे बाज़ार में लाइव हैं और आस-पास के उपभोक्ता व थोक खरीदारों को दिख रही हैं" },
  active_listings_live_count: { en: "Crops Active (Live)", hi: "फसलें सक्रिय (Live)" },
  market_demand: { en: "Market Demand", hi: "बाज़ार मांग" },
  available_text: { en: "available", hi: "उपलब्ध" },
  inspect_market: { en: "Explore Market", hi: "बाज़ार देखें" },

  // OpenCV Scan Component
  opencv_ai_quality_lab: { en: "OpenCV AI Quality Lab", hi: "ओपनसीवी एआई गुणवत्ता लैब" },
  opencv_ai_grading_sub: { en: "Crop Quality & AI Grading Inspection", hi: "फसल गुणवत्ता व एआई ग्रेडिंग जांच" },
  btn_stop_report: { en: "Stop", hi: "रोकें" },
  btn_camera_snap: { en: "Camera Photo", hi: "कैमरा फोटो" },
  btn_gallery_upload: { en: "Gallery File", hi: "गैलरी फाइल" },
  sample_crops_label: { en: "Sample Test Crops:", hi: "त्वरित टेस्ट फसलें:" },
  one_click_test: { en: "1-Click Test", hi: "1-क्लिक टेस्ट" },
  grade_result_label: { en: "Grade Result", hi: "गुणवत्ता परिणाम" },
  ripeness_text: { en: "Ripeness:", hi: "परिपक्वता:" },
  defects_text: { en: "Defects:", hi: "दोष दर:" },
  telemetry_accordion_label: { en: "Detailed Technical Telemetry (Laplacian / Lux / Shelf Life)", hi: "विस्तृत तकनीकी टेलीमेट्री (Laplacian / Lux / Shelf Life)" },
  sharpness_meter: { en: "Sharpness", hi: "शार्पनेस" },
  light_meter: { en: "Light", hi: "प्रकाश" },
  shelf_life_meter: { en: "Shelf Life", hi: "शेल्फ लाइफ" },
  days_suffix: { en: "days", hi: "दिन" },
  btn_apply_grade: { en: "✓ Apply Grade & Photo to Listing Form", hi: "✓ यह ग्रेड व फोटो लिस्टिंग फॉर्म में लगाएं" },
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
