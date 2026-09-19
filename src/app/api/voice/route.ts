import { NextResponse } from "next/server";

interface GeminiVoiceResponse {
  intent: "NAVIGATE" | "LIST_CROP" | "SEARCH_PRODUCE" | "AGRI_QUERY";
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
    const { text, language = "hi-IN" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing speech text" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini key is not configured, use the fast local fallback
    if (!apiKey) {
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    const prompt = `You are Krishi Setu's intelligent Vernacular Voice Assistant ("किसान वाणी").
A user (Indian farmer, consumer, or transporter) spoke this in Hindi, Hinglish, or English:
"${text}"

Your job:
1. Determine the user's intent:
   - "NAVIGATE": User wants to visit a page (e.g. "Kisan portal", "Dashboard", "Orders", "Delivery", "Marketplace")
   - "LIST_CROP": Farmer wants to sell/list agricultural produce (e.g. "50kg tamatar 40 rupaye mein bechna hai")
   - "SEARCH_PRODUCE": Consumer wants to find or buy produce (e.g. "Nashik ke pyaaz dikhao", "Fresh tomatoes under 20km")
   - "AGRI_QUERY": Questions about mandi rates, farming, weather, escrow, or platform help.

2. Generate a natural, polite spoken response in the same language (${language === "hi-IN" ? "Hindi (Devanagari or simple Hindi)" : "English"}). Keep it concise (1-2 short sentences) suitable for Text-to-Speech audio.

3. Extract relevant parameters:
   - If LIST_CROP: crop name, variety, quantityKg (numeric), pricePerKg (numeric), unit ("kg" or "quintal").
   - If SEARCH_PRODUCE: search query, optional maxPrice, optional distanceKm.
   - If NAVIGATE: target route (one of: "/", "/farmer", "/farmer/sell", "/farmer/orders", "/farmer/earnings", "/consumer", "/consumer/search", "/consumer/orders", "/buyer/dashboard", "/delivery", "/admin").

Return STRICTLY JSON:
{
  "intent": "NAVIGATE" | "LIST_CROP" | "SEARCH_PRODUCE" | "AGRI_QUERY",
  "spokenResponse": "Concise spoken reply",
  "route": "/route_path_if_navigating_or_actionable",
  "cropData": {
    "crop": "Tomato",
    "variety": "Desi Hybrid",
    "quantityKg": 50,
    "pricePerKg": 40,
    "unit": "kg"
  },
  "searchQuery": {
    "query": "Onion",
    "maxPrice": 30,
    "category": "Vegetables",
    "distanceKm": 25
  }
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!geminiRes.ok) {
      console.warn("Gemini API call failed, falling back to local NLP:", geminiRes.statusText);
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    const data = await geminiRes.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      const fallbackResult = fallbackRuleBased(text, language);
      return NextResponse.json(fallbackResult);
    }

    const parsed = JSON.parse(rawJson) as GeminiVoiceResponse;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Voice assistant endpoint error:", error);
    return NextResponse.json(
      fallbackRuleBased("help", "hi-IN"),
      { status: 200 }
    );
  }
}
