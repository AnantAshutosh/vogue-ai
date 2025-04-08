import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.ROOT_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req) {
  if (!ai) {
    return NextResponse.json({ error: "API Key missing." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { recommendation, dataArray } = body;

    if (!recommendation || !Array.isArray(dataArray)) {
      return NextResponse.json(
        { error: "Invalid request body. Expecting 'recommendation' and 'dataArray'." },
        { status: 400 }
      );
    }

    const similarityPrompt = `
Given the following outfit recommendation and a list of JSON outfit analyses, determine which ones best match the recommendation based on clothing type, color, style, and accessories.

Return a JSON array of IDs for the matching outfits, based on high similarity.

Recommendation:
"""
${recommendation}
"""

Outfit Data Array:
${JSON.stringify(dataArray)}

Return only the array of matching IDs in valid JSON format, without extra text or code blocks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: similarityPrompt }] }],
    });

    let textOutput = response?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Clean the response: remove backticks, markdown, and extra text
    textOutput = textOutput.replace(/```json|```/g, "").trim();

    let matchedIds;
    try {
      matchedIds = JSON.parse(textOutput);
      if (!Array.isArray(matchedIds)) {
        throw new Error("Parsed output is not an array.");
      }
    } catch (err) {
      console.error("Failed to parse model response as JSON:", err);
      matchedIds = [];
    }

    return NextResponse.json({ matchedIds });
  } catch (error) {
    console.error("Match Recommendation Error:", error);
    return NextResponse.json({ error: "Server error while matching recommendation." }, { status: 500 });
  }
}
