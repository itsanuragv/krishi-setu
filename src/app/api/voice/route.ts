import { NextResponse } from "next/server";
import { rateLimiter, getClientIp, rateLimitExceededResponse } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";

export interface VoiceMessageHistory {
  role: "user" | "model" | "assistant";
  text: string;
}

export interface GeminiVoiceResponse {
  intent: "NAVIGATE" | "LIST_CROP" | "SEARCH_PRODUCE" | "AGRI_QUERY" | "CLARIFICATION";
  spokenResponse: string;
  route?: string;
  cropData?: {
    crop: string;
    variety: string;
    quantityKg: number;
    pricePerKg: number;
    unit: string;
  };
  searchQuery?: {
    query: string;
    maxPrice?: number;
    category?: string;
    distanceKm?: number;
  };
  suggestedActions?: Array<{
    label: string;
    action: "navigate" | "speak" | "fill";
    route?: string;
    speakText?: string;
  }>;
}

// Comprehensive bilingual vernacular NLP engine
function fallbackRuleBased(text: string, lang: string): GeminiVoiceResponse {
  const lower = text.toLowerCase();
  const isHi = lang === "hi-IN" || /[\u0900-\u097F]/.test(text);

  // 1. Detect Crop Names in Hindi & English (Major Field Crops & Millets)
  let detectedCrop = "";
  let detectedVariety = "Standard Grade-A";
  let defaultQuintalPrice = 3400;
  let defaultKgPrice = 34;

  if (/गेहूं|गेहू|gehu|wheat|sharbati|शरबती/i.test(text)) {
    detectedCrop = isHi ? "सीहोर शरबती गेहूं" : "MP Sharbati Golden Wheat";
    detectedVariety = "MP Sharbati Golden A+";
    defaultQuintalPrice = 3400;
    defaultKgPrice = 34;
  } else if (/सोयाबीन|सोया|soya|soyabean/i.test(text)) {
    detectedCrop = isHi ? "पीला सोयाबीन" : "Yellow Soyabean (JS-9560)";
    detectedVariety = "JS-9560 Bold Grain";
    defaultQuintalPrice = 4850;
    defaultKgPrice = 48;
  } else if (/चावल|धान|बासमती|chawal|dhan|rice|basmati/i.test(text)) {
    detectedCrop = isHi ? "पूसा 1121 बासमती धान / चावल" : "Pusa 1121 Basmati Paddy";
    detectedVariety = "Pusa 1121 Long Grain";
    defaultQuintalPrice = 7200;
    defaultKgPrice = 72;
  } else if (/मक्का|भुट्टा|makka|corn|maize/i.test(text)) {
    detectedCrop = isHi ? "देशी पीला मक्का" : "Pioneer Hybrid Yellow Maize";
    detectedVariety = "Pioneer Hybrid 3396";
    defaultQuintalPrice = 2350;
    defaultKgPrice = 24;
  } else if (/बाजरा|bajra|millet|pearl/i.test(text)) {
    detectedCrop = isHi ? "देशी संकर बाजरा (श्री अन्न)" : "Desi Pearl Millet (Bajra)";
    detectedVariety = "Desi Shanker Shri Anna";
    defaultQuintalPrice = 2600;
    defaultKgPrice = 26;
  } else if (/ज्वार|jowar|sorghum|maldandi|मालदांडी/i.test(text)) {
    detectedCrop = isHi ? "मालदांडी सफेद ज्वार (श्री अन्न)" : "Maldandi White Jowar";
    detectedVariety = "M-35-1 Maldandi Shri Anna";
    defaultQuintalPrice = 5200;
    defaultKgPrice = 52;
  } else if (/चना|chana|chickpea|dollar|काबुली/i.test(text)) {
    detectedCrop = isHi ? "मालवा डॉलर चना (काबुली)" : "Malwa Dollar Chana";
    detectedVariety = "Malwa Bold Kabuli";
    defaultQuintalPrice = 6800;
    defaultKgPrice = 68;
  } else if (/सरसों|राई|mustard|sarson/i.test(text)) {
    detectedCrop = isHi ? "काली सरसों" : "Black Mustard Seed";
    detectedVariety = "Pusa Bold Black";
    defaultQuintalPrice = 5600;
    defaultKgPrice = 56;
  }

  // 2. Mandi Rates / Price Queries (भाव, रेट, दाम, कीमत, Mandi Rates)
  if (/मंडी|भाव|रेट|दाम|कीमत|bhav|rate|price|mandi/i.test(text)) {
    if (detectedCrop) {
      return {
        intent: "AGRI_QUERY",
        route: "/farmer",
        spokenResponse: isHi
          ? `आज की सीहोर एवं इंदौर मंडियों में ${detectedCrop} का थोक भाव ₹${defaultQuintalPrice - 100} से ₹${defaultQuintalPrice + 150} प्रति क्विंटल चल रहा है।`
          : `Current APMC Mandi benchmark for ${detectedCrop} is ₹${defaultQuintalPrice - 100} to ₹${defaultQuintalPrice + 150} per quintal.`,
        suggestedActions: [
          { label: `${detectedCrop} बेचें`, action: "speak", speakText: `मुझे ${detectedCrop} बेचना है` },
          { label: "मंडी डैशबोर्ड खोलें", action: "navigate", route: "/farmer" }
        ]
      };
    }

    return {
      intent: "AGRI_QUERY",
      route: "/farmer",
      spokenResponse: isHi
        ? "आज के मुख्य अनाज मंडी भाव: शरबती गेहूं ₹3,400/क्विंटल, पीला सोयाबीन ₹4,850/क्विंटल, बासमती धान ₹7,200/क्विंटल, मक्का ₹2,350/क्विंटल और बाजरा ₹2,600/क्विंटल है।"
        : "Today's APMC Mandi benchmarks: Sharbati Wheat ₹3,400/q, Soyabean ₹4,850/q, Basmati Paddy ₹7,200/q, Maize ₹2,350/q, Bajra ₹2,600/q.",
      suggestedActions: [
        { label: "गेहूं का भाव", action: "speak", speakText: "शरबती गेहूं का मंडी भाव क्या है?" },
        { label: "सोयाबीन का भाव", action: "speak", speakText: "सोयाबीन का मंडी भाव क्या है?" },
        { label: "फसल लिस्ट करें", action: "navigate", route: "/farmer" }
      ]
    };
  }

  // 3. Sell / List Crop Intent (बेचना, फसल, लिस्ट, Sell, List)
  if (/bech|sell|fasal|list|anaaj|mandi|बेच|बेचना|बिक्री|लिस्ट|दर्ज|अनाज|फसल/i.test(text)) {
    // Detect unit
    let unit = "quintal";
    if (/ton|टन/i.test(text)) {
      unit = "ton";
    } else if (/bori|बोरी|कट्टा/i.test(text)) {
      unit = "bori";
    } else if (/kg|kilo|किलो/i.test(text)) {
      unit = "kg";
    }

    const qtyMatch = text.match(/(\d+)\s*(?:quintal|क्विंटल|ton|टन|bori|बोरी|kg|kilo|किलो)/i) || text.match(/(\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : (unit === "quintal" ? 100 : unit === "ton" ? 10 : 50);

    const priceMatch = text.match(/(?:at|@|ke bhav|mein|rup|₹|rs\.?|रुपये|रुपए|भाव)\s*(\d+)/i) || text.match(/(\d+)\s*(?:rupaye|rupee|rs|inr|रुपये|रुपए)/i);
    const price = priceMatch ? parseInt(priceMatch[1], 10) : (unit === "kg" ? defaultKgPrice : defaultQuintalPrice);

    const finalCrop = detectedCrop || (isHi ? "सीहोर शरबती गेहूं" : "MP Sharbati Golden Wheat");

    return {
      intent: "LIST_CROP",
      route: "/farmer",
      spokenResponse: isHi
        ? `जी किसान भाई, मैंने ${qty} ${unit === "quintal" ? "क्विंटल" : unit === "ton" ? "टन" : unit === "bori" ? "बोरी" : "किलो"} ${finalCrop} ₹${price} प्रति ${unit === "quintal" ? "क्विंटल" : unit} लिस्टिंग में भर दिया है! अब कृपया अपनी फसल की फोटो अपलोड करें या AI स्कैन करें।`
        : `Added ${qty} ${unit} ${finalCrop} at ₹${price}/${unit} to listing! Now please upload harvest photos or run AI quality scan.`,
      cropData: {
        crop: finalCrop,
        variety: detectedVariety,
        quantityKg: qty,
        pricePerKg: price,
        unit,
      },
      suggestedActions: [
        { label: "📸 फोटो व AI स्कैन करें", action: "navigate", route: "/farmer" },
        { label: "🌾 किसान पोर्टल", action: "navigate", route: "/farmer" }
      ]
    };
  }

  // 4. Search / Buy Produce Intent (ढूंढो, खोजो, खरीदना, चाहिए, Buy, Search)
  if (/dhundo|search|khareed|buy|chahiye|ढूंढ|ढूंढो|खोज|खरीद|चाहिए/i.test(text)) {
    const query = detectedCrop || text.replace(/ढूंढो|खोजो|चाहिए|खरीदना|search|buy/gi, "").trim() || "प्रीमियम अनाज व फसलें";
    return {
      intent: "SEARCH_PRODUCE",
      route: `/consumer?search=${encodeURIComponent(query)}`,
      spokenResponse: isHi
        ? `उपभोक्ता बाज़ार में उच्च गुणवत्ता वाली ${query} खोजी जा रही है।`
        : `Searching verified high-grade ${query} in the marketplace.`,
      searchQuery: {
        query,
      },
      suggestedActions: [
        { label: "बाज़ार परिणाम देखें", action: "navigate", route: `/consumer?search=${encodeURIComponent(query)}` }
      ]
    };
  }

  // 5. Agricultural Advisory & Pest Control (खाद, दवा, कीट, बीमारी, मौसम)
  if (/खाद|दवा|कीट|रोग|बीमारी|उर्वरक|छिड़काव|pest|fertilizer|disease|spray/i.test(text)) {
    return {
      intent: "AGRI_QUERY",
      route: "/farmer",
      spokenResponse: isHi
        ? "कीट नियंत्रण के लिए 5ml नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें। नमी के अनुसार 3 दिन में सिंचाई करें।"
        : "For organic pest control, spray 5ml neem oil per liter of water. Ensure proper soil drainage.",
      suggestedActions: [
        { label: "क्वालिटी जांचें", action: "navigate", route: "/farmer" }
      ]
    };
  }

  // 6. Navigation Intents (Full Web Page Control)
  if (/home|main|mukhy|होम|मुख्य/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/",
      spokenResponse: isHi ? "होम पेज खोला जा रहा है।" : "Opening Home Page.",
      suggestedActions: [{ label: "होम पेज", action: "navigate", route: "/" }]
    };
  }

  if (/kisan|farmer|किसान|डैशबोर्ड|intake/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/farmer",
      spokenResponse: isHi ? "किसान पोर्टल खोला जा रहा है।" : "Opening Farmer Portal.",
      suggestedActions: [{ label: "किसान पोर्टल", action: "navigate", route: "/farmer" }]
    };
  }

  if (/upbhokta|consumer|bazaar|market|उपभोक्ता|बाज़ार|खरीदार|सब्जी|खरीद/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/consumer",
      spokenResponse: isHi ? "उपभोक्ता बाज़ार खोला जा रहा है।" : "Opening Consumer Marketplace.",
      suggestedActions: [{ label: "उपभोक्ता बाज़ार", action: "navigate", route: "/consumer" }]
    };
  }

  if (/thok|bulk|b2b|fpo|व्यापारी|थोक/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/buyer/dashboard",
      spokenResponse: isHi ? "थोक खरीदार एवं FPO डैशबोर्ड खोला जा रहा है।" : "Opening Bulk Buyer Portal.",
      suggestedActions: [{ label: "थोक पोर्टल", action: "navigate", route: "/buyer/dashboard" }]
    };
  }

  if (/delivery|parivahan|gaadi|truck|fleet|डिलीवरी|गाड़ी|ट्रक|चालक|लॉजिस्टिक्स/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/delivery",
      spokenResponse: isHi ? "डिलीवरी फ्लीट पोर्टल खोला जा रहा है।" : "Opening Delivery Fleet Portal.",
      suggestedActions: [{ label: "डिलीवरी फ्लीट", action: "navigate", route: "/delivery" }]
    };
  }

  if (/admin|control|prashasan|vivad|dispute|एडमिन|प्रशासन|कंट्रोल|विवाद/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/admin",
      spokenResponse: isHi ? "एडमिन एवं प्रशासन पैनल खोला जा रहा है।" : "Opening Admin Control Panel.",
      suggestedActions: [{ label: "एडमिन पैनल", action: "navigate", route: "/admin" }]
    };
  }

  // 7. General Friendly Conversational Reply (Never repeat static canned line!)
  return {
    intent: "CLARIFICATION",
    spokenResponse: isHi
      ? `नमस्ते किसान भाई! आपने कहा "${text}"। आप अपनी फसल (गेहूं, सोयाबीन, धान, मक्का, बाजरा) बेचने के लिए मात्रा और भाव बता सकते हैं, या आज का मंडी भाव पूछ सकते हैं।`
      : `Hello! You said "${text}". You can tell me which field crop or grain to sell with quantity (in quintals or kg), or ask for today's APMC mandi rates.`,
    suggestedActions: [
      { label: "🌾 100q गेहूं बेचें", action: "speak", speakText: "100 क्विंटल शरबती गेहूं 3400 रुपये क्विंटल बेचना है" },
      { label: "🌱 50q सोयाबीन बेचें", action: "speak", speakText: "50 क्विंटल पीला सोयाबीन 4850 रुपये में बेचना है" },
      { label: "📊 किसान पोर्टल", action: "navigate", route: "/farmer" }
    ]
  };
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: 30 voice requests per minute per IP
    const clientIp = getClientIp(req);
    const rateCheck = rateLimiter.check(`voice:${clientIp}`, 30, 60 * 1000);
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck.reset, "Voice Assistant rate limit reached (30 req/min). Please try again in a moment.");
    }

    const body = await req.json();
    const rawSpeechText = body.text || "";
    const speechLang = sanitizeString(body.language, 10) || "hi-IN";
    const rawHistory = Array.isArray(body.history) ? body.history : [];

    // 2. Input Sanitization: strip script/HTML tags, enforce max 500 characters
    const text = sanitizeString(rawSpeechText, 500);

    if (!text) {
      return NextResponse.json({ error: "Missing or invalid speech text" }, { status: 400 });
    }

    // 3. Bound Conversation History to prevent payload/token exhaustion DDoS (max 10 entries)
    const history: VoiceMessageHistory[] = rawHistory.slice(-10).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      text: sanitizeString(h.text, 300),
    }));

    const language = speechLang;
    const apiKey = process.env.GEMINI_API_KEY;

    // Fast local rule-based fallback if no API key
    if (!apiKey) {
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    const systemContext = `You are "Kisan Voice Saathi" (किसान वाणी), the official real-time Gemini Voice Assistant for Krishi Setu (Bharat's Direct Farm-to-Buyer Digital Highway).
You are speaking directly with Indian farmers, grain buyers, and logistics drivers via a live voice interface.
The platform is dedicated to major agricultural field crops, grains, millets (Shri Anna), oilseeds, and pulses (Wheat, Basmati Paddy/Rice, Soyabean, Maize/Corn, Pearl Millet/Bajra, Jowar, Dollar Chana, Mustard) — not roadside retail vegetables.

Your Personality:
- Warm, respectful, and encouraging (use "नमस्ते किसान भाई", "जी", or polite Indian English).
- Speak concisely (1-2 sentences maximum, under 30 words) because your response is converted directly to live Text-To-Speech audio.
- Match user's language: if they speak Hindi or Hinglish, reply in clear, natural Devanagari Hindi. If English, reply in friendly English.

Your Domain Knowledge:
- Current Mandi Benchmarks (in Quintals / ₹ per 100kg):
  * MP Sharbati Golden Wheat (₹3,200 - ₹3,600/q)
  * Yellow Soyabean JS-9560 (₹4,600 - ₹5,100/q)
  * Pusa 1121 Basmati Paddy/Rice (₹6,800 - ₹7,600/q)
  * Pioneer Hybrid Yellow Maize (₹2,200 - ₹2,500/q)
  * Desi Pearl Millet / Bajra (₹2,400 - ₹2,800/q)
  * Maldandi White Jowar (₹4,900 - ₹5,500/q)
  * Malwa Dollar Chana (₹6,400 - ₹7,200/q)
- Direct escrow payment: Commercial buyers deposit upfront into RBI-compliant escrow; payment releases to farmer instantly upon verified QR delivery at storage/mandi.
- AI Quality Assayer: Farmers can upload photos or scan grain samples with camera to get automated AGMARK Grade A/B/C certification (moisture %, grain luster, hectolitre weight) and a 10-15% price premium.

Intents:
1. "LIST_CROP": Farmer wants to sell crops (e.g. "100 क्विंटल शरबती गेहूं बेचना है 3400 में", "sell 50 quintal soyabean at 4800"). Extract crop, variety, quantityKg (numeric quantity in quintals or specified unit), pricePerKg (numeric price), unit ("quintal", "ton", "bori", "kg"). Route: "/farmer". In spokenResponse, always confirm the filled crop and prompt to upload photo or run AI camera scan: "जी किसान भाई, मैंने [मात्रा] [यूनिट] [फसल] ₹[भाव] प्रति [यूनिट] भर दिया है! अब कृपया फसल की फोटो अपलोड करें या AI स्कैन करें।"
2. "SEARCH_PRODUCE": Buyer wants to search or buy field crops/grains. Route: "/consumer?search=[query]".
3. "NAVIGATE": User wants to navigate. Targets: "/" (Home), "/farmer" (Farmer Intake), "/consumer" (Consumer Market), "/buyer/dashboard" (Bulk Buyers B2B), "/delivery" (Logistics Fleet), "/admin" (Admin Dispute & Governance).
4. "AGRI_QUERY": Farming questions, mandi prices, moisture testing, storage, or escrow trust questions.
5. "CLARIFICATION": If user said something incomplete like "मुझे बेचना है" without crop name, ask politely what field crop or grain they wish to sell.

STRICT JSON OUTPUT FORMAT:
{
  "intent": "NAVIGATE" | "LIST_CROP" | "SEARCH_PRODUCE" | "AGRI_QUERY" | "CLARIFICATION",
  "spokenResponse": "Concise spoken reply suitable for audio playback",
  "route": "/optional_route_path",
  "cropData": {
    "crop": "सीहोर शरबती गेहूं (MP Sharbati Wheat)",
    "variety": "MP Sharbati Golden A+",
    "quantityKg": 100,
    "pricePerKg": 3400,
    "unit": "quintal"
  },
  "searchQuery": {
    "query": "Soyabean",
    "maxPrice": 5000,
    "category": "Grains & Oilseeds",
    "distanceKm": 50
  },
  "suggestedActions": [
    { "label": "फसल लिस्टिंग फॉर्म", "action": "navigate", "route": "/farmer" },
    { "label": "मंडी भाव जानें", "action": "speak", "speakText": "आज के सीहोर मंडी भाव क्या हैं?" }
  ]
}`;

    // Build multi-turn conversational content for Gemini
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // System instruction prompt as first turn
    contents.push({
      role: "user",
      parts: [{ text: systemContext }],
    });
    contents.push({
      role: "model",
      parts: [{ text: '{"status":"ready","assistant":"Kisan Voice Saathi"}' }],
    });

    // Append prior conversational history (up to last 6 turns for fast context)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === "assistant" || h.role === "model" ? "model" : "user",
        parts: [{ text: h.text }],
      });
    }

    // Append current user voice input
    contents.push({
      role: "user",
      parts: [{ text: `User Spoke (${language}): "${text}"` }],
    });

    const candidateModels = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
    ];
    let rawJson: string | null = null;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.15,
              maxOutputTokens: 250,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          const textPart = parts.find((p: { text?: string; thought?: boolean }) => p.text && !p.thought) || parts[parts.length - 1];
          if (textPart?.text) {
            rawJson = textPart.text;
            break;
          }
        } else {
          console.warn(`Gemini model ${model} status:`, geminiRes.status, geminiRes.statusText);
        }
      } catch (callErr) {
        console.warn(`Gemini model ${model} error:`, callErr);
      }
    }

    if (!rawJson) {
      console.warn("Gemini service busy or unavailable. Engaging high-speed local voice intelligence.");
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    let cleaned = rawJson.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned) as GeminiVoiceResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Voice assistant endpoint error:", error);
    return NextResponse.json(
      fallbackRuleBased(speechText || "नमस्ते", speechLang || "hi-IN"),
      { status: 200 }
    );
  }
}
