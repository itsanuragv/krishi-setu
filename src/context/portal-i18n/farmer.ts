import type { Translations } from "../LanguageContext";

/**
 * Farmer portal translations. Key prefix MUST stay `farmer_`.
 * Coordinator merges this into PORTAL_TRANSLATIONS — do not edit index.ts.
 */
export const farmerTranslations: Translations = {
  // ── Dashboard (Bolkar Bechein home) ─────────────────────────────
  farmer_dash_greeting: { en: "Namaste, Rameshwar ji 🙏", hi: "नमस्ते, रामेश्वर जी 🙏" },
  farmer_dash_sub: {
    en: "Bolkar Bechein · your direct farm-to-buyer portal",
    hi: "बोलकर बेचें · आपका सीधा किसान–खरीदार बाज़ार",
  },
  farmer_dash_stat_listings: { en: "Active listings", hi: "चालू लिस्टिंग" },
  farmer_dash_stat_matches: { en: "Matched buyers", hi: "मिले खरीदार" },
  farmer_dash_stat_trust: { en: "Trust score", hi: "भरोसा स्कोर" },
  farmer_dash_voice_hint: {
    en: "Say: “100 quintal Sharbati wheat at ₹3400 per quintal”",
    hi: "बोलें: “100 क्विंटल शरबती गेहूं, 3400 रुपये प्रति क्विंटल”",
  },
  farmer_dash_draft_title: { en: "Voice draft — please verify", hi: "बोली गई जानकारी — जांच लें" },
  farmer_dash_f_crop: { en: "Crop", hi: "फसल" },
  farmer_dash_f_qty: { en: "Quantity", hi: "मात्रा" },
  farmer_dash_f_unit: { en: "Unit", hi: "इकाई" },
  farmer_dash_f_price: { en: "Price", hi: "भाव" },
  farmer_dash_publish: { en: "Publish listing", hi: "लिस्टिंग डालें" },
  farmer_dash_published: {
    en: "Listed! Buyers within 25 km can now see your crop.",
    hi: "लिस्टिंग डाल दी! अब 25 किमी के भीतर के खरीदार आपकी फसल देख सकेंगे।",
  },
  farmer_dash_voice_missed: {
    en: "Couldn't catch that — please speak again or type below.",
    hi: "सुनाई नहीं दिया — दोबारा बोलें या नीचे खुद लिखें।",
  },
  farmer_dash_mandi_heading: { en: "Aaj ka bhav", hi: "आज का भाव" },
  farmer_dash_mandi_sub: {
    en: "Mandi take-home vs your farm-gate price — no middlemen",
    hi: "मंडी में हाथ क्या आता बनाम आपका खेत भाव — कोई बिचौलिया नहीं",
  },
  farmer_dash_listings_heading: { en: "Aapki faslein", hi: "आपकी फसलें" },
  farmer_dash_listings_empty: {
    en: "No listings yet — sell your first crop with the mic above.",
    hi: "अभी कोई लिस्टिंग नहीं — ऊपर माइक से अपनी पहली फसल बेचें।",
  },
  farmer_dash_sell_cta: { en: "Sell new crop", hi: "नई फसल बेचें" },
  farmer_dash_matched_badge: { en: "matched", hi: "खरीदार मिले" },
  farmer_dash_view: { en: "View", hi: "देखें" },

  // ── Sell wizard ─────────────────────────────────────────────────
  farmer_sell_title: { en: "Becho — list your crop", hi: "बेचो — अपनी फसल लिस्ट करें" },
  farmer_sell_sub: {
    en: "3 easy steps: photo, details, price",
    hi: "3 आसान चरण: फोटो, जानकारी, भाव",
  },
  farmer_sell_step1: { en: "Photo", hi: "फोटो" },
  farmer_sell_step2: { en: "Details", hi: "जानकारी" },
  farmer_sell_step3: { en: "Price", hi: "भाव" },
  farmer_sell_photo_title: { en: "Crop photo", hi: "फसल की फोटो" },
  farmer_sell_photo_cta: { en: "Take / choose photo", hi: "फोटो लें या चुनें" },
  farmer_sell_photo_hint: {
    en: "A clear daylight photo from about 1 foot away",
    hi: "दिन के उजाले में लगभग 1 फुट दूर से साफ फोटो लें",
  },
  farmer_sell_qc_run: { en: "Check quality (AI)", hi: "गुणवत्ता जांचें (AI)" },
  farmer_sell_qc_scanning: { en: "Checking photo…", hi: "फोटो जांची जा रही है…" },
  farmer_sell_qc_pass: { en: "Quality passed", hi: "गुणवत्ता पास" },
  farmer_sell_qc_pass_sub: {
    en: "Clear grains, good colour — buyers will trust this photo.",
    hi: "साफ दाने, अच्छा रंग — खरीदार इस फोटो पर भरोसा करेंगे।",
  },
  farmer_sell_qc_fail: { en: "Photo not clear — please retake", hi: "फोटो साफ नहीं है — दोबारा लें" },
  farmer_sell_qc_fail_sub: {
    en: "Too blurry or dark. Retake in bright daylight.",
    hi: "धुंधली या अंधेरी है। तेज़ उजाले में दोबारा लें।",
  },
  farmer_sell_retake: { en: "Retake photo", hi: "फोटो दोबारा लें" },
  farmer_sell_voice_hint: {
    en: "Or just speak — we will fill the form for you",
    hi: "या बस बोल दें — फॉर्म हम भर देंगे",
  },
  farmer_sell_voice_filled: {
    en: "Form filled from your voice — please verify.",
    hi: "आपकी आवाज़ से फॉर्म भर दिया है — जांच लें।",
  },
  farmer_sell_voice_missed: {
    en: "Couldn't catch that — please speak again or type below.",
    hi: "सुनाई नहीं दिया — दोबारा बोलें या नीचे खुद लिखें।",
  },
  farmer_sell_f_crop: { en: "Crop name", hi: "फसल का नाम" },
  farmer_sell_f_variety: { en: "Variety", hi: "किस्म" },
  farmer_sell_f_qty: { en: "Quantity", hi: "मात्रा" },
  farmer_sell_f_unit: { en: "Unit", hi: "इकाई" },
  farmer_sell_f_price: { en: "Your price", hi: "आपका भाव" },
  farmer_sell_f_grade: { en: "Grade", hi: "ग्रेड" },
  farmer_sell_f_harvest: { en: "Harvest date", hi: "कटाई की तारीख" },
  farmer_sell_f_district: { en: "District", hi: "ज़िला" },
  farmer_sell_f_notes: { en: "Notes (optional)", hi: "नोट (वैकल्पिक)" },
  farmer_sell_unit_quintal: { en: "Quintal", hi: "क्विंटल" },
  farmer_sell_unit_kg: { en: "Kg", hi: "किलो" },
  farmer_sell_price_mandi: { en: "Mandi rate", hi: "मंडी भाव" },
  farmer_sell_price_yours: { en: "Your price", hi: "आपका भाव" },
  farmer_sell_price_margin: { en: "Extra earning vs mandi", hi: "मंडी से ज़्यादा कमाई" },
  farmer_sell_price_hint: {
    en: "Slide to set your price — stay above the mandi rate to earn more.",
    hi: "अपना भाव सेट करने के लिए स्लाइड करें — मंडी भाव से ऊपर रखेंगे तो ज़्यादा कमाएंगे।",
  },
  farmer_sell_prev: { en: "Back", hi: "पीछे" },
  farmer_sell_next: { en: "Next", hi: "आगे" },
  farmer_sell_publish: { en: "Publish listing", hi: "लिस्टिंग डालें" },
  farmer_sell_published: {
    en: "Listed! Buyers within 25 km will see your crop.",
    hi: "लिस्टिंग डाल दी! 25 किमी के भीतर के खरीदार आपकी फसल देखेंगे।",
  },
  farmer_sell_need_photo: {
    en: "Please add a crop photo first.",
    hi: "पहले फसल की फोटो जोड़ें।",
  },
  farmer_sell_need_details: {
    en: "Please fill crop name, quantity and price.",
    hi: "फसल का नाम, मात्रा और भाव ज़रूर भरें।",
  },

  // ── Matches ─────────────────────────────────────────────────────
  farmer_match_title: { en: "Buyer matches", hi: "खरीदार मिलान" },
  farmer_match_sub: {
    en: "Buyers within 25 km who want your crop — score shown openly",
    hi: "25 किमी के भीतर के खरीदार जो आपकी फसल चाहते हैं — स्कोर खुलकर दिखाया गया है",
  },
  farmer_match_empty: {
    en: "No matches yet — we search for new buyers every hour.",
    hi: "अभी कोई मिलान नहीं — हर घंटे नए खरीदार खोजे जाते हैं।",
  },
  farmer_match_empty_cta: { en: "List another crop", hi: "और फसल लिस्ट करें" },
  farmer_match_wants: { en: "Wants", hi: "चाहिए" },
  farmer_match_offered: { en: "Offer", hi: "भाव" },
  farmer_match_total: { en: "Total", hi: "कुल" },
  farmer_match_away: { en: "km away", hi: "किमी दूर" },
  farmer_match_breakdown: { en: "Score breakup", hi: "स्कोर का ब्योरा" },
  farmer_match_accept: { en: "Accept & lock escrow", hi: "स्वीकार करें" },
  farmer_match_accepted: { en: "Accepted ✓", hi: "स्वीकार ✓" },
  farmer_match_accepted_toast: {
    en: "Accepted! Escrow locked — dispatch when ready.",
    hi: "स्वीकार! पैसा सुरक्षित हो गया — तैयार हों तो फसल भेजें।",
  },
  farmer_match_type_bulk: { en: "Bulk buyer (FPO)", hi: "थोक खरीदार (FPO)" },
  farmer_match_type_consumer: { en: "Consumer", hi: "घरेलू ग्राहक" },
  farmer_match_counter: { en: "Counter", hi: "भाव बदलें" },
  farmer_match_counter_toast: {
    en: "Counter offer sent to the buyer.",
    hi: "खरीदार को नया भाव भेज दिया गया।",
  },

  // ── Orders ──────────────────────────────────────────────────────
  farmer_order_title: { en: "My orders", hi: "मेरे ऑर्डर" },
  farmer_order_sub: {
    en: "Track your money from escrow lock to UPI payout",
    hi: "पैसे की सुरक्षा से UPI भुगतान तक नज़र रखें",
  },
  farmer_order_empty: {
    en: "No active orders right now — accepted matches will appear here.",
    hi: "अभी कोई चालू ऑर्डर नहीं — स्वीकार किए गए मिलान यहां दिखेंगे।",
  },
  farmer_order_stage_locked: { en: "Escrow locked", hi: "पैसा सुरक्षित" },
  farmer_order_stage_locked_sub: {
    en: "Buyer's money is safe with Krishi Setu",
    hi: "खरीदार का पैसा कृषि सेतु के पास सुरक्षित है",
  },
  farmer_order_stage_transit: { en: "In transit", hi: "रास्ते में" },
  farmer_order_stage_transit_sub: {
    en: "Delivery partner has picked up your crop",
    hi: "डिलीवरी साथी ने आपकी फसल उठा ली है",
  },
  farmer_order_stage_pin: { en: "PIN verified", hi: "PIN मिल गया" },
  farmer_order_stage_pin_sub: {
    en: "Buyer shared the 4-digit PIN at handover",
    hi: "फसल सौंपते समय खरीदार ने 4 अंकों का PIN बताया",
  },
  farmer_order_stage_released: { en: "Paid to UPI", hi: "UPI में मिल गया" },
  farmer_order_stage_released_sub: {
    en: "Money released to your UPI account",
    hi: "पैसा आपके UPI खाते में आ गया",
  },
  farmer_order_eta_days: { en: "Payout in {days} days", hi: "{days} दिन में भुगतान" },
  farmer_order_eta_today: { en: "Payout today", hi: "भुगतान आज" },
  farmer_order_eta_done: { en: "Completed", hi: "पूरा हो गया" },

  // ── Earnings ────────────────────────────────────────────────────
  farmer_earn_title: { en: "Earnings", hi: "कमाई" },
  farmer_earn_sub: {
    en: "Payout schedule and UPI history",
    hi: "भुगतान सूची और UPI लेन-देन",
  },
  farmer_earn_schedule: { en: "Payout schedule", hi: "भुगतान सूची" },
  farmer_earn_incoming: { en: "Incoming", hi: "आने वाला" },
  farmer_earn_released: { en: "Received", hi: "मिल गया" },
  farmer_earn_in_days: { en: "{days} days", hi: "{days} दिन" },
  farmer_earn_today: { en: "Today", hi: "आज" },
  farmer_earn_upi_history: { en: "UPI history", hi: "UPI लेन-देन" },
  farmer_earn_total: { en: "Total earned", hi: "कुल कमाई" },
  farmer_earn_upi_id: { en: "UPI ID", hi: "UPI ID" },
  farmer_earn_empty: {
    en: "No payouts scheduled yet.",
    hi: "अभी कोई भुगतान तय नहीं है।",
  },

  // ── Ratings ─────────────────────────────────────────────────────
  farmer_rate_title: { en: "Trust score", hi: "भरोसा स्कोर" },
  farmer_rate_sub: {
    en: "How buyers see your reliability",
    hi: "खरीदार आपकी विश्वसनीयता कैसे देखते हैं",
  },
  farmer_rate_verified: { en: "Verified producer", hi: "सत्यापित किसान" },
  farmer_rate_boost: {
    en: "+{pct}% boost in buyer matching",
    hi: "खरीदार मिलान में +{pct}% बढ़त",
  },
  farmer_rate_history: { en: "Buyer reviews", hi: "खरीदारों की राय" },
  farmer_rate_tips_title: { en: "How to raise your score", hi: "स्कोर कैसे बढ़ाएं" },
  farmer_rate_tip1: {
    en: "Dispatch within 12 hours of accepting an order.",
    hi: "ऑर्डर स्वीकारने के 12 घंटे के भीतर फसल भेज दें।",
  },
  farmer_rate_tip2: {
    en: "Upload a clear daylight photo — blurry photos lower your QC.",
    hi: "दिन के उजाले में साफ फोटो डालें — धुंधली फोटो से QC घटता है।",
  },
  farmer_rate_tip3: {
    en: "Share the 4-digit PIN only at physical handover.",
    hi: "4 अंकों का PIN सिर्फ फसल सौंपते समय ही बताएं।",
  },
  farmer_rate_tip4: {
    en: "Keep your listed quantity updated to avoid cancellations.",
    hi: "लिस्ट की हुई मात्रा अपडेट रखें ताकि ऑर्डर रद्द न हो।",
  },
  farmer_rate_pillar_ontime: { en: "On-time dispatch", hi: "समय पर भेजना" },
  farmer_rate_pillar_qc: { en: "Quality accuracy", hi: "गुणवत्ता" },
  farmer_rate_pillar_disputes: { en: "Disputes", hi: "विवाद" },
  farmer_rate_pillar_repeat: { en: "Repeat buyers", hi: "दोबारा खरीदने वाले" },
  farmer_rate_pillar_clean: { en: "Clean", hi: "साफ़" },

  // ── Listing detail ──────────────────────────────────────────────
  farmer_list_back: { en: "Back", hi: "पीछे" },
  farmer_list_share: { en: "Share", hi: "साझा करें" },
  farmer_list_shared: { en: "Listing link copied!", hi: "लिंक कॉपी हो गया!" },
  farmer_list_stock: { en: "Total stock", hi: "कुल स्टॉक" },
  farmer_list_available: { en: "Available", hi: "उपलब्ध" },
  farmer_list_harvest: { en: "Harvest", hi: "कटाई" },
  farmer_list_location: { en: "Location", hi: "जगह" },
  farmer_list_update_price: { en: "Update price", hi: "भाव बदलें" },
  farmer_list_price_updated: { en: "Price updated.", hi: "भाव बदल दिया गया।" },
  farmer_list_pause: { en: "Pause", hi: "रोकें" },
  farmer_list_paused: { en: "Listing paused.", hi: "लिस्टिंग रोक दी गई।" },
  farmer_list_paused_badge: { en: "Paused", hi: "रोकी गई" },
  farmer_list_resume: { en: "Resume", hi: "चालू करें" },
  farmer_list_resumed: { en: "Listing is live again.", hi: "लिस्टिंग फिर से चालू है।" },
  farmer_list_matches_title: { en: "Buyer matches", hi: "खरीदार मिलान" },
  farmer_list_no_matches: {
    en: "Scanning for buyers within 25 km…",
    hi: "25 किमी के भीतर खरीदार खोजे जा रहे हैं…",
  },
  farmer_list_not_found: { en: "Listing not found.", hi: "लिस्टिंग नहीं मिली।" },
  farmer_list_back_dash: { en: "Back to dashboard", hi: "डैशबोर्ड पर वापस" },

  // ── Shared ──────────────────────────────────────────────────────
  farmer_loading: { en: "Loading…", hi: "लोड हो रहा है…" },
  farmer_per: { en: "per", hi: "प्रति" },
  farmer_unit_quintal: { en: "quintal", hi: "क्विंटल" },
  farmer_unit_kg: { en: "kg", hi: "किलो" },

  // ── Match score breakdown (5-factor bars) ─────────────────────────
  farmer_bd_quantity: { en: "Quantity fit", hi: "मात्रा" },
  farmer_bd_price: { en: "Price", hi: "भाव" },
  farmer_bd_location: { en: "Distance", hi: "दूरी" },
  farmer_bd_quality: { en: "Quality", hi: "गुणवत्ता" },
  farmer_bd_trust: { en: "Trust", hi: "भरोसा" },
  farmer_bd_breakup: { en: "Score breakup", hi: "स्कोर का ब्योरा" },
};
