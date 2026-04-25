"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export const useInworld = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive");
  const [voiceMessages, setVoiceMessages] = useState<{ role: string; content: string }[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  // Queue of audio chunks for playback
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const processAudioQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) return;
    if (!audioContextRef.current) return;

    isPlayingRef.current = true;
    const pcm = audioQueueRef.current.shift()!;
    
    const buffer = audioContextRef.current.createBuffer(1, pcm.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) {
      channelData[i] = pcm[i] / 32768;
    }
    
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
      // 1. Get secure session from proxy
      const sessionResponse = await fetch("/api/inworld/session", { method: "POST" });
      if (!sessionResponse.ok) throw new Error("Failed to initialize session");
      const sessionData = await sessionResponse.json();
      
      // Construct WebSocket URL using the session key (from 'name' or 'session_id')
      const sessionKey = sessionData.name || sessionData.session_id;
      const wsUrl = `wss://api.inworld.ai/api/v1/realtime/session?key=${sessionKey}&protocol=realtime`;

      // 2. Initialize Audio Context (Standardized 24k)
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });

      // 3. Setup WebSocket
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Inworld: Connection established");
      };

      socket.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        
        switch (msg.type) {
          case "session.created":
            console.log("Inworld: Session created, sending config...");
            socket.send(JSON.stringify({
              "type": "session.update",
              "session": {
                "type": "realtime",
                "model": "xai/grok-4-1-fast-non-reasoning-latest",
                "instructions": `
                  You are a professional AI Health Assistant (AI Doctor Pro). 
                  CONTEXT: 
                  - Blood Type: ${context?.bloodType || "Unknown"}
                  - Allergies: ${context?.allergies || "None"}
                  - History: ${context?.medicalHistory || "None"}
                  - Current Symptoms: ${context?.symptoms || "Unknown"}
                  RULES: Suggest 2-3 conditions, be warm, NEVER diagnose, NEVER prescribe.
                `,
                "output_modalities": ["audio", "text"],
                "audio": {
                  "input": {
                    "transcription": { "model": "assemblyai/u3-rt-pro" },
                    "turn_detection": {
                      "type": "semantic_vad",
                      "eagerness": "medium",
                      "create_response": true,
                      "interrupt_response": true
                    }
                  },
                  "output": {
                    "model": "inworld-tts-1.5-max",
                    "voice": "Clive"
                  }
                }
              }
            }));
            break;

          case "session.updated":
            console.log("Inworld: Ready for consultation");
            setCallStatus("active");
            setActiveCallId(msg.session_id);
            break;

          case "response.output_audio.delta":
            const binary = atob(msg.delta);
            const pcm = new Int16Array(binary.length / 2);
            for (let i = 0; i < pcm.length; i++) {
              pcm[i] = binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
            }
            audioQueueRef.current.push(pcm);
            processAudioQueue();
            break;

          case "response.output_text.delta":
            setVoiceMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [...prev.slice(0, -1), { role: "assistant", content: last.content + msg.delta }];
              }
              return [...prev, { role: "assistant", content: msg.delta }];
            });
            break;

          case "input_audio_buffer.speech_started":
            console.log("Inworld: User speaking, interrupting agent...");
            isPlayingRef.current = false;
            audioQueueRef.current = [];
            socket.send(JSON.stringify({ type: "response.cancel" }));
            break;
        }
      };

      socket.onclose = () => setCallStatus("inactive");
      socket.onerror = (e) => console.error("Inworld Error:", e);

      // 4. Setup Microphone (24k Mono PCM16)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      mediaStreamRef.current = stream;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        const input = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7FFF;
        }
        
        const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(pcm16.buffer) as any));
        socket.send(JSON.stringify({
          type: "input_audio_buffer.append",
          audio: base64
        }));
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (err) {
      console.error("Inworld initialization failed:", err);
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

  return { startCall, stopCall, callStatus, voiceMessages, activeCallId };
};
