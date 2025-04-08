import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OUTPUT_FILE = path.resolve("analysis_results.json");

export async function GET() {
  try {
    // If file doesn't exist, return empty array
    if (!fs.existsSync(OUTPUT_FILE)) {
      return NextResponse.json([], { status: 200 });
    }

    const rawData = fs.readFileSync(OUTPUT_FILE, "utf-8");
    const data = JSON.parse(rawData);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch analysis results." }, { status: 500 });
  }
}
