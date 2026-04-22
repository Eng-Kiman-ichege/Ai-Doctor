"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import DoctorCard, { Doctor } from "@/components/DoctorCard";
import { DOCTORS } from "@/lib/doctors-data";

export default function ConsultationPage() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("Today");
  const [severity, setSeverity] = useState(5);
  const [recommendedDoctorIds, setRecommendedDoctorIds] = useState<string[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Default doctors view when no symptoms entered
  const defaultDoctors = DOCTORS;

  // Debounced AI matching
  useEffect(() => {
    if (symptoms.trim().length < 5) {
      setRecommendedDoctorIds([]);
      return;
    }

    const timer = setTimeout(() => {
      handleMatch();
    }, 1000);

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
      if (data.recommendations) {
        setRecommendedDoctorIds(data.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartConsultation = () => {
    if (!isFormValid) return;
    
    const params = new URLSearchParams({
      doctorId: selectedDoctorId!,
      symptoms: symptoms,
      duration: duration,
      severity: severity.toString(),
    });
    
    router.push(`/consultation/call?${params.toString()}`);
  };

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId);
  const isFormValid = symptoms.trim().length > 5 && selectedDoctorId !== null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">AIP</span>
            </div>
            <span className="text-[15px] font-bold text-slate-800 tracking-tight">
              AI Doctor <span className="text-sky-500">Pro</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold mb-4 shadow-sm border border-sky-100">
            <Sparkles className="w-3 h-3" />
            AI GUIDED CARE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            How are you feeling today?
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Describe your symptoms and we’ll match you with the right AI doctor.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-white mb-10">
          <div className="space-y-6">
            {/* Symptom Textarea */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Describe symptoms</label>
              <textarea
                ref={inputRef}
                autoFocus
                className="w-full min-h-[160px] p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-sky-400 focus:bg-white outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 resize-none"
                placeholder="e.g. I’ve had a headache for two days and feel dizzy whenever I stand up fast..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            {/* Optional Inputs Row */}
            <div className="grid sm:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                  How long has this been going on?
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Today", "Few days", "Week+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDuration(opt)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 ${
                        duration === opt
                          ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-100"
                          : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3 ml-1">
                  <label className="text-sm font-bold text-slate-700">Severity</label>
                  <span className={`text-xs font-black ${
                    severity > 7 ? "text-rose-500" : severity > 4 ? "text-amber-500" : "text-emerald-500"
                  }`}>{severity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Area */}
        <div className="space-y-6 min-h-[400px]">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-800">
              {isAnalyzing ? "Analyzing your symptoms..." : recommendedDoctorIds.length > 0 ? "Recommended for you" : "All available doctors"}
            </h2>
            {isAnalyzing && (
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(recommendedDoctorIds.length > 0
              ? recommendedDoctorIds.map(id => DOCTORS.find(d => d.id === id)).filter(Boolean) as Doctor[]
              : defaultDoctors
            ).map((doc, idx) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                isSelected={selectedDoctorId === doc.id}
                isBestMatch={recommendedDoctorIds.length > 0 && idx === 0}
                onClick={() => setSelectedDoctorId(doc.id)}
              />
            ))}
          </div>

          {selectedDoctorId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-800">
                You’ve selected: <span className="font-black">{selectedDoctor?.name}</span> ({selectedDoctor?.specialty})
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-100/50 border border-slate-200/50 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            Trust Note: AI Doctor Pro provides general guidance and is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
            with any questions you may have regarding a medical condition.
          </p>
        </div>
      </main>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <div className="max-w-4xl mx-auto">
          <button
            disabled={!isFormValid}
            onClick={handleStartConsultation}
            className={`w-full py-4 rounded-full font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isFormValid
                ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-sky-200 hover:-translate-y-1 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Start Consultation
            <Send className={`w-4 h-4 ${isFormValid ? "animate-pulse" : ""}`} />
          </button>
          {!isFormValid && symptoms.trim().length > 5 && !selectedDoctorId && (
            <p className="text-center text-[10px] text-sky-600 font-bold mt-2">Please select a doctor to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
