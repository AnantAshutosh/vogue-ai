import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const apiKey = process.env.ROOT_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const OUTPUT_FILE = path.resolve("analysis_results.json");

// Convert binary to base64
async function bufferToBase64(file) {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function POST(req) {
  if (!ai) {
    return NextResponse.json({ error: "API Key missing." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !file.name || file.size === 0) {
      return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
    }

    const base64Image = await bufferToBase64(file);

    const prompt = `
Analyze the image and extract the following details:
- Clothing type (e.g., t-shirt, jeans, jacket)
- Color of each clothing item
- Brand or logo if visible
- Accessories (e.g., watches, hats, jewelry)
- Style description (e.g., casual, formal, streetwear)
- Any visible text on clothing

Return structured JSON output.
`;

    const visionResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro-exp-03-25",
      contents: [
        { role: "user", parts: [{ text: prompt }] },
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: file.type || "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    let resultText = visionResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    resultText = resultText.replace(/```(?:json)?\n?/gi, "").replace(/```$/g, "").trim();

    let analysisData;
    try {
      analysisData = JSON.parse(resultText);
    } catch (err) {
      console.error("JSON parse error:", err);
      return NextResponse.json({ error: "Failed to parse Gemini response." }, { status: 500 });
    }

    const summaryPrompt = `
Based on the extracted clothing analysis, generate a concise summary of the user's outfit.
Ensure the summary includes key clothing items, colors, brand (if visible), accessories, and style type.

Now generate a similar summary for the following data:
${JSON.stringify(analysisData)}
`;

    const summaryResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro-exp-03-25",
      contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
    });

    const summaryText =
      summaryResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";

    // 🆕 Result to Save
    const finalResult = {
      id: randomUUID(),
      analysis: analysisData,
      summary: summaryText,
      base64: base64Image,
      timestamp: new Date().toISOString(),
    };

    // 🧾 Read or create the JSON file
    let fileData = [];
    if (fs.existsSync(OUTPUT_FILE)) {
      const raw = fs.readFileSync(OUTPUT_FILE, "utf-8");
      fileData = JSON.parse(raw);
    }

    fileData.push(finalResult);

    // 💾 Save updated array
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fileData, null, 2));

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      summary: summaryText,
      id: finalResult.id,
    });
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze image." }, { status: 500 });
  }
}
