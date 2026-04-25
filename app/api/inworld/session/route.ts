import { NextResponse } from "next/server";

export async function POST() {
  const INWORLD_API_KEY = "bjc5Z1h5ZUNMTW5tOC1kYXBnelBGRlJGMkFaQ2I1ei06dFVSQ2w5Nk9OYVhmcWFEMnliUy1RNQ==";

  try {
    // Inworld OpenAI Realtime protocol expects an ephemeral session token
    // for secure browser-to-server communication.
    const response = await fetch("https://api.inworld.ai/api/v1/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${INWORLD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        capabilities: {
          audio: true,
          text: true
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Inworld Session Error:", error);
      return NextResponse.json({ error: "Failed to create Inworld session" }, { status: 500 });
    }

    const data = await response.json();
    // Assuming Inworld returns a session id or ephemeral key
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Inworld Proxy Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
