"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Mic,
  ChevronDown,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import { DOCTORS } from "@/lib/doctors-data";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <MessageSquare className="w-4 h-4" />,
    title: "Describe",
    desc: "Type your symptoms so the AI doctor is prepared before the call.",
    color: "from-sky-400 to-cyan-500",
  },
  {
    step: "02",
    icon: <User className="w-4 h-4" />,
    title: "Pick a doctor",
    desc: "Choose a specialist or let AI find the best match.",
    color: "from-violet-400 to-purple-500",
  },
  {
    step: "03",
    icon: <Mic className="w-4 h-4" />,
    title: "Start your call",
    desc: "Speak naturally — no typing needed during the session.",
    color: "from-teal-400 to-emerald-500",
  },
  {
    step: "04",
    icon: <FileText className="w-4 h-4" />,
    title: "Get your report",
    desc: "Receive a clinical report with conclusions and next steps.",
    color: "from-amber-400 to-orange-500",
  },
];

export default function ConsultationPage() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("Today");
  const [severity, setSeverity] = useState(5);
  const [recommendedDoctorIds, setRecommendedDoctorIds] = useState<string[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAutoSelected, setAiAutoSelected] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const displayedDoctors =
    recommendedDoctorIds.length > 0
      ? (recommendedDoctorIds
          .map((id) => DOCTORS.find((d) => d.id === id))
          .filter(Boolean) as typeof DOCTORS)
      : DOCTORS;

  useEffect(() => {
    if (symptoms.trim().length < 5) {
      setRecommendedDoctorIds([]);
      return;
    }
    const timer = setTimeout(() => handleMatch(), 900);
    return () => clearTimeout(timer);
  }, [symptoms, duration, severity]);

  const handleMatch = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/match-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, duration, severity }),
      });
      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendedDoctorIds(data.recommendations);
        setSelectedDoctorId(data.recommendations[0]);
        setAiAutoSelected(true);
      }
    } catch (err) {
      console.error(err);
      if (!selectedDoctorId) {
        setSelectedDoctorId(DOCTORS[0].id);
        setAiAutoSelected(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartConsultation = () => {
    const doctorId =
      selectedDoctorId ||
      (recommendedDoctorIds.length > 0 ? recommendedDoctorIds[0] : DOCTORS[0].id);
    const params = new URLSearchParams({
      doctorId,
      symptoms: symptoms || "",
      duration,
      severity: severity.toString(),
    });
    router.push(`/consultation/call?${params.toString()}`);
  };

  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId);

  const severityColor =
    severity > 7 ? "#f43f5e" : severity > 4 ? "#f59e0b" : "#10b981";
  const severityLabel = severity > 7 ? "Severe" : severity > 4 ? "Moderate" : "Mild";

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      
      {/* ── MESH GRADIENT BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      {/* ── HEADER ── */}
      <header className="flex-shrink-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/[0.05]">
        <nav className="px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-900/50 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xs font-black">AIP</span>
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              AI Doctor <span className="text-sky-400">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowItWorks((v) => !v)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                showHowItWorks
                  ? "bg-white/10 text-white ring-1 ring-white/20"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              How it works
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${showHowItWorks ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              href="/profile"
              className="text-xs font-bold text-white/40 hover:text-white/80 transition-all px-4 py-2 rounded-xl hover:bg-white/5"
            >
              Medical Hub
            </Link>
          </div>
        </nav>

        {/* How it works dropdown */}
        {showHowItWorks && (
          <div className="border-t border-white/[0.05] bg-slate-900/90 backdrop-blur-3xl px-8 py-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="flex flex-col gap-3 group">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">{s.step}</span>
                      <p className="text-sm font-black text-white">{s.title}</p>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── BODY ── */}
      <main className="flex-1 flex overflow-hidden z-10">

        {/* ══════════════════════════════════════
            LEFT PANEL  — dark glass form
        ══════════════════════════════════════ */}
        <div className="w-[400px] xl:w-[460px] flex-shrink-0 flex flex-col border-r border-white/[0.05] relative bg-slate-900/20 backdrop-blur-sm">

          <div className="relative flex-1 overflow-y-auto px-8 pt-8 pb-6 space-y-7 scrollbar-hide">

            {/* Heading */}
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-full text-[10px] font-black mb-4 tracking-[0.2em] uppercase">
                <Sparkles className="w-3 h-3" />
                AI Guided Care
              </div>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
                How are you feeling?
              </h1>
              <p className="text-white/40 text-[14px] mt-2 leading-relaxed font-medium">
                Describe your symptoms below so the AI doctor is fully prepared for your call.
              </p>
            </div>

            {/* Symptom Textarea */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                Describe your symptoms
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500/20 to-teal-500/20 rounded-[24px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <textarea
                  ref={inputRef}
                  className="relative w-full h-[130px] p-5 rounded-[22px] bg-white/[0.03] border border-white/10 focus:border-sky-500/50 focus:bg-white/[0.05] outline-none transition-all duration-300 text-white placeholder:text-white/20 resize-none text-[14px] leading-relaxed font-medium"
                  placeholder="e.g. I've had a headache for two days, feel dizzy when I stand up..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>

            {/* Duration chips */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                Duration
              </label>
              <div className="flex gap-2.5">
                {["Today", "Few days", "Week+"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDuration(opt)}
                    className={`flex-1 py-3.5 rounded-[18px] text-xs font-black transition-all duration-300 tracking-wider ${
                      duration === opt
                        ? "bg-sky-500 text-white shadow-xl shadow-sky-900/50 ring-2 ring-sky-400/20"
                        : "bg-white/[0.04] text-white/40 border border-white/[0.08] hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                  Severity
                </label>
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] font-black text-white/60 font-mono">{severity}/10</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: severityColor }}>
                    {severityLabel}
                  </span>
                </div>
              </div>
              <div className="relative pt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/5 ring-1 ring-white/5"
                  style={{
                    accentColor: severityColor,
                  }}
                />
                <div
                  className="absolute top-2 left-0 h-2 rounded-full pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  style={{
                    width: `${((severity - 1) / 9) * 100}%`,
                    background: `linear-gradient(to right, #10b981, ${severityColor})`,
                  }}
                />
              </div>
            </div>

            {/* ── CTA AREA ── */}
            <div className="space-y-4 pt-2">
              
              {/* AI Match Banner (Moved Above Button) */}
              {aiAutoSelected && selectedDoctor && !isAnalyzing && (
                <div className="relative group animate-in slide-in-from-bottom-2 duration-500">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/30 to-teal-500/30 rounded-2xl blur opacity-40" />
                  <div className="relative bg-slate-900/80 backdrop-blur-md border border-sky-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-900/40">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] mb-0.5">AI Matched Specialist</p>
                      <p className="text-[13px] font-black text-white truncate">
                        {selectedDoctor.name}
                        <span className="text-white/40 font-bold"> · {selectedDoctor.specialty}</span>
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Selected doctor chip (if not auto-selected but picked manually) */}
              {selectedDoctor && !aiAutoSelected && (
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${selectedDoctor.gradient} flex items-center justify-center text-base flex-shrink-0 shadow-lg`}>
                    {selectedDoctor.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Consulting with</p>
                    <p className="text-xs font-black text-white/80 truncate">{selectedDoctor.name}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </div>
              )}

              {/* Analyzing pulse */}
              {isAnalyzing && (
                <div className="flex items-center gap-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl px-4 py-3.5">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <p className="text-xs font-black text-sky-400 uppercase tracking-widest">Analyzing symptoms...</p>
                </div>
              )}

              {/* Main CTA */}
              <button
                onClick={handleStartConsultation}
                disabled={isAnalyzing}
                className={`w-full py-5 rounded-[24px] font-black text-[16px] tracking-wider transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${
                  !isAnalyzing
                    ? "bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-500 text-white shadow-[0_10px_40px_-10px_rgba(14,165,233,0.5)] hover:-translate-y-1 hover:shadow-[0_15px_50px_-10px_rgba(14,165,233,0.6)] active:translate-y-0"
                    : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                }`}
              >
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
                )}
                <Mic className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">{isAnalyzing ? "Processing..." : "Start Consultation"}</span>
                {!isAnalyzing && <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />}
              </button>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-1.5 text-white/20 text-[10px] font-black uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5" />
                  HIPAA Secure
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <div className="flex items-center gap-1.5 text-white/20 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="w-3.5 h-3.5" />
                  Live AI Engine
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/10" />
              <AlertTriangle className="w-4 h-4 text-white/10 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/25 leading-relaxed font-medium">
                AI Doctor Pro provides preliminary health guidance. Not a replacement for emergency services or hospital care.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT PANEL  — doctor grid
        ══════════════════════════════════════ */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/50">

          {/* Right panel header */}
          <div className="flex-shrink-0 px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-slate-950/30 backdrop-blur-md">
            <div>
              <h2 className="text-sm font-black text-white/90 tracking-widest uppercase">
                {isAnalyzing
                  ? "AI Matching Engine..."
                  : recommendedDoctorIds.length > 0
                  ? "Top Recommendations"
                  : "Clinical Specialists"}
              </h2>
              <p className="text-[11px] text-white/30 mt-1 font-bold">
                {selectedDoctor
                  ? `${selectedDoctor.name} is ready for your consultation`
                  : "Select a specialist or let AI find the perfect match for you"}
              </p>
            </div>
            {recommendedDoctorIds.length > 0 && !isAnalyzing && (
              <button
                onClick={() => {
                  setRecommendedDoctorIds([]);
                  setSelectedDoctorId(null);
                  setAiAutoSelected(false);
                }}
                className="text-[10px] font-black text-sky-400 hover:text-sky-300 transition-all px-3 py-1.5 rounded-lg border border-sky-400/20 hover:bg-sky-400/10 uppercase tracking-widest"
              >
                Clear Results
              </button>
            )}
          </div>

          {/* Doctor Grid */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayedDoctors.map((doc, idx) => {
                const isSelected = selectedDoctorId === doc.id;
                const isBest = recommendedDoctorIds.length > 0 && idx === 0;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setAiAutoSelected(false);
                    }}
                    className={`relative flex flex-col p-6 rounded-[32px] text-left transition-all duration-500 group w-full overflow-hidden ${
                      isSelected
                        ? "bg-white/[0.08] border-2 border-sky-500 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.3)] scale-[1.02]"
                        : "bg-white/[0.03] border-2 border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] hover:scale-[1.01]"
                    }`}
                  >
                    {/* Card background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${doc.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none`} />
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${doc.gradient} opacity-[0.08] pointer-events-none`} />
                    )}

                    {/* Best match badge */}
                    {isBest && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-sky-500 to-teal-400 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl tracking-[0.2em] shadow-xl">
                        AI MATCH
                      </div>
                    )}

                    {/* Avatar row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className={`absolute -inset-1 bg-gradient-to-br ${doc.gradient} rounded-[20px] blur-md opacity-20 group-hover:opacity-40 transition-opacity`} />
                        <div className={`relative w-16 h-16 rounded-[18px] bg-gradient-to-br ${doc.gradient} flex items-center justify-center text-3xl shadow-2xl flex-shrink-0 border border-white/20`}>
                          {doc.icon}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0 mt-1 ${
                        isSelected
                          ? "bg-sky-500 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.6)]"
                          : "border-white/10 group-hover:border-white/30"
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-inner" />}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-[16px] font-black text-white tracking-tight leading-tight">{doc.name}</p>
                        {doc.badge && (
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${doc.badgeColor} tracking-widest`}>
                            {doc.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-sky-400 font-black uppercase tracking-widest">{doc.specialty}</p>
                    </div>

                    <p className="text-[12px] text-white/40 leading-relaxed font-medium mb-6 flex-1 line-clamp-3 group-hover:text-white/60 transition-colors">
                      {doc.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/40 border border-white/[0.06] uppercase tracking-wider group-hover:border-white/10 group-hover:text-white/60 transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
