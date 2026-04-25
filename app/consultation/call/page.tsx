"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck,
  XCircle,
  Stethoscope,
  Mic,
  PhoneOff,
  Activity,
  FileText,
  Clock,
  Sparkles
} from "lucide-react";
import { DOCTORS } from "@/lib/doctors-data";
import { useElevenLabs } from "@/hooks/use-elevenlabs";
import { createClient } from "@/utils/supabase/client";

function CallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");
  const initialSymptoms = searchParams.get("symptoms");

  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const doctor = DOCTORS.find(d => d.id === doctorId) || DOCTORS[0];

  const { user, isLoaded } = useUser();
  const supabase = createClient();
  
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [medicalProfile, setMedicalProfile] = useState<any>(null);

  const formattedMedicalHistory = medicalProfile 
    ? `Blood Type: ${medicalProfile.blood_type || 'Unknown'}, Allergies: ${medicalProfile.allergies || 'None'}, Medical History: ${medicalProfile.medical_history || 'None'}` 
    : "None available";

  const greeting = initialSymptoms && initialSymptoms.trim().length > 0
    ? `Hello! I've read the symptoms you described: "${initialSymptoms}". I'm here to help you assess this. To get started, could you tell me a bit more about how you're feeling right now?`
    : `Hello! I'm ${doctor.name}, your AI health assistant today. I see you haven't listed any specific symptoms yet. Could you tell me what's been bothering you?`;

  const { startCall, endCall, callStatus, isSpeaking } = useElevenLabs({
    dynamicVariables: {
      symptoms: initialSymptoms || "None reported — please ask the patient to describe their symptoms",
      medical_history: formattedMedicalHistory
    },
    overrides: {
      agent: {
        first_message: greeting
      }
    }
  });

  // Fetch medical profile context
  useEffect(() => {
    async function getProfile() {
      if (!isLoaded || !user) return;
      const { data } = await supabase
        .from("profiles")
        .select("blood_type, allergies, medical_history")
        .eq("id", user.id)
        .single();
      if (data) setMedicalProfile(data);
    }
    getProfile();
  }, [isLoaded, user?.id]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === "active") {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
  }, [callStatus]);

  // Auto-end flow when call ends
  useEffect(() => {
    if (callStatus === "inactive" && callDuration > 10) {
      handleCallEnd();
    }
  }, [callStatus]);

  const handleCallEnd = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`/api/consultation/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          messages: []
        })
      });
      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      setReport({
        conclusion: data.conclusion || "Check-up complete.",
        summary: data.summary || "The consultation ended successfully.",
        nextSteps: data.nextSteps || ["Monitor your symptoms"]
      });
    } catch (err) {
      console.error("Report fetch error:", err);
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

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const hasSymptoms = initialSymptoms && initialSymptoms.trim().length > 0;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[14px] font-bold text-white leading-tight flex items-center gap-1.5">
              {doctor.name}
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-900" />
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="p-2 hover:bg-rose-500/20 rounded-full text-rose-400 transition-colors"
            title="End & Exit"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Generating Report Overlay */}
      {isGeneratingReport && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-sky-900 border-t-sky-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-7 h-7 text-sky-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Generating Your Report...
          </h2>
          <p className="text-slate-400 text-sm animate-pulse">
            Analyzing your consultation and preparing recommendations
          </p>
        </div>
      )}

      {/* Report Overlay */}
      {showReport && report && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-sky-500 to-teal-500 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Consultation Report</h2>
                  <p className="text-[11px] text-white/70">with {doctor.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Conclusion</h3>
                <p className="text-lg text-slate-800 font-semibold leading-relaxed">{report.conclusion}</p>
              </section>
              
              <div className="h-px bg-slate-100" />
              
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Summary</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{report.summary}</p>
              </section>

              <section className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-500" />
                  Recommended Next Steps
                </h3>
                <ul className="space-y-2.5">
                  {report.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button 
                onClick={() => router.push("/profile")}
                className="flex-1 py-3.5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 text-sm"
              >
                View All Consultations
              </button>
              <button 
                onClick={() => router.push("/")}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Call Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow effects - static, no animation that causes jumping */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        {/* Pre-call: Ready state */}
        {callStatus === "inactive" && !showReport && !isGeneratingReport && (
          <div className="flex flex-col items-center text-center px-6 max-w-sm w-full">
            {/* Doctor avatar */}
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-white/10 flex items-center justify-center text-5xl shadow-2xl">
                {doctor.icon}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-3 border-slate-900 rounded-full flex items-center justify-center border-[3px]">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{doctor.name}</h2>
            <p className="text-slate-400 text-sm mb-2">{doctor.specialty}</p>

            {/* Symptom context chip */}
            {hasSymptoms ? (
              <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <p className="text-xs text-sky-300 font-medium truncate max-w-[220px]">
                  Symptoms reviewed · Ready to consult
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600/50 rounded-full px-4 py-2 mb-8">
                <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <p className="text-xs text-slate-400 font-medium">
                  Will ask about symptoms during call
                </p>
              </div>
            )}

            <button 
              onClick={() => startCall()}
              className="group flex items-center gap-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-sky-900/40 hover:shadow-sky-900/60 transition-all hover:scale-105 active:scale-95 text-base"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              Join Voice Consultation
              <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-[11px] text-slate-500 mt-5 uppercase tracking-widest font-bold">
              Secure · ElevenLabs AI · Encrypted
            </p>
          </div>
        )}

        {/* Connecting state */}
        {callStatus === "connecting" && (
          <div className="flex flex-col items-center text-center px-6">
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-sky-500/30 flex items-center justify-center text-5xl shadow-2xl">
                {doctor.icon}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 animate-ping" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connecting...</h2>
            <p className="text-slate-400 text-sm">Establishing secure connection</p>
          </div>
        )}

        {/* Active call state */}
        {callStatus === "active" && (
          <div className="flex flex-col items-center text-center px-6 w-full max-w-sm">
            {/* Doctor avatar with speaking indicator */}
            <div className="relative mb-6">
              {/* Outer ring - only animates when speaking */}
              {isSpeaking && (
                <div className="absolute -inset-3 rounded-full border-2 border-sky-400/30 animate-pulse" />
              )}
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 flex items-center justify-center text-6xl shadow-2xl transition-all duration-300 ${isSpeaking ? 'border-sky-500/50 shadow-sky-900/50' : 'border-white/10'}`}>
                {doctor.icon}
              </div>
              {/* Speaking waveform bars */}
              {isSpeaking && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-end">
                  <span className="w-1 h-4 bg-sky-400 rounded-full animate-[bounce_0.8s_infinite]" />
                  <span className="w-1 h-6 bg-sky-400 rounded-full animate-[bounce_1s_infinite]" />
                  <span className="w-1 h-8 bg-sky-400 rounded-full animate-[bounce_0.7s_infinite]" />
                  <span className="w-1 h-6 bg-sky-400 rounded-full animate-[bounce_1.1s_infinite]" />
                  <span className="w-1 h-4 bg-sky-400 rounded-full animate-[bounce_0.9s_infinite]" />
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-white mb-1">Live with {doctor.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm font-mono font-bold text-emerald-400">
                  {isSpeaking ? "SPEAKING" : "LISTENING"}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{formatDuration(callDuration)}</span>
              </div>
            </div>

            {/* End call button */}
            <button 
              onClick={endCall}
              className="mt-12 w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/50 hover:bg-rose-600 transition-all hover:scale-110 active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <p className="text-[11px] text-slate-500 mt-3">Tap to end call</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsultationCallPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-900 text-slate-400">Loading consultation...</div>}>
      <CallContent />
    </Suspense>
  );
}
