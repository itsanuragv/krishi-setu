import type { Translations } from "../LanguageContext";

/**
 * Delivery portal strings (portal redesign v2).
 * All keys are prefixed `delivery_`. Merged by the coordinator into
 * PORTAL_TRANSLATIONS — do not edit LanguageContext.tsx or portal-i18n/index.ts.
 */
export const deliveryTranslations: Translations = {
  // Dashboard
  delivery_dash_eyebrow: { en: "Delivery Partner", hi: "डिलीवरी पार्टनर" },
  delivery_dash_title: { en: "Partner App", hi: "पार्टनर ऐप" },
  delivery_dash_hello: { en: "Namaste, {name}", hi: "नमस्ते, {name}" },
  delivery_duty_on: { en: "Duty ON — orders aa rahe hain", hi: "ड्यूटी चालू — ऑर्डर आ रहे हैं" },
  delivery_duty_off: { en: "Duty OFF — aap offline hain", hi: "ड्यूटी बंद — आप ऑफ़लाइन हैं" },
  delivery_earnings: { en: "Earnings", hi: "कमाई" },
  delivery_earn_today: { en: "Aaj", hi: "आज" },
  delivery_earn_week: { en: "Is hafte", hi: "इस हफ़्ते" },
  delivery_earn_per: { en: "Per delivery", hi: "प्रति डिलीवरी" },
  delivery_batch_title: { en: "Active batch", hi: "सक्रिय बैच" },
  delivery_batch_stops: { en: "{n} stops · {km} km", hi: "{n} स्टॉप · {km} किमी" },
  delivery_view_manifest: { en: "View manifest", hi: "मैनिफेस्ट देखें" },
  delivery_done_today: { en: "Completed today", hi: "आज पूर्ण किए" },
  delivery_fee_earned: { en: "+{amount} earned", hi: "+{amount} कमाए" },

  // Assignments
  delivery_route_title: { en: "Today's route", hi: "आज का रूट" },
  delivery_route_sub: {
    en: "OR-Tools optimised stop order",
    hi: "OR-Tools अनुकूलित स्टॉप क्रम",
  },
  delivery_navigate: { en: "Navigate", hi: "नेविगेट करें" },
  delivery_mark_arrived: { en: "Mark arrived", hi: "पहुँच दर्ज करें" },
  delivery_toast_navigating: {
    en: "Opening navigation to next stop…",
    hi: "अगले स्टॉप के लिए नेविगेशन खुल रहा है…",
  },
  delivery_toast_arrived: {
    en: "Stop marked arrived ✓",
    hi: "स्टॉप पर पहुँच दर्ज ✓",
  },
  delivery_start_verify: {
    en: "Start pickup verification",
    hi: "पिकअप सत्यापन शुरू करें",
  },

  // Active delivery — dual verification
  delivery_ad_eyebrow: { en: "Live delivery run", hi: "लाइव डिलीवरी रन" },
  delivery_ad_order: { en: "Order", hi: "ऑर्डर" },
  delivery_step1: { en: "Step 1 · Pickup", hi: "चरण 1 · पिकअप" },
  delivery_otp_title: { en: "Farmer se OTP lein", hi: "किसान से OTP लें" },
  delivery_otp_hint: {
    en: "Enter the 4-digit OTP the farmer received on their phone",
    hi: "किसान के फ़ोन पर आया 4-अंकों का OTP डालें",
  },
  delivery_demo_otp: { en: "Demo OTP: {otp}", hi: "डेमो OTP: {otp}" },
  delivery_step2: { en: "Step 2 · Delivery", hi: "चरण 2 · डिलीवरी" },
  delivery_pin_title: { en: "Buyer se 4-digit PIN lein", hi: "खरीदार से 4-अंकों का PIN लें" },
  delivery_pin_hint: {
    en: "Enter the PIN shown on the buyer's app to release payment",
    hi: "भुगतान जारी करने के लिए खरीदार के ऐप पर दिख रहा PIN डालें",
  },
  delivery_demo_pin: { en: "Demo PIN: {pin}", hi: "डेमो PIN: {pin}" },
  delivery_pickup_done: { en: "Pickup confirmed ✓", hi: "पिकअप कन्फर्म ✓" },
  delivery_wrong: {
    en: "Galat PIN — dobara try karein ({left} attempts bache)",
    hi: "गलत PIN — दोबारा कोशिश करें ({left} प्रयास बचे)",
  },
  delivery_locked: {
    en: "3 galat attempts — PIN lock ho gaya. Support ko call karein.",
    hi: "3 गलत प्रयास — PIN लॉक हो गया। सहायता को कॉल करें।",
  },
  delivery_support: { en: "Call support", hi: "सहायता को कॉल करें" },
  delivery_absent: { en: "Buyer not available", hi: "खरीदार उपलब्ध नहीं" },
  delivery_proof_title: { en: "Photo proof lein", hi: "फ़ोटो प्रमाण लें" },
  delivery_proof_hint: {
    en: "Gate / doorstep ki photo lein — auto-escalate ho jayegi",
    hi: "गेट / दरवाज़े की फ़ोटो लें — ऑटो-एस्केलेट हो जाएगी",
  },
  delivery_take_photo: { en: "Take photo", hi: "फ़ोटो लें" },
  delivery_photo_toast: { en: "Photo proof saved ✓", hi: "फ़ोटो प्रमाण सेव ✓" },
  delivery_escalates: { en: "Escalates to support in", hi: "सहायता को एस्केलेट हो जाएगा" },

  // Success screen
  delivery_success: {
    en: "₹{amount} farmer ko release ho gaya 🎉",
    hi: "₹{amount} किसान को रिलीज़ हो गया 🎉",
  },
  delivery_success_sub: {
    en: "Escrow se turant UPI settlement",
    hi: "एस्क्रो से तुरंत UPI निपटान",
  },
  delivery_brk_farmer: { en: "Farmer payout", hi: "किसान भुगतान" },
  delivery_brk_fee: { en: "Your delivery fee", hi: "आपकी डिलीवरी फ़ी" },
  delivery_brk_total: { en: "Escrow total", hi: "एस्क्रो कुल" },
  delivery_back: { en: "Back to assignments", hi: "असाइनमेंट पर वापस" },

  // Stats + empty states
  delivery_stops_left: { en: "{n} stops left", hi: "{n} स्टॉप बचे" },
  delivery_stats_stops: { en: "Stops", hi: "स्टॉप" },
  delivery_stats_km: { en: "Distance", hi: "दूरी" },
  delivery_empty_done: {
    en: "No deliveries completed yet today — finished stops will appear here.",
    hi: "आज अभी कोई डिलीवरी पूरी नहीं हुई — पूर्ण स्टॉप यहाँ दिखेंगे।",
  },
  delivery_empty_done_cta: { en: "View today's route", hi: "आज का रूट देखें" },
};
