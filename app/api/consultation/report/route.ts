import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

const VAPI_API_KEY = process.env.VAPI_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("callId");
  const doctorId = searchParams.get("doctorId");

  if (!callId) {
    return NextResponse.json({ error: "Missing callId" }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VAPI_API_KEY) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 500 });
  }

  try {
    let callData: any = null;
    let attempts = 0;
    const maxAttempts = 5; // Wait up to 10 seconds total (5 * 2s)

    // Retry loop to wait for Vapi analysis to complete
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
        headers: {
          Authorization: `Bearer ${VAPI_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Vapi API error: ${response.statusText}`);
      }

      callData = await response.json();

      // Check if the analysis (summary/structured data) is ready
      if (callData.analysis?.summary || callData.analysis?.structuredData) {
        break;
      }

      // If not ready, wait 2 seconds and try again
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`Waiting for Vapi analysis... attempt ${attempts}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!callData?.analysis?.summary) {
      console.warn("Vapi analysis not finalized after retries. Using partial data.");
    }

    const conclusion = callData.analysis?.summary || "Clinical analysis was inconclusive.";
    const summary = callData.analysis?.structuredData?.clinical_overview || "The consultation ended successfully.";
    const nextSteps = callData.analysis?.structuredData?.recommendations || ["Monitor symptoms", "Rest and recover"];
    const transcript = callData.transcript || "";
    
    // 2. Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("consultations")
      .insert({
        user_id: userId,
        doctor_id: doctorId || "aria", // Use internal doctorId from query param
        symptoms: callData.variableValues?.symptoms || "Brief symptoms update",
        conclusion,
        summary,
        next_steps: nextSteps,
        transcript,
        duration_seconds: callData.durationSeconds || 0
      });

    if (dbError) {
      console.error("Failed to save consultation:", dbError);
    }

    // 3. Return report
    return NextResponse.json({
      conclusion,
      summary,
      nextSteps,
      transcript
    });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
