import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const { doctorId, messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const transcript = messages
      .map((m: any) => `${m.role === "doctor" ? "Doctor" : "Patient"}: ${m.content}`)
      .join("\n");

    const systemPrompt = `You are an expert medical AI assisting with post-consultation analysis. Review the following transcript between a patient and an AI doctor.
Generate a structured JSON report with the following format:
{
  "conclusion": "A brief overall medical conclusion (1-2 sentences).",
  "summary": "A detailed clinical summary of the encounter.",
  "nextSteps": ["Actionable step 1", "Actionable step 2"]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aidoctor.com", // Optional but recommended
        "X-Title": "AI Doctor Consultation",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Transcript:\n\n${transcript}` }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API error:", errText);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const aiData = await response.json();
    const resultContent = aiData.choices[0]?.message?.content || "{}";
    
    let parsedReport;
    try {
      parsedReport = JSON.parse(resultContent);
    } catch (e) {
      console.warn("Failed to parse OpenRouter output as JSON. Using fallback.");
      parsedReport = {
        conclusion: "Clinical analysis was inconclusive.",
        summary: "The consultation ended.",
        nextSteps: ["Monitor symptoms"]
      };
    }

    const conclusion = parsedReport.conclusion || "Check-up complete.";
    const summary = parsedReport.summary || "Consultation successfully summarized.";
    const nextSteps = parsedReport.nextSteps || ["Monitor your symptoms"];
    
    // Attempt to save to Supabase
    try {
      const supabase = await createClient();
      const { error: dbError } = await supabase
        .from("consultations")
        .insert({
          user_id: userId,
          doctor_id: doctorId || "aria", 
          symptoms: "Discussed in consultation", 
          conclusion,
          summary,
          next_steps: nextSteps,
          transcript,
          duration_seconds: messages.length * 10 // rough estimate
        });

      if (dbError) {
        console.error("Failed to save consultation to Supabase:", dbError);
      }
    } catch (dbErr) {
      console.error("Supabase Save Error:", dbErr);
    }

    return NextResponse.json({
      conclusion,
      summary,
      nextSteps,
      transcript
    });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
