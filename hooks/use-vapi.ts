"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

const HEALTH_ASSISTANT_PROMPT = `
You are a professional AI Health Assistant. Your goal is to help users understand what conditions their symptoms might be related to, while remaining cautious and responsible.

RULES:
- Suggest 2-3 possible conditions the user may be experiencing based on their symptoms.
- NEVER give a definitive diagnosis.
- NEVER prescribe medications.
- ALWAYS use cautious language like "this could be", "might be", or "is commonly associated with".
- You may suggest general over-the-counter relief (e.g., rest, hydration, standard pain relief) in simple terms if appropriate.

RESPONSE STRUCTURE:
1. Acknowledge the user's symptoms clearly.
2. Suggest 2-3 possible conditions (ranked by likelihood if possible).
3. Briefly explain why those conditions fit the symptoms.
4. Provide simple, practical advice (rest, hydration, etc.).
5. Clearly recommend seeing a real doctor for confirmation.

TONE:
- Calm, clear, and supportive.
- Not overly technical and not alarming.
- Professional but empathetic.

IMPORTANT: Always include a clear recommendation to consult a healthcare professional, especially if symptoms persist, worsen, or are severe.
`;

export const useVapi = () => {
  const vapi = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) return;
    
    const vapiInstance = new Vapi(publicKey);
    vapi.current = vapiInstance;

    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setCallStatus("active");
    });

    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      setCallStatus("inactive");
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          { role: message.role, content: message.transcript },
        ]);
      }
    });

    vapiInstance.on("error", (error) => {
      // 1. Ignore empty objects or normal "meeting ended" events
      const isEjected = error?.error?.type === "ejected" || error?.message?.type === "ejected" || error?.type === "ejected";
      const isEmpty = !error || (typeof error === 'object' && Object.keys(error).length === 0);

      if (isEjected || isEmpty) {
        if (isEjected) console.log("Vapi: Meeting ended gracefully");
        setCallStatus("inactive");
        return;
      }
      
      // If it has keys but shows as {} in some consoles, we'll log its keys to debug
      console.error("Vapi functional error:", {
        message: error?.message || "Unknown error",
        type: error?.type,
        raw: error
      });
      setCallStatus("inactive");
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = useCallback((context?: any) => {
    if (!vapi.current || !assistantId) {
      console.error("Vapi not initialized or assistantId missing");
      return;
    }
    setCallStatus("loading");
    
    // Construct dynamic context string for the AI's system prompt
    const patientContext = `
      PATIENT DATA:
      - Blood Type: ${context?.bloodType || "Not provided"}
      - Allergies: ${context?.allergies || "None mentioned"}
      - Medical History: ${context?.medicalHistory || "No previous history on file"}
      - Reported Symptoms: ${context?.symptoms || "Unknown"}
    `;

    vapi.current.start(assistantId, {
      variableValues: context,
      model: {
        messages: [
          {
            role: "system",
            content: `${HEALTH_ASSISTANT_PROMPT}\n\n${patientContext}`
          }
        ]
      }
    }).then((call: any) => {
        if (call) {
            setActiveCallId(call.id);
        }
    }).catch(err => {
        console.error("Failed to start call:", err);
        setCallStatus("inactive");
    });
  }, []);

  const stopCall = useCallback(() => {
    if (!vapi.current) return;
    vapi.current.stop();
  }, []);

  return {
    startCall,
    stopCall,
    callStatus,
    messages,
    activeCallId,
    isConnected: !!vapi.current
  };
};
