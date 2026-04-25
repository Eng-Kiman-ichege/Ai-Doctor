"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const DEEPGRAM_WS_URL = "wss://api.deepgram.com/v1/agent";

export const useDeepgram = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  // Queue of AudioBuffers for sequential playback
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const processAudioQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    if (!audioContextRef.current) return;

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift()!;
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      isPlayingRef.current = false;
      processAudioQueue();
    };
    
    source.start();
  }, []);

  const startCall = useCallback(async (context?: any) => {
    setCallStatus("loading");
    
    try {
      // 1. Fetch Secure Session Token
      const tokenResponse = await fetch("/api/deepgram/token");
      if (!tokenResponse.ok) throw new Error("Failed to get session token");
      const { token } = await tokenResponse.json();

      // 1. Initialize Audio Context (Engine Output: 16k)
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      // 2. Setup WebSocket with official subprotocol
      const socket = new WebSocket(DEEPGRAM_WS_URL, ["token", token]);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Deepgram: Live Medical Agent Connected");
        
        const settings = {
          type: "Settings",
          audio: {
            input: {
              encoding: "linear16",
              sample_rate: 16000 
            },
            output: {
              encoding: "linear16",
              sample_rate: 16000,
              container: "none"
            }
          },
          agent: {
            listen: {
              provider: {
                type: "deepgram",
                model: "nova-3"
              }
            },
            think: {
              provider: {
                type: "open_ai",
                model: "gpt-4o-mini"
              },
              prompt: `You are a professional AI Health Assistant (AI Doctor Pro). Be warm and helpful. Suggest but don't prescribe.`
            },
            speak: {
              provider: {
                type: "deepgram",
                model: "aura-2-thalia-en"
              }
            }
          }
        };
        socket.send(JSON.stringify(settings));

        setCallStatus("active");
        setActiveCallId(`dg-${Date.now()}`);
      };

      socket.onmessage = async (event) => {
        if (typeof event.data === "string") {
          const msg = JSON.parse(event.data);
          if (msg.type === "ConversationText") {
            setMessages(prev => [...prev, { 
              role: msg.role === "assistant" ? "assistant" : "user", 
              content: msg.content 
            }]);
          }
        } else {
          // Binary data: Agent audio output (Raw PCM16)
          if (!audioContextRef.current) return;
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            const pcm = new Int16Array(arrayBuffer);
            const floats = new Float32Array(pcm.length);
            for (let i = 0; i < pcm.length; i++) {
              floats[i] = pcm[i] / 32768; // Standard PCM normalization
            }
            
            // Create buffer source from floats
            const buffer = audioContextRef.current.createBuffer(1, floats.length, 16000);
            buffer.getChannelData(0).set(floats);
            audioQueueRef.current.push(buffer);
            processAudioQueue();
          } catch (e) {
            console.error("Deepgram: PCM Processing Error:", e);
          }
        }
      };

      socket.onclose = (event) => {
        console.log("Deepgram: Connection closed", event.code, event.reason);
        setCallStatus("inactive");
      };

      socket.onerror = (err) => {
        console.error("Deepgram: WebSocket Error:", err);
      };

      // 4. Setup Microphone Capture (Matching 24k input)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        
        const input = e.inputBuffer.getChannelData(0);
        // Convert to PCM16
        const pcm16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7FFF;
        }
        socket.send(pcm16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (err) {
      console.error("Deepgram: Failed to start call:", err);
      setCallStatus("inactive");
    }
  }, [processAudioQueue]);

  const stopCall = useCallback(() => {
    socketRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    setCallStatus("inactive");
  }, []);

  return {
    startCall,
    stopCall,
    callStatus,
    messages,
    activeCallId,
    isConnected: !!socketRef.current
  };
};
