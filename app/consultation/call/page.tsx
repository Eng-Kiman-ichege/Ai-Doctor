"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  User, 
  CheckCircle2, 
  ShieldCheck,
  XCircle,
  Stethoscope,
  Mic,
  MicOff,
  PhoneOff,
  Activity,
  FileText,
  Loader2
} from "lucide-react";
import { DOCTORS, Doctor } from "@/lib/doctors-data";
import { DoctorAvatar } from "@/components/DoctorCard";
import { useVapi } from "@/hooks/use-vapi";
import { createClient } from "@/utils/supabase/client";

interface Message {
  id: string;
  role: "doctor" | "user";
  content: string;
  timestamp: Date;
}

function CallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");
  const initialSymptoms = searchParams.get("symptoms");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const doctor = DOCTORS.find(d => d.id === doctorId) || DOCTORS[0];
  
  const { startCall, stopCall, callStatus, activeCallId } = useVapi();
  const { user, isLoaded } = useUser();
  const supabase = createClient();
  
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [medicalProfile, setMedicalProfile] = useState<any>(null);

  // Fetch medical profile context
  useEffect(() => {
    async function getProfile() {
      if (!isLoaded || !user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("blood_type, allergies, medical_history")
        .eq("id", user.id)
        .single();
      
      if (data) {
        setMedicalProfile(data);
      }
    }
    getProfile();
  }, [isLoaded, user?.id]);

  // Auto-end flow when call ends
  useEffect(() => {
    if (callStatus === "inactive" && activeCallId) {
      handleCallEnd();
    }
  }, [callStatus, activeCallId]);

  const handleCallEnd = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`/api/consultation/report?callId=${activeCallId}&doctorId=${doctorId}`);
      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      
      setReport({
        conclusion: data.conclusion || "Check-up complete.",
        summary: data.summary || "The consultation ended successfully.",
        nextSteps: data.nextSteps || ["Monitor your symptoms"]
      });
    } catch (err) {
      console.error("Report fetch error:", err);
      // Fallback for demo purposes if API fails
      setReport({
        conclusion: "The conversation was analyzed but a detailed report could not be generated at this time.",
        summary: "Consultation completed. Please refer to the transcript if needed.",
        nextSteps: ["Maintain current care", "Follow up if symptoms persist"]
      });
    } finally {
      setIsGeneratingReport(false);
      setShowReport(true);
    }
  };

  useEffect(() => {
    // Initial doctor message
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "1",
          role: "doctor",
          content: `Hello, I'm ${doctor.name}. I've carefully reviewed the symptoms you described: "${initialSymptoms}". To give you the best guidance, could you tell me a bit more about how this is affecting your daily activities?`,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [doctor, initialSymptoms]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const doctorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "doctor",
        content: `I understand. Based on what you've shared, it's important to monitor these symptoms closely. While I'm an AI assistant and this isn't a final diagnosis, your description suggests we should focus on restorative care and potentially a follow-up with a specialist if things don't improve in 24 hours. Do you have any other concerns?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, doctorMsg]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <DoctorAvatar 
              imageSrc={doctor.imageSrc} 
              name={doctor.name} 
              gradient={doctor.gradient} 
              icon={doctor.icon} 
              size="sm" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          
          <div>
            <h1 className="text-[14px] font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              {doctor.name}
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-50" />
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Active Consultation</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
          </div>
          <button className="p-2.5 hover:bg-slate-50 rounded-full text-slate-400">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 hover:bg-slate-50 rounded-full text-slate-400">
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push("/")}
            className="p-2.5 hover:bg-rose-50 rounded-full text-rose-500 transition-colors"
            title="End Consultation"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        {/* Generating Report Overlay */}
        {isGeneratingReport && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-slate-800 animate-in fade-in duration-500">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-sky-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              Generating Clinical Report...
            </h2>
            <p className="text-slate-500 text-sm mt-2 animate-pulse">
              Finalizing consultation summary and recommendations
            </p>
          </div>
        )}

        {/* Vapi Call Overlay */}
        {callStatus !== "inactive" && (
          <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center text-white">
            <div className="relative mb-12">
              <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
              <div className="absolute -inset-4 rounded-full border-2 border-sky-400/30 animate-pulse" />
              <DoctorAvatar 
                imageSrc={doctor.imageSrc} 
                name={doctor.name} 
                gradient={doctor.gradient} 
                icon={doctor.icon} 
                size="lg" 
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Live with {doctor.name}</h2>
            <div className="flex items-center gap-2 text-sky-400 font-mono text-sm mb-12">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              CONVERSATION ACTIVE
            </div>

            <div className="flex gap-6">
              <button 
                onClick={stopCall}
                className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/40 hover:bg-rose-600 transition-all hover:scale-110 active:scale-95"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
            </div>
          </div>
        )}

        {/* Report Overlay */}
        {showReport && report && (
          <div className="absolute inset-x-4 top-4 bottom-20 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 bg-gradient-to-r from-sky-500 to-teal-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Consultation Report</h2>
              </div>
              <button onClick={() => setShowReport(false)} className="p-2 hover:bg-white/20 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Conclusion</h3>
                <p className="text-xl text-slate-800 font-medium leading-relaxed">{report.conclusion}</p>
              </section>
              
              <div className="h-px bg-slate-100" />
              
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Meeting Summary</h3>
                <p className="text-slate-600 leading-relaxed">{report.summary}</p>
              </section>

              <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-500" />
                  Recommended Next Steps
                </h3>
                <ul className="space-y-3">
                  {report.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => router.push("/profile")}
                className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
              >
                View Consultation History
              </button>
              <button 
                onClick={() => router.push("/")}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Loading Report Overlay */}
        {isGeneratingReport && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Meeting...</h2>
            <p className="text-slate-500 text-sm">Our AI is generating your detailed clinical report based on today's conversation.</p>
          </div>
        )}

        {/* Existing Chat Interface (as fallback/base) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Triage Info Card */}
            <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-800 mb-1">Incoming Triage Data</p>
                <p className="text-[11px] text-sky-700/80 leading-relaxed italic">
                  "{initialSymptoms}"
                </p>
              </div>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  }`}
                >
                  <p className="text-[13.5px] leading-relaxed">{m.content}</p>
                  <p className={`text-[10px] mt-2 opacity-60 ${m.role === "user" ? "text-right" : "text-left"}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Join Call Banner */}
        {callStatus === "inactive" && !showReport && (
          <div className="bg-white border-t border-slate-100 p-6 flex flex-col items-center">
            <button 
              onClick={() => startCall({
                bloodType: medicalProfile?.blood_type,
                allergies: medicalProfile?.allergies?.join(", "),
                medicalHistory: medicalProfile?.medical_history,
                symptoms: initialSymptoms
              })}
              className="group relative flex items-center justify-center gap-3 bg-slate-900 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              Join Live Voice Consultation
              <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Secure Vapi AI Connection</p>
          </div>
        )}
      </div>

      {/* Input Area (Only visible when not in call) */}
      {callStatus === "inactive" && !showReport && (
        <div className="bg-white border-t border-slate-200 p-4 pb-8 sm:pb-4">
          <div className="max-w-3xl mx-auto relative text-center">
            <p className="text-[12px] text-slate-400">Prefer text? Type your message below.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Message ${doctor.name}...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-sky-300 transition-all text-[14px]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-sky-500 text-white rounded-xl shadow-md disabled:bg-slate-100 disabled:text-slate-300 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultationCallPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400">Loading consultation...</div>}>
      <CallContent />
    </Suspense>
  );
}
