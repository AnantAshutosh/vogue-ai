import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.ROOT_GEMINI_API_KEY });

export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "Explain how AI works" }] }],
    });

    const resultText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

    return new Response(JSON.stringify({ message: resultText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch response from Gemini AI" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
