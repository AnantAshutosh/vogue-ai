// pages/api/generate-keyword.js
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.ROOT_GEMINI_API_KEY;

if (!apiKey) {
  console.error("FATAL ERROR: ROOT_GEMINI_API_KEY environment variable is not set.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req) {
  if (!ai) {
    return new Response(JSON.stringify({ error: "API Key not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { gender, preferences } = body;

    if (!gender || !preferences) {
      return new Response(JSON.stringify({ error: "Missing gender or preferences." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are a product discovery expert specializing in keyword optimization for e-commerce platforms like Amazon, Flipkart, and Myntra.

Based on the following user preferences, generate a highly relevant and optimized product **search keyword string** that can be used on marketplaces to find perfect results.

## User Info:
- Gender: ${gender}
- Preferences: ${preferences}

### Output Instructions:
- Respond with only a single line of comma-separated **product search keywords**.
- Keep keywords relevant, specific, and practical.
- Do not include explanations or extra text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const keywordResult = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    return new Response(JSON.stringify({ keywords: keywordResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error generating keyword:", err);
    return new Response(JSON.stringify({ error: "Failed to generate keyword." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Use POST to generate product keywords based on gender and preferences." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
