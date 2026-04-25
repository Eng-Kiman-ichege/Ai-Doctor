import { NextResponse } from "next/server";

export async function GET() {
  // New Admin Key
  const DEEPGRAM_API_KEY = "b1edeb67099808e707e191bf97c3a5914344d079";
  const PROJECT_ID = "fb8ae41c-5c1f-4087-8c43-3845a909648e";

  try {
    // Master Authorization for High-Permission Clinical Agent
    const response = await fetch(`https://api.deepgram.com/v1/projects/${PROJECT_ID}/keys`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: "Clinical Agent Session",
        scopes: ["usage:write", "member"],
        time_to_live_in_seconds: 600, // 10 minutes session
      }),
    });

    console.log("Deepgram Proxy: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepgram Token API Failed:", errorText);
      return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    const data = await response.json();
    console.log("Deepgram Proxy: Token generated successfully.");
    return NextResponse.json({ token: data.key });
  } catch (error: any) {
    console.error("Deepgram Token Proxy Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
