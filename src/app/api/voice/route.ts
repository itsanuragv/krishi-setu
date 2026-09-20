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

// Fallback rule-based parsing in case Gemini API is offline or key is missing
function fallbackRuleBased(text: string, lang: string): GeminiVoiceResponse {
  const lower = text.toLowerCase();

  // 1. Sell / List crop intent
  if (lower.includes("bech") || lower.includes("sell") || lower.includes("fasal") || lower.includes("list") || lower.includes("kilo") || lower.includes("rupaye")) {
    let detectedCrop = "Tomatoes";
    if (lower.includes("chawal") || lower.includes("rice") || lower.includes("dhan")) detectedCrop = "Rice";
    else if (lower.includes("gehu") || lower.includes("wheat")) detectedCrop = "Wheat";
    else if (lower.includes("pyaz") || lower.includes("onion")) detectedCrop = "Onions";
    else if (lower.includes("aloo") || lower.includes("potato")) detectedCrop = "Potatoes";

    const qtyMatch = lower.match(/(\d+)\s*(?:kg|kilo|quintal|quntal|क्विंटल|किलो)/i);
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 50;

    const priceMatch = lower.match(/(?:at|@|ke bhav|mein|rup|₹|rs\.?)\s*(\d+)/i) || lower.match(/(\d+)\s*(?:rupaye|rupee|rs|inr)/i);
    const price = priceMatch ? parseInt(priceMatch[1], 10) : 35;

    return {
      intent: "LIST_CROP",
      route: "/farmer/sell",
      spokenResponse: lang === "hi-IN"
        ? `${qty} किलो ${detectedCrop} ₹${price} प्रति किलो दर्ज किया जा रहा है।`
        : `Listing ${qty}kg ${detectedCrop} at ₹${price} per kg.`,
      cropData: {
        crop: detectedCrop,
        variety: "Standard Grade",
        quantityKg: qty,
        pricePerKg: price,
        unit: "kg",
      },
    };
  }

  // 2. Search produce intent
  if (lower.includes("dhundo") || lower.includes("search") || lower.includes("khareed") || lower.includes("buy") || lower.includes("chahiye") || lower.includes("tamatar") || lower.includes("pyaaz")) {
    return {
      intent: "SEARCH_PRODUCE",
      route: "/consumer/search",
      spokenResponse: lang === "hi-IN" ? "बाज़ार में ताज़ा फसल खोजी जा रही है।" : "Searching fresh farm produce in marketplace.",
      searchQuery: {
        query: text.replace(/(?:dhundo|khojo|chahiye|dikhao|search|buy)/gi, "").trim(),
      },
    };
  }

  // 3. Navigation intents
  if (lower.includes("kisan") || lower.includes("farmer")) {
    return {
      intent: "NAVIGATE",
      route: "/farmer",
      spokenResponse: lang === "hi-IN" ? "किसान पोर्टल खोला जा रहा है।" : "Opening Farmer Portal.",
    };
  }

  if (lower.includes("upbhokta") || lower.includes("consumer") || lower.includes("bazaar") || lower.includes("market")) {
    return {
      intent: "NAVIGATE",
      route: "/consumer",
      spokenResponse: lang === "hi-IN" ? "उपभोक्ता बाज़ार खोला जा रहा है।" : "Opening Consumer Marketplace.",
    };
  }

  if (lower.includes("delivery") || lower.includes("parivahan") || lower.includes("gaadi") || lower.includes("truck")) {
    return {
      intent: "NAVIGATE",
      route: "/delivery",
      spokenResponse: lang === "hi-IN" ? "डिलीवरी फ्लीट पोर्टल खोला जा रहा है।" : "Opening Delivery Fleet Portal.",
    };
  }

  return {
    intent: "AGRI_QUERY",
    spokenResponse: lang === "hi-IN"
      ? "कृषि सेतु में आपका स्वागत है। आप फसल बेचने, खरीदने या मंडी भाव जानने के लिए बोल सकते हैं।"
      : "Welcome to Krishi Setu. Speak to sell crops, buy fresh produce, or explore mandi prices.",
  };
}

export async function POST(req: Request) {
  try {
    const { 
      text, 
      language = "hi-IN", 
      history = [] as VoiceMessageHistory[] 
    } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing speech text" }, { status: 400 });
    }

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

    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest"];
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
              // thinkingBudget: 0 ensures instantaneous response without chain-of-thought latency
              thinkingConfig: {
                thinkingBudget: 0,
              },
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
      fallbackRuleBased("help", "hi-IN"),
      { status: 200 }
    );
  }
}
