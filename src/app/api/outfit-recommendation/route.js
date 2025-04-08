// pages/api/generate-outfit.js

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.ROOT_GEMINI_API_KEY;

// --- API Key Check ---
if (!apiKey) {
  console.error("FATAL ERROR: ROOT_GEMINI_API_KEY environment variable is not set.");
} else {
  console.log("Gemini API Key loaded successfully.");
}

// --- Initialize GoogleGenAI ---
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- POST Endpoint: Generate Outfit Recommendation ---
export async function POST(req) {
  if (!ai) {
    console.error("POST /generate-outfit: API Key missing.");
    return new Response(JSON.stringify({ error: "Server configuration error: API Key missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { userData, weatherData } = body;

    // Input validation
    if (!userData || !weatherData) {
      console.warn("POST /generate-outfit: Missing input data.");
      return new Response(JSON.stringify({ error: "Missing input data (userData or weatherData)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Construct the prompt

    const prompt = `
You are an advanced AI-powered fashion stylist with expertise in personal styling, color theory, and fabric selection. Your task is to recommend a stylish and practical outfit tailored to the user's characteristics and the current weather conditions.

## User Profile:
- **Gender:** ${userData.gender || 'Not specified'}
- **Height:** ${userData.height || 'Not specified'}
- **Skin Tone:** ${userData.skinTone || 'Not specified'}
- **Body Type:** ${userData.bodyType || 'Not specified'}
- **Style Preferences:** ${userData.stylePreference || 'Any'}
- **Activity Level:** ${userData.activityLevel || 'Not specified'}
- **Occasion:** ${userData.occasion || 'Casual'} (e.g., casual, work, formal, party, sports)
- **Color Preferences:** ${userData.colorPreference || 'Not specified'}
- **Fabric Sensitivities:** ${userData.fabricSensitivity || 'None specified'}

## Weather Conditions:
- **Location:** ${weatherData.city || 'Unknown'}, ${weatherData.country || 'Unknown'}
- **Temperature:** ${weatherData.temperature}°C
- **Condition:** ${weatherData.condition || 'Unknown'}
- **Humidity:** ${weatherData.humidity}%
- **Wind Speed:** ${weatherData.windSpeed} km/h
- **Season:** ${weatherData.season || 'Unknown'}

## Outfit Recommendation:
Provide a detailed outfit suggestion that aligns with the user’s profile, style preferences, and weather conditions. The recommendation should include:

1. **Topwear:** Specify type (e.g., t-shirt, sweater, blouse), ideal fabric, fit, and color.
2. **Bottomwear/Dress:** Recommend pants, skirts, or dresses based on occasion and body type.
3. **Outerwear (if necessary):** Consider layering options for comfort and style.
4. **Footwear:** Suggest shoes that match the outfit, activity level, and weather conditions.
5. **Accessories:** Include relevant items such as scarves, watches, bags, sunglasses, jewelry, and hats.
6. **Grooming/Hair Advice (if applicable):** Suggest hairstyles or grooming tips based on the overall look.
7. **Justification & Styling Tips:** Briefly explain why the selected outfit suits the user, considering aesthetics, practicality, and seasonal appropriateness.

### Response Formatting:
- Use bullet points or clear sections for easy readability.
- Maintain a professional yet conversational tone.
- Ensure recommendations are fashion-forward while considering comfort and practicality.
`;


    //     const prompt = `
    // You are a virtual fashion stylist. Based on the following user details and current weather, suggest a stylish and practical outfit.

    // User Details:
    // - Gender: ${userData.gender || 'Not specified'}
    // - Height: ${userData.height || 'Not specified'}
    // - Skin Tone: ${userData.skinTone || 'Not specified'}
    // - Body Type: ${userData.bodyType || 'Not specified'}
    // - Style Preference: ${userData.stylePreference || 'Any'}

    // Weather:
    // - Temperature: ${weatherData.temperature}°C
    // - Condition: ${weatherData.condition || 'Unknown'}
    // - Humidity: ${weatherData.humidity}%
    // - Wind Speed: ${weatherData.windSpeed} km/h
    // - Location: ${weatherData.city || 'Unknown'}, ${weatherData.country || 'Unknown'}

    // Your response should include:
    // 1. Full outfit description (Top, Bottoms/Dress, Outerwear if needed)
    // 2. Recommended fabric and color choices suitable for the weather and user details.
    // 3. Suitable footwear.
    // 4. Accessories (e.g., hat, scarf, sunglasses, bag).
    // 5. A short justification explaining why the outfit is suitable. Format the output clearly.
    // `;

    // Generate content using Gemini API
    console.log("Sending request to Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Using the latest model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Extract the result
    const resultText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendation generated.";
    console.log("Received response from Gemini API.");

    return new Response(JSON.stringify({ recommendation: resultText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini AI API Error (POST /generate-outfit):", error);
    return new Response(JSON.stringify({ error: "Something went wrong processing your request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// --- GET Endpoint: Health Check for Gemini API ---
export async function GET() {
  if (!ai) {
    console.error("GET /generate-outfit: API Key missing.");
    return new Response(JSON.stringify({ error: "Server configuration error: API Key missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Sending health check request to Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "Respond with only the word: OK" }] }],
    });

    const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Unexpected response";
    console.log("Received health check response from Gemini API.");

    return new Response(JSON.stringify({ status: "OK", message: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Health Check Error (GET):", error);
    return new Response(JSON.stringify({ status: "Error", error: "Gemini API health check failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
