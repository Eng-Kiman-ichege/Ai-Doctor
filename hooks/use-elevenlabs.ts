"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Conversation } from "@elevenlabs/client";

export type CallStatus = "inactive" | "active" | "connecting" | "error";

interface UseElevenLabsOptions {
  onMessage?: (message: string, role: "user" | "ai") => void;
  onStatusChange?: (status: CallStatus) => void;
  dynamicVariables?: Record<string, string | number | boolean>;
  overrides?: {
    agent?: {
      first_message?: string;
      prompt?: {
        prompt?: string;
      };
    };
  };
}

export function useElevenLabs(options: UseElevenLabsOptions = {}) {
  const [callStatus, setCallStatus] = useState<CallStatus>("inactive");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const conversationRef = useRef<Conversation | null>(null);

  const { onMessage, onStatusChange } = options;

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(callStatus);
    }
  }, [callStatus, onStatusChange]);

  const startCall = useCallback(async () => {
    try {
      setCallStatus("connecting");

      // 1. Request microphone permission early
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Fetch signed URL from our backend
      const response = await fetch("/api/elevenlabs/session");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get session URL");
      }
      const data = await response.json();
      const signedUrl = data.signed_url;

      // 3. Start conversation
      const conversation = await Conversation.startSession({
        signedUrl,
        dynamicVariables: optionsRef.current.dynamicVariables,
        overrides: optionsRef.current.overrides,
        onConnect: () => {
          setCallStatus("active");
          console.log("ElevenLabs connected");
        },
        onDisconnect: () => {
          setCallStatus("inactive");
          console.log("ElevenLabs disconnected");
        },
        onMessage: (props: { message: string; source: string }) => {
          const role = props.source === "user" ? "user" : "ai";
          optionsRef.current.onMessage?.(props.message, role);
        },
        onError: (error: any) => {
          console.error("ElevenLabs Error:", error);
          setCallStatus("error");
        },
        onModeChange: (props: { mode: "speaking" | "listening" }) => {
          setIsSpeaking(props.mode === "speaking");
        },
      });

      conversationRef.current = conversation;
    } catch (error) {
      console.error("Failed to start ElevenLabs call:", error);
      setCallStatus("error");
    }
  }, []);

  const endCall = useCallback(async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setCallStatus("inactive");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  return {
    startCall,
    endCall,
    callStatus,
    isSpeaking,
  };
}
