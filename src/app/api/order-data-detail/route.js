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
    const { htmlContent } = body;

    if (!htmlContent || typeof htmlContent !== "string") {
      return NextResponse.json(
        { error: "Invalid request. 'htmlContent' must be a string." },
        { status: 400 }
      );
    }

    //     const extractionPrompt = `
    // You are given an HTML content snippet. Your task is to extract or generate:
    // 1. A suitable title that represents the content.
    // 2. An image URL found in the HTML (or the most relevant one based on the context).

    // Return a valid JSON object like:
    // {
    //   "title": "Generated or extracted title here",
    //   "imageUrl": "https://example.com/image.jpg"
    // }

    // HTML Content:
    // """
    // ${htmlContent}
    // """
    // `;


    const extractionPrompt = `
You are an intelligent extractor that analyzes HTML content. Your task is to generate a concise and relevant title for the content, and extract the most contextually appropriate image URL from it.

Instructions:
- Return ONLY a valid JSON object with the fields "title" and "imageUrl".
- Do not include any explanation or additional text—only the JSON.
- If no image is found, use "imageUrl": "".
- Ensure the JSON is properly formatted and parsable.

Format:
{
  "title": "A short, descriptive title",
  "imageUrl": "https://example.com/image.jpg"
}

HTML Content:
"""
${htmlContent}
"""
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
    });

    let rawOutput = response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean any markdown formatting
    rawOutput = rawOutput.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(rawOutput);
      if (!result.title || !result.imageUrl) {
        throw new Error("Missing title or imageUrl in parsed output.");
      }
    } catch (err) {
      console.error("Failed to parse model response:", err);
      return NextResponse.json(
        { error: "Model response parsing failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("HTML extraction error:", error);
    return NextResponse.json(
      { error: "Server error while extracting content." },
      { status: 500 }
    );
  }
}
