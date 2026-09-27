import type { Translations } from "../LanguageContext";

/**
 * Bulk Buyer (HoReCa procurement) portal translations.
 * Key prefix: buyer_. Coordinator merges this into LanguageContext.
 */
export const buyerTranslations: Translations = {
  // ---- Dashboard: Procurement Cockpit ----
  buyer_dash_eyebrow: { en: "HoReCa Procurement", hi: "होरेका खरीद" },
  buyer_dash_title: { en: "Procurement Cockpit", hi: "खरीद कॉकपिट" },
  buyer_dash_sub: {
    en: "Today's delivery slots, standing orders and monthly spend — at a glance.",
    hi: "आज की डिलीवरी स्लॉट, स्थायी ऑर्डर और मासिक खर्च — एक नज़र में।",
  },
  buyer_dash_stat_spend: { en: "Spend this month", hi: "इस महीने का खर्च" },
  buyer_dash_stat_active_pos: { en: "Active POs", hi: "सक्रिय PO" },
  buyer_dash_stat_today: { en: "Deliveries today", hi: "आज की डिलीवरी" },
  buyer_dash_stat_standing: { en: "Standing orders", hi: "स्थायी ऑर्डर" },
  buyer_dash_slots_title: { en: "Today's delivery slots", hi: "आज की डिलीवरी स्लॉट" },
  buyer_dash_slots_sub: {
    en: "Kitchen-prep windows — lock the 6 AM slot before the rush.",
    hi: "रसोई तैयारी की स्लॉट — भीड़ से पहले सुबह 6 बजे की स्लॉट पक्की करें।",
  },
  buyer_dash_slot_booked: { en: "Slot booked", hi: "स्लॉट बुक हो गई" },
  buyer_dash_standing_title: { en: "Standing orders due", hi: "स्थायी ऑर्डर देय" },
  buyer_dash_standing_sub: {
    en: "Recurring weekly supply contracts with your vendors.",
    hi: "आपके विक्रेताओं के साथ साप्ताहिक नियमित आपूर्ति अनुबंध।",
  },
  buyer_dash_due_today: { en: "Due today", hi: "आज देय" },
  buyer_dash_due_tomorrow: { en: "Due tomorrow", hi: "कल देय" },
  buyer_dash_repeat: { en: "Repeat", hi: "दोहराएं" },
  buyer_dash_standing_repeated: {
    en: "Standing order repeated — vendor notified.",
    hi: "स्थायी ऑर्डर दोहराया गया — विक्रेता को सूचित किया गया।",
  },
  buyer_dash_lists_title: { en: "Quick Order Lists", hi: "त्वरित ऑर्डर सूची" },
  buyer_dash_lists_sub: {
    en: "Saved weekly templates — one tap to reorder everything.",
    hi: "सहेजे हुए साप्ताहिक टेम्पलेट — एक क्लिक में पूरा ऑर्डर दोबारा।",
  },
  buyer_dash_reorder: { en: "Reorder", hi: "फिर से ऑर्डर करें" },
  buyer_dash_reordered: {
    en: "List reordered — items added to your cart.",
    hi: "सूची दोबारा ऑर्डर की गई — सामान कार्ट में जुड़ गया।",
  },
  buyer_dash_items: { en: "items", hi: "सामान" },
  buyer_dash_weekly: { en: "Weekly", hi: "साप्ताहिक" },
  buyer_dash_go_search: { en: "Browse bulk lots", hi: "थोक लॉट देखें" },
  buyer_dash_go_requirements: { en: "Post requirement", hi: "आवश्यकता पोस्ट करें" },
  buyer_dash_status_arrived: { en: "Arrived", hi: "पहुंच गया" },
  buyer_dash_status_in_transit: { en: "In transit", hi: "रास्ते में" },
  buyer_dash_status_scheduled: { en: "Scheduled", hi: "निर्धारित" },

  // ---- Search: bulk lot discovery ----
  buyer_search_eyebrow: { en: "Bulk Lot Discovery", hi: "थोक लॉट खोज" },
  buyer_search_title: { en: "Search bulk lots", hi: "थोक लॉट खोजें" },
  buyer_search_sub: {
    en: "Slab pricing, certified grades and slab-unlocked rates from verified farmers & FPOs.",
    hi: "सत्यापित किसानों व FPO से स्लैब मूल्य, प्रमाणित ग्रेड और छूट वाले भाव।",
  },
  buyer_search_placeholder: {
    en: "Search crops — e.g. wheat, soyabean, chana…",
    hi: "फसल खोजें — जैसे गेहूं, सोयाबीन, चना…",
  },
  buyer_search_grade: { en: "Grade", hi: "ग्रेड" },
  buyer_search_all: { en: "All", hi: "सभी" },
  buyer_search_add: { en: "Add to cart", hi: "कार्ट में जोड़ें" },
  buyer_search_added: { en: "added to cart", hi: "कार्ट में जुड़ गया" },
  buyer_search_qty: { en: "Qty (kg)", hi: "मात्रा (किलो)" },
  buyer_search_no_results: {
    en: "No lots match your filters — try widening the search.",
    hi: "आपके फ़िल्टर से कोई लॉट नहीं मिला — खोज का दायरा बढ़ाएं।",
  },
  buyer_search_cart_title: { en: "Bulk cart", hi: "थोक कार्ट" },
  buyer_search_cart_empty: {
    en: "Your cart is empty — add lots from the results above.",
    hi: "आपका कार्ट खाली है — ऊपर के परिणामों से लॉट जोड़ें।",
  },
  buyer_search_clear: { en: "Clear", hi: "साफ़ करें" },
  buyer_search_remove: { en: "Remove", hi: "हटाएं" },
  buyer_search_slot_label: {
    en: "Delivery slot (kitchen prep)",
    hi: "डिलीवरी स्लॉट (रसोई तैयारी)",
  },
  buyer_search_slot_hint: {
    en: "Pick the early-morning window so stock lands before service starts.",
    hi: "सुबह की स्लॉट चुनें ताकि सेवा शुरू होने से पहले माल पहुंच जाए।",
  },
  buyer_search_po_preview: { en: "PO split preview", hi: "PO विभाजन पूर्वावलोकन" },
  buyer_search_vendor_po: { en: "PO per vendor", hi: "प्रति विक्रेता PO" },
  buyer_search_raise: { en: "Raise purchase orders", hi: "खरीद आदेश जारी करें" },
  buyer_search_raised: {
    en: "purchase orders raised — vendors notified.",
    hi: "खरीद आदेश जारी किए गए — विक्रेताओं को सूचित किया गया।",
  },
  buyer_search_pick_slot: {
    en: "Pick a delivery slot first.",
    hi: "पहले डिलीवरी स्लॉट चुनें।",
  },
  buyer_search_view_cart: { en: "View cart", hi: "कार्ट देखें" },
  buyer_search_cart_cleared: { en: "Cart cleared.", hi: "कार्ट साफ़ हो गया।" },
  buyer_search_slab_line: { en: "slab rate", hi: "स्लैब भाव" },

  // ---- Orders: vendor-grouped POs ----
  buyer_orders_eyebrow: { en: "Purchase Orders", hi: "खरीद आदेश" },
  buyer_orders_title: { en: "Purchase orders", hi: "खरीद आदेश" },
  buyer_orders_sub: {
    en: "Vendor-grouped POs with escrow status, delivery slots and handover PINs.",
    hi: "विक्रेता-समूहित PO — एस्क्रो स्थिति, डिलीवरी स्लॉट और हैंडओवर पिन सहित।",
  },
  buyer_orders_all: { en: "All", hi: "सभी" },
  buyer_orders_active: { en: "Active", hi: "सक्रिय" },
  buyer_orders_settled: { en: "Settled", hi: "निपटाए गए" },
  buyer_orders_status_active: { en: "Active", hi: "सक्रिय" },
  buyer_orders_status_in_transit: { en: "In transit", hi: "रास्ते में" },
  buyer_orders_status_qc_pending: { en: "QC pending", hi: "गुणवत्ता जांच" },
  buyer_orders_status_settled: { en: "Settled", hi: "निपटान पूर्ण" },
  buyer_orders_vendor_pos: { en: "POs", hi: "PO" },
  buyer_orders_slot: { en: "Delivery slot", hi: "डिलीवरी स्लॉट" },
  buyer_orders_escrow: { en: "Escrow", hi: "एस्क्रो" },
  buyer_orders_locked: { en: "locked", hi: "लॉक" },
  buyer_orders_pin: { en: "Handover PIN", hi: "हैंडओवर पिन" },
  buyer_orders_saved: { en: "saved vs mandi", hi: "मंडी से बचत" },
  buyer_orders_track: { en: "Track", hi: "ट्रैक करें" },
  buyer_orders_dispute: { en: "Dispute", hi: "विवाद" },
  buyer_orders_tracking_toast: {
    en: "Live tracking opened for this delivery.",
    hi: "इस डिलीवरी की लाइव ट्रैकिंग खोल दी गई।",
  },
  buyer_orders_dispute_toast: {
    en: "Dispute raised — admin will mediate.",
    hi: "विवाद दर्ज किया गया — प्रशासन मध्यस्थता करेगा।",
  },
  buyer_orders_empty: {
    en: "No purchase orders in this view yet.",
    hi: "इस दृश्य में अभी कोई खरीद आदेश नहीं है।",
  },

  // ---- Requirements: reverse marketplace ----
  buyer_req_eyebrow: { en: "Reverse Marketplace", hi: "रिवर्स बाज़ार" },
  buyer_req_title: { en: "Buyer requirements", hi: "खरीदार आवश्यकताएं" },
  buyer_req_sub: {
    en: "Post what you need — verified farmers pool their harvests against it.",
    hi: "अपनी ज़रूरत पोस्ट करें — सत्यापित किसान अपनी फसल इसके विरुद्ध जोड़ेंगे।",
  },
  buyer_req_post: { en: "Post requirement", hi: "आवश्यकता पोस्ट करें" },
  buyer_req_pooled: { en: "pooled", hi: "एकत्र" },
  buyer_req_farmers: { en: "farmers", hi: "किसान" },
  buyer_req_deadline: { en: "Deadline", hi: "अंतिम तिथि" },
  buyer_req_target: { en: "Target", hi: "लक्ष्य भाव" },
  buyer_req_status_open: { en: "Open", hi: "खुली" },
  buyer_req_status_filling: { en: "Filling", hi: "भर रही है" },
  buyer_req_status_fulfilled: { en: "Fulfilled", hi: "पूर्ण" },
  buyer_req_empty: {
    en: "No requirements yet — post the first one and watch farmers pool in.",
    hi: "अभी कोई आवश्यकता नहीं — पहली पोस्ट करें और किसानों को जुड़ते देखें।",
  },

  // ---- New requirement form ----
  buyer_req_new_title: { en: "Post a requirement", hi: "आवश्यकता पोस्ट करें" },
  buyer_req_new_sub: {
    en: "Verified farmers within 25 km get notified the moment it goes live.",
    hi: "प्रकाशित होते ही 25 किमी के सत्यापित किसानों को सूचना मिलेगी।",
  },
  buyer_req_new_crop: { en: "Crop", hi: "फसल" },
  buyer_req_new_crop_ph: {
    en: "e.g. Tomato, Soyabean, Basmati Paddy",
    hi: "जैसे टमाटर, सोयाबीन, बासमती धान",
  },
  buyer_req_new_qty: { en: "Quantity (kg)", hi: "मात्रा (किलो)" },
  buyer_req_new_grade: { en: "Grade", hi: "ग्रेड" },
  buyer_req_new_price: { en: "Target price (₹/kg)", hi: "लक्ष्य भाव (₹/किलो)" },
  buyer_req_new_district: { en: "District", hi: "ज़िला" },
  buyer_req_new_district_ph: { en: "e.g. Indore", hi: "जैसे इंदौर" },
  buyer_req_new_deadline: { en: "Delivery deadline", hi: "डिलीवरी अंतिम तिथि" },
  buyer_req_new_submit: { en: "Post requirement", hi: "आवश्यकता पोस्ट करें" },
  buyer_req_new_posted: {
    en: "Requirement posted — farmers notified.",
    hi: "आवश्यकता पोस्ट हो गई — किसानों को सूचित किया गया।",
  },
  buyer_req_new_back: { en: "Back", hi: "वापस" },
};
