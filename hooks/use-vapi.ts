"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

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
    vapi.current.start(assistantId, {
      variableValues: context
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
