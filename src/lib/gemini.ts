/**
 * Google AI Studio (Gemini API) Integration
 * Provides intelligent vernacular voice command parsing and crop quality reasoning.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface ParsedCropVoice {
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  floorPrice: number;
  confidence: number;
}

/**
 * Parses spoken agricultural vernacular input into structured listing parameters using Gemini
 */
export async function parseVernacularAgriSpeech(spokenText: string): Promise<ParsedCropVoice | null> {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured in environment variables.");
    return null;
  }

  const prompt = `You are Krishi Setu's Agricultural NLP assistant.
Parse the following Indian farmer speech (in Hindi, Hinglish, or English) into JSON.
Farmer said: "${spokenText}"

Return ONLY a JSON object with:
{
  "crop": string (standard English crop name, e.g. "Tomatoes", "Wheat", "Rice", "Onions"),
  "variety": string (e.g. "Desi Hybrid", "Sharbati Golden", "Basmati"),
  "quantity": number (numeric value only),
  "unit": string (e.g. "kg", "quintal"),
  "floorPrice": number (price per unit in INR),
  "confidence": number (between 0.0 and 1.0)
}`;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) {
      console.error("Gemini API error:", res.statusText);
      return null;
    }

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    return JSON.parse(rawJson) as ParsedCropVoice;
  } catch (error) {
    console.error("Failed to parse speech with Gemini AI:", error);
    return null;
  }
}
