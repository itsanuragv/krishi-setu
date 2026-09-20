import { NextResponse } from "next/server";

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

  // 1. Detect Crop Names in Hindi & English
  let detectedCrop = "";
  let defaultPrice = 30;

  if (/टमाटर|tamatar|tomato/i.test(text)) {
    detectedCrop = isHi ? "टमाटर" : "Tomatoes";
    defaultPrice = 32;
  } else if (/प्याज|प्याज़|pyaz|pyaaz|onion/i.test(text)) {
    detectedCrop = isHi ? "नासिक लाल प्याज" : "Nashik Red Onion";
    defaultPrice = 28;
  } else if (/आलू|aloo|potato/i.test(text)) {
    detectedCrop = isHi ? "आलू" : "Potatoes";
    defaultPrice = 22;
  } else if (/चावल|धान|chawal|dhan|rice/i.test(text)) {
    detectedCrop = isHi ? "बासमती चावल" : "Basmati Rice";
    defaultPrice = 65;
  } else if (/गेहूं|गेहू|gehu|wheat/i.test(text)) {
    detectedCrop = isHi ? "शरबती गेहूं" : "Sharbati Wheat";
    defaultPrice = 25;
  } else if (/मिर्च|mirch|chilli|pepper/i.test(text)) {
    detectedCrop = isHi ? "हरी मिर्च" : "Green Chillies";
    defaultPrice = 45;
  } else if (/शिमला|shimla|capsicum/i.test(text)) {
    detectedCrop = isHi ? "शिमला मिर्च" : "Capsicum";
    defaultPrice = 50;
  }

  // 2. Mandi Rates / Price Queries (भाव, रेट, दाम, कीमत, Mandi Rates)
  if (/मंडी|भाव|रेट|दाम|कीमत|bhav|rate|price|mandi/i.test(text)) {
    if (detectedCrop) {
      return {
        intent: "AGRI_QUERY",
        route: "/farmer",
        spokenResponse: isHi
          ? `आज की प्रमुख मंडियों में ${detectedCrop} का थोक भाव ₹${defaultPrice - 4} से ₹${defaultPrice + 5} प्रति किलो चल रहा है।`
          : `Current wholesale market benchmark for ${detectedCrop} is ₹${defaultPrice - 4} to ₹${defaultPrice + 5} per kg.`,
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
        ? "आज के मुख्य मंडी भाव: टमाटर ₹30/kg, प्याज ₹28/kg, आलू ₹22/kg और गेहूं ₹2500/क्विंटल है।"
        : "Today's APMC Mandi benchmarks: Tomato ₹30/kg, Onion ₹28/kg, Potato ₹22/kg, Wheat ₹2500/quintal.",
      suggestedActions: [
        { label: "टमाटर का भाव", action: "speak", speakText: "टमाटर का मंडी भाव क्या है?" },
        { label: "प्याज का भाव", action: "speak", speakText: "प्याज का मंडी भाव क्या है?" },
        { label: "फसल लिस्ट करें", action: "navigate", route: "/farmer/sell" }
      ]
    };
  }

  // 3. Sell / List Crop Intent (बेचना, फसल, लिस्ट, Sell, List)
  if (/bech|sell|fasal|list|बेच|बेचना|बिक्री|लिस्ट|दर्ज/i.test(text)) {
    const qtyMatch = text.match(/(\d+)\s*(?:kg|kilo|quintal|क्विंटल|किलो)/i) || text.match(/(\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 50;

    const priceMatch = text.match(/(?:at|@|ke bhav|mein|rup|₹|rs\.?|रुपये|रुपए|भाव)\s*(\d+)/i) || text.match(/(\d+)\s*(?:rupaye|rupee|rs|inr|रुपये|रुपए)/i);
    const price = priceMatch ? parseInt(priceMatch[1], 10) : defaultPrice;

    const finalCrop = detectedCrop || (isHi ? "टमाटर" : "Tomatoes");

    return {
      intent: "LIST_CROP",
      route: "/farmer/sell",
      spokenResponse: isHi
        ? `जी किसान भाई, ${qty} किलो ${finalCrop} ₹${price} प्रति किलो से लिस्टिंग फॉर्म में जोड़ दिए हैं।`
        : `Listing ${qty}kg ${finalCrop} at ₹${price} per kg. Form auto-filled.`,
      cropData: {
        crop: finalCrop,
        variety: "Standard Grade-A",
        quantityKg: qty,
        pricePerKg: price,
        unit: "kg",
      },
      suggestedActions: [
        { label: "लिस्टिंग फॉर्म पूरा करें", action: "navigate", route: "/farmer/sell" },
        { label: "AI क्वालिटी स्कैन करें", action: "navigate", route: "/farmer" }
      ]
    };
  }

  // 4. Search / Buy Produce Intent (ढूंढो, खोजो, खरीदना, चाहिए, Buy, Search)
  if (/dhundo|search|khareed|buy|chahiye|ढूंढ|ढूंढो|खोज|खरीद|चाहिए/i.test(text)) {
    const query = detectedCrop || text.replace(/ढूंढो|खोजो|चाहिए|खरीदना|search|buy/gi, "").trim() || "ताजा सब्जियां";
    return {
      intent: "SEARCH_PRODUCE",
      route: `/consumer/search?q=${encodeURIComponent(query)}`,
      spokenResponse: isHi
        ? `बाज़ार में ताज़ा ${query} खोजी जा रही है।`
        : `Searching fresh ${query} in the direct marketplace.`,
      searchQuery: {
        query,
      },
      suggestedActions: [
        { label: "बाज़ार परिणाम देखें", action: "navigate", route: `/consumer/search?q=${encodeURIComponent(query)}` }
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

  // 6. Navigation Intents
  if (/kisan|farmer|किसान|डैशबोर्ड/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/farmer",
      spokenResponse: isHi ? "किसान पोर्टल खोला जा रहा है।" : "Opening Farmer Portal.",
      suggestedActions: [{ label: "पोर्टल पर जाएं", action: "navigate", route: "/farmer" }]
    };
  }

  if (/upbhokta|consumer|bazaar|market|उपभोक्ता|बाज़ार|खरीदार/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/consumer",
      spokenResponse: isHi ? "उपभोक्ता बाज़ार खोला जा रहा है।" : "Opening Consumer Marketplace.",
      suggestedActions: [{ label: "बाज़ार जाएं", action: "navigate", route: "/consumer" }]
    };
  }

  if (/delivery|parivahan|gaadi|truck|डिलीवरी|गाड़ी|ट्रक|चालक/i.test(text)) {
    return {
      intent: "NAVIGATE",
      route: "/delivery",
      spokenResponse: isHi ? "डिलीवरी फ्लीट पोर्टल खोला जा रहा है।" : "Opening Delivery Fleet Portal.",
      suggestedActions: [{ label: "डिलीवरी फ्लीट", action: "navigate", route: "/delivery" }]
    };
  }

  // 7. General Friendly Conversational Reply (Never repeat static canned line!)
  return {
    intent: "CLARIFICATION",
    spokenResponse: isHi
      ? `नमस्ते किसान भाई! आपने कहा "${text}"। आप फसल बेचने के लिए नाम और भाव बता सकते हैं, या मंडी भाव पूछ सकते हैं।`
      : `Hello! You said "${text}". You can tell me which crop to sell with quantity, or ask for today's market rates.`,
    suggestedActions: [
      { label: "🍅 50kg टमाटर बेचें", action: "speak", speakText: "50 किलो टमाटर 35 रुपये में बेचना है" },
      { label: "🧅 प्याज का मंडी भाव", action: "speak", speakText: "प्याज का मंडी भाव क्या है?" },
      { label: "📊 किसान पोर्टल", action: "navigate", route: "/farmer" }
    ]
  };
}

export async function POST(req: Request) {
  let speechText = "";
  let speechLang = "hi-IN";

  try {
    const body = await req.json();
    speechText = body.text || "";
    speechLang = body.language || "hi-IN";
    const history: VoiceMessageHistory[] = body.history || [];

    if (!speechText || typeof speechText !== "string") {
      return NextResponse.json({ error: "Missing speech text" }, { status: 400 });
    }

    const text = speechText;
    const language = speechLang;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fast local rule-based fallback if no API key
    if (!apiKey) {
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    const systemContext = `You are "Kisan Voice Saathi" (किसान वाणी), the official real-time Gemini Voice Assistant for Krishi Setu (Bharat's Direct Farm-to-Buyer Digital Highway).
You are speaking directly with Indian farmers, consumers, and logistics drivers via a live voice interface.

Your Personality:
- Warm, respectful, and encouraging (use "नमस्ते किसान भाई", "जी", or polite Indian English).
- Speak concisely (1-2 sentences maximum, under 30 words) because your response is converted directly to live Text-To-Speech audio.
- Match user's language: if they speak Hindi or Hinglish, reply in clear, sweet Devanagari Hindi. If English, reply in friendly English.

Your Domain Knowledge:
- Current Mandi Benchmarks: Tomatoes (₹28-35/kg), Onions (₹25-32/kg), Potatoes (₹18-22/kg), Wheat (₹2400/quintal), Rice (₹3200/quintal).
- Direct escrow payment: Buyers pay upfront into RBI-compliant escrow; money releases to farmer instantly upon verified QR delivery.
- AI Quality Assayer: Farmers can take a photo of their produce to get automated AGMARK Grade A/B/C certification and a 10-15% price premium.

Intents:
1. "LIST_CROP": Farmer wants to sell crops (e.g. "50 किलो टमाटर बेचना है", "sell 100kg potatoes at 25"). Extract crop, variety, quantityKg (numeric), pricePerKg (numeric). Route: "/farmer/sell".
2. "SEARCH_PRODUCE": Consumer wants to buy fresh produce. Route: "/consumer/search".
3. "NAVIGATE": User wants to open a section. Targets: "/", "/farmer", "/farmer/sell", "/farmer/orders", "/consumer", "/consumer/search", "/delivery".
4. "AGRI_QUERY": Farming questions, mandi prices, pest control, weather, or escrow trust questions.
5. "CLARIFICATION": If user said something incomplete like "मुझे बेचना है" without crop name, ask politely what crop they wish to sell.

STRICT JSON OUTPUT FORMAT:
{
  "intent": "NAVIGATE" | "LIST_CROP" | "SEARCH_PRODUCE" | "AGRI_QUERY" | "CLARIFICATION",
  "spokenResponse": "Concise spoken reply suitable for audio playback",
  "route": "/optional_route_path",
  "cropData": {
    "crop": "Tomato",
    "variety": "Desi Hybrid",
    "quantityKg": 50,
    "pricePerKg": 35,
    "unit": "kg"
  },
  "searchQuery": {
    "query": "Onion",
    "maxPrice": 30,
    "category": "Vegetables",
    "distanceKm": 25
  },
  "suggestedActions": [
    { "label": "फसल लिस्टिंग फॉर्म", "action": "navigate", "route": "/farmer/sell" },
    { "label": "मंडी भाव जानें", "action": "speak", "speakText": "आज के मंडी भाव क्या हैं?" }
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
