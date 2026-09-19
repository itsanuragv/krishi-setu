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
  nav_delivery: { en: "Delivery Fleet", hi: "डिलीवरी फ्लीट" },
  nav_admin: { en: "Admin Control", hi: "प्रशासन नियंत्रण" },
  nav_badge_farmer: { en: "Voice + OpenCV", hi: "ध्वनि + ओपनसीवी" },
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
  test_sample_crops: {
    en: "Test Sample Crops:",
    hi: "नमूना फसलें जांचें:",
  },
  tech_advantage_title: {
    en: "Technical Advantage: Client-Side Edge QC",
    hi: "तकनीकी लाभ: क्लाइंट-साइड एज क्यूसी",
  },
  tech_advantage_desc: {
    en: "By performing Laplacian variance edge detection inside the client browser, Krishi Setu eliminates heavy image uploads over 2G/3G rural networks, saving mobile data for smallholders while ensuring quality verification before dispatch.",
    hi: "ब्राउज़र में लाप्लासियन वैरियंस एज डिटेक्शन चलाकर, कृषि सेतु ग्रामीण 2G/3G नेटवर्क पर भारी इमेज अपलोड से बचाता है, जिससे किसानों का मोबाइल डेटा बचता है और गुणवत्ता सुनिश्चित होती है।",
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
