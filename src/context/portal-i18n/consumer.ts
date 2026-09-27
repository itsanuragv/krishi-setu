import type { Translations } from "../LanguageContext";

/**
 * Consumer portal translations. Key prefix MUST be `consumer_`.
 * Merged by the coordinator via portal-i18n/index.ts.
 */
export const consumerTranslations: Translations = {
  // Dashboard
  consumer_dash_eyebrow: { en: "25km Fresh • Hyperlocal", hi: "25km ताज़ा • हाइपरलोकल" },
  consumer_dash_title: { en: "Farm-fresh, from farmers near you", hi: "आपके पास के किसानों से ताज़ा उपज" },
  consumer_dash_sub: {
    en: "Skip the mandi. Buy at farm-gate prices and save on every kilo, delivered within 25 km.",
    hi: "मंडी छोड़ें। फार्म-गेट दाम पर खरीदें और हर किलो पर बचत करें, 25 km के अंदर डिलीवरी।",
  },
  consumer_stat_listings: { en: "Live listings", hi: "लाइव लिस्टिंग" },
  consumer_stat_farmers: { en: "Verified farmers", hi: "सत्यापित किसान" },
  consumer_stat_saving: { en: "Avg. saving / kg", hi: "औसत बचत / किलो" },
  consumer_dash_fresh_title: { en: "Fresh near you", hi: "आपके पास ताज़ा" },
  consumer_dash_no_results: {
    en: "No listings within the selected radius yet. Try a wider radius.",
    hi: "चुने गए दायरे में अभी कोई लिस्टिंग नहीं। बड़ा दायरा आज़माएं।",
  },
  consumer_dash_basket_title: { en: "Weekly Basket", hi: "साप्ताहिक टोकरी" },
  consumer_dash_basket_sub: {
    en: "Subscribe to your favourite farmers and get harvest alerts first.",
    hi: "पसंदीदा किसानों को सब्सक्राइब करें और सबसे पहले फसल अलर्ट पाएं।",
  },
  consumer_subscribe: { en: "Subscribe", hi: "सब्सक्राइब" },
  consumer_subscribed: { en: "Subscribed", hi: "सब्सक्राइब्ड" },
  consumer_dash_alerts_title: { en: "Harvest alerts", hi: "फसल अलर्ट" },
  consumer_dash_alert_cta: { en: "View lot", hi: "लॉट देखें" },
  consumer_toast_subscribed: { en: "Subscribed! You'll get harvest alerts.", hi: "सब्सक्राइब हो गया! फसल अलर्ट मिलेंगे।" },
  consumer_toast_unsubscribed: { en: "Unsubscribed from farmer alerts.", hi: "किसान अलर्ट से अनसब्सक्राइब हो गया।" },
  consumer_qty_available: { en: "available", hi: "उपलब्ध" },

  // Search
  consumer_search_title: { en: "Search produce", hi: "उपज खोजें" },
  consumer_search_sub: {
    en: "Filter by distance, crop and grade — straight from the farm gate.",
    hi: "दूरी, फसल और ग्रेड से फ़िल्टर करें — सीधे फार्म गेट से।",
  },
  consumer_search_placeholder: { en: "Search crop, e.g. Sharbati Wheat…", hi: "फसल खोजें, जैसे शरबती गेहूं…" },
  consumer_search_category: { en: "Category", hi: "श्रेणी" },
  consumer_search_grade: { en: "Grade", hi: "ग्रेड" },
  consumer_search_any_grade: { en: "Any grade", hi: "कोई भी ग्रेड" },
  consumer_search_all: { en: "All", hi: "सभी" },
  consumer_cat_vegetables: { en: "Vegetables", hi: "सब्ज़ियां" },
  consumer_cat_fruits: { en: "Fruits", hi: "फल" },
  consumer_cat_grains: { en: "Grains", hi: "अनाज" },
  consumer_cat_organic: { en: "Organic", hi: "ऑर्गेनिक" },
  consumer_search_results: { en: "listings found", hi: "लिस्टिंग मिलीं" },
  consumer_search_none: {
    en: "No produce matches your filters. Loosen the radius or grade.",
    hi: "आपके फ़िल्टर से कोई उपज नहीं मिली। दायरा या ग्रेड ढीला करें।",
  },

  // Product detail
  consumer_pd_escrow_title: { en: "Escrow protected", hi: "एस्क्रो सुरक्षित" },
  consumer_pd_escrow_body: {
    en: "Paisa tabhi release hoga jab aap delivery par handover PIN denge. Pehle upaj check karein, phir PIN dein.",
    hi: "पैसा तभी रिलीज़ होगा जब आप डिलीवरी पर हैंडओवर PIN देंगे। पहले उपज जांचें, फिर PIN दें।",
  },
  consumer_pd_farmer_story: { en: "Farmer story", hi: "किसान की कहानी" },
  consumer_pd_quality: { en: "Grade & quality check", hi: "ग्रेड और गुणवत्ता जांच" },
  consumer_pd_opencv_pass: { en: "OpenCV pre-check passed", hi: "OpenCV प्री-चेक पास" },
  consumer_pd_qty: { en: "Quantity (kg)", hi: "मात्रा (किलो)" },
  consumer_pd_buy: { en: "Buy via Escrow", hi: "एस्क्रो से खरीदें" },
  consumer_pd_per_kg: { en: "/ kg", hi: "/ किलो" },
  consumer_pd_not_found: { en: "Listing not found.", hi: "लिस्टिंग नहीं मिली।" },
  consumer_pd_loading: { en: "Loading listing…", hi: "लिस्टिंग लोड हो रही…" },

  // Cart / checkout
  consumer_cart_title: { en: "Your basket", hi: "आपकी टोकरी" },
  consumer_cart_sub: {
    en: "Review items, then pay into escrow. The farmer is paid only after your PIN handover.",
    hi: "आइटम देखें, फिर एस्क्रो में भुगतान करें। किसान को पैसा तभी मिलेगा जब आप PIN देंगे।",
  },
  consumer_cart_empty: { en: "Your basket is empty.", hi: "आपकी टोकरी खाली है।" },
  consumer_cart_browse: { en: "Browse fresh produce", hi: "ताज़ा उपज देखें" },
  consumer_cart_summary: { en: "Order summary", hi: "ऑर्डर सारांश" },
  consumer_cart_total: { en: "Total", hi: "कुल" },
  consumer_cart_you_save: { en: "You save vs retail", hi: "रिटेल से आपकी बचत" },
  consumer_cart_escrow_notice: {
    en: "Your payment is locked in Krishi Setu Escrow. It releases to the farmer only after you share the handover PIN at delivery.",
    hi: "आपका भुगतान कृषि सेतु एस्क्रो में लॉक है। डिलीवरी पर हैंडओवर PIN देने के बाद ही किसान को मिलेगा।",
  },
  consumer_cart_escrow_locked: { en: "Escrow locked", hi: "एस्क्रो लॉक्ड" },
  consumer_cart_pay_upi: { en: "Pay with UPI", hi: "UPI से भुगतान करें" },
  consumer_cart_remove: { en: "Remove", hi: "हटाएं" },
  consumer_toast_added: { en: "Added to basket.", hi: "टोकरी में जोड़ा गया।" },
  consumer_toast_paid: {
    en: "UPI payment done — money locked in escrow!",
    hi: "UPI भुगतान हो गया — पैसा एस्क्रो में लॉक!",
  },

  // Orders
  consumer_orders_title: { en: "Your orders", hi: "आपके ऑर्डर" },
  consumer_orders_sub: {
    en: "Every order is protected by escrow PIN handover.",
    hi: "हर ऑर्डर एस्क्रो PIN हैंडओवर से सुरक्षित है।",
  },
  consumer_orders_empty: {
    en: "No orders yet. Browse the 25km Fresh market to buy direct from farmers.",
    hi: "अभी कोई ऑर्डर नहीं। किसानों से सीधे खरीदने के लिए 25km Fresh बाज़ार देखें।",
  },
  consumer_orders_track: { en: "Track", hi: "ट्रैक करें" },
  consumer_orders_rate: { en: "Rate", hi: "रेट करें" },
  consumer_orders_dispute: { en: "Dispute", hi: "विवाद" },
  consumer_escrow_locked: { en: "Escrow locked", hi: "एस्क्रो लॉक्ड" },
  consumer_escrow_released: { en: "Escrow released", hi: "एस्क्रो रिलीज़्ड" },
  consumer_orders_pin_hint: {
    en: "Share this PIN only after inspecting the produce at your doorstep.",
    hi: "अपने दरवाज़े पर उपज जांचने के बाद ही यह PIN साझा करें।",
  },
  consumer_orders_escrow_hold: {
    en: "Payment held in escrow. Inspect first, then share your PIN.",
    hi: "भुगतान एस्क्रो में है। पहले जांचें, फिर अपना PIN साझा करें।",
  },

  // Track
  consumer_track_title: { en: "Delivery tracking", hi: "डिलीवरी ट्रैकिंग" },
  consumer_step_placed: { en: "Order placed", hi: "ऑर्डर हुआ" },
  consumer_step_placed_sub: { en: "Payment locked in escrow", hi: "एस्क्रो में भुगतान लॉक" },
  consumer_step_packed: { en: "Farmer packed", hi: "किसान ने पैक किया" },
  consumer_step_packed_sub: { en: "Harvest packed at the farm gate", hi: "फार्म गेट पर फसल पैक" },
  consumer_step_transit: { en: "In transit", hi: "रास्ते में" },
  consumer_step_transit_sub: { en: "On the way to you", hi: "आपकी ओर आ रहा है" },
  consumer_step_out: { en: "Out for delivery", hi: "डिलीवरी के लिए निकला" },
  consumer_step_out_sub: { en: "Reaching your doorstep soon", hi: "जल्द आपके दरवाज़े पर" },
  consumer_step_pin: { en: "PIN handover", hi: "PIN हैंडओवर" },
  consumer_step_pin_sub: { en: "Inspect, then share your PIN", hi: "जांचें, फिर अपना PIN दें" },
  consumer_step_payout: { en: "Payout released", hi: "भुगतान रिलीज़" },
  consumer_step_payout_sub: { en: "Farmer received the payment", hi: "किसान को भुगतान मिला" },
  consumer_track_pin_title: { en: "Delivery handoff PIN", hi: "डिलीवरी हैंडऑफ़ PIN" },
  consumer_track_pin_hint: {
    en: "Share ONLY after inspecting the produce.",
    hi: "उपज जांचने के बाद ही साझा करें।",
  },
  consumer_track_pin_note: {
    en: "Once the delivery partner enters this PIN, escrow releases the payment to the farmer.",
    hi: "डिलीवरी पार्टनर द्वारा यह PIN डालते ही एस्क्रो से किसान को भुगतान मिल जाएगा।",
  },
  consumer_track_escrow_title: { en: "Escrow protection", hi: "एस्क्रो सुरक्षा" },
  consumer_track_escrow_body: {
    en: "Your money stays locked until you are satisfied. Raise a dispute any time before PIN handover.",
    hi: "आपके संतुष्ट होने तक पैसा लॉक रहेगा। PIN देने से पहले कभी भी विवाद उठा सकते हैं।",
  },
  consumer_track_report: { en: "Report an issue", hi: "समस्या दर्ज करें" },

  // Disputes
  consumer_dispute_title: { en: "Raise a dispute", hi: "विवाद दर्ज करें" },
  consumer_dispute_sub: {
    en: "Something wrong with your order? Tell us — escrow stays locked till it's resolved.",
    hi: "आपके ऑर्डर में कुछ गड़बड़ है? हमें बताएं — समाधान तक एस्क्रो लॉक रहेगा।",
  },
  consumer_dispute_order: { en: "Select order", hi: "ऑर्डर चुनें" },
  consumer_dispute_issue: { en: "What's the issue?", hi: "समस्या क्या है?" },
  consumer_dispute_photo: { en: "Photo evidence (optional)", hi: "फोटो साक्ष्य (वैकल्पिक)" },
  consumer_dispute_photo_hint: {
    en: "Tap to add a photo of the issue",
    hi: "समस्या की फोटो जोड़ने के लिए टैप करें",
  },
  consumer_dispute_desc: { en: "Describe the problem", hi: "समस्या का वर्णन करें" },
  consumer_dispute_desc_ph: {
    en: "Tell us what went wrong…",
    hi: "बताएं क्या गलत हुआ…",
  },
  consumer_dispute_submit: { en: "Submit dispute", hi: "विवाद दर्ज करें" },
  consumer_toast_dispute: {
    en: "Dispute raised — our team will review within 24 hours.",
    hi: "विवाद दर्ज हो गया — हमारी टीम 24 घंटे में समीक्षा करेगी।",
  },
  consumer_issue_quality: { en: "Poor quality", hi: "खराब गुणवत्ता" },
  consumer_issue_short_qty: { en: "Short quantity", hi: "कम मात्रा" },
  consumer_issue_late: { en: "Late delivery", hi: "देर से डिलीवरी" },
  consumer_issue_damaged: { en: "Damaged in transit", hi: "रास्ते में क्षतिग्रस्त" },
  consumer_issue_wrong_item: { en: "Wrong item", hi: "गलत आइटम" },
};
