import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: 'Missing "url" parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "FIRECRAWL_API_KEY not configured." },
        { status: 500 }
      );
    }

    const scrapeReq = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["json"],
        jsonOptions: {
          prompt:
            "Extract job listings from the page in an array, listing them as objects with role, location, description or any relevant info you can find. If none found, return an empty array."
        }
      })
    });

    if (!scrapeReq.ok) {
      const t = await scrapeReq.text();
      return NextResponse.json(
        { error: "Scrape request failed", details: t },
        { status: 500 }
      );
    }

    const scrapeData = await scrapeReq.json();
    return NextResponse.json({
      success: true,
      data: scrapeData.data?.json ?? []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}