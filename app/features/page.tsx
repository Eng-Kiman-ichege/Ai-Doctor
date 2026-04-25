"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mic, Shield, Brain, Zap, Clock, FileText, Stethoscope, 
  Heart, Activity, Lock, Globe, ChevronRight, Sparkles
} from "lucide-react";

const features = [
  {
    icon: <Mic className="w-6 h-6" />,
    color: "from-sky-400 to-sky-600",
    bg: "bg-sky-50",
    textColor: "text-sky-600",
    title: "Live Voice Consultations",
    desc: "Talk directly with our AI doctors through a real-time voice interface powered by ElevenLabs. No typing required — speak naturally just like a real appointment.",
    tags: ["ElevenLabs AI", "Real-time", "Natural Speech"]
  },
  {
    icon: <Brain className="w-6 h-6" />,
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    textColor: "text-violet-600",
    title: "Smart Symptom Matching",
    desc: "Our AI analyzes your symptoms and instantly matches you with the most suitable specialist — from general practitioners to cardiologists and neurologists.",
    tags: ["AI Powered", "10+ Specialists", "Instant Match"]
  },
  {
    icon: <FileText className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-600",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
    title: "Clinical Reports",
    desc: "After every consultation, receive a detailed AI-generated report with conclusions, a meeting summary, and recommended next steps — all saved to your Medical Hub.",
    tags: ["Auto-generated", "Downloadable", "Clinically Structured"]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: "from-amber-400 to-yellow-600",
    bg: "bg-amber-50",
    textColor: "text-amber-600",
    title: "Encrypted & Private",
    desc: "Your health data is end-to-end encrypted and stored securely. We never sell your data. Your medical history belongs to you — always.",
    tags: ["End-to-End", "HIPAA-aligned", "Secure Storage"]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    color: "from-rose-400 to-red-600",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
    title: "Available 24 / 7",
    desc: "Medical concerns don't follow business hours. AI Doctor Pro is available at any time — day or night — so you always have a trusted health advisor on hand.",
    tags: ["Always On", "No Waiting", "Instant Access"]
  },
  {
    icon: <Activity className="w-6 h-6" />,
    color: "from-indigo-400 to-blue-600",
    bg: "bg-indigo-50",
    textColor: "text-indigo-600",
    title: "Medical Hub",
    desc: "Your personal dashboard tracks consultation history, health vitals (blood type, allergies), and lets you review past reports anytime in one clean interface.",
    tags: ["Health Records", "History Tracking", "Personal Dashboard"]
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    color: "from-teal-400 to-cyan-600",
    bg: "bg-teal-50",
    textColor: "text-teal-600",
    title: "10+ AI Specialists",
    desc: "Choose from Dr. Aria (GP), Dr. Kai (Mental Health), Dr. Vera (Cardiology), Dr. Orion (Urgent Care), Dr. Zen (Neurology), and more — each trained on their specialty.",
    tags: ["General Care", "Specialists", "Mental Health"]
  },
  {
    icon: <Globe className="w-6 h-6" />,
    color: "from-fuchsia-400 to-pink-600",
    bg: "bg-fuchsia-50",
    textColor: "text-fuchsia-600",
    title: "Accessible Everywhere",
    desc: "Works on any device — phone, tablet, or desktop. No app download required. A premium health experience in your browser, wherever you are in the world.",
    tags: ["Cross-Platform", "No Download", "Mobile Friendly"]
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Built for your{" "}
              <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                health journey
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed mb-10">
              AI Doctor Pro combines cutting-edge AI with clinical structure to give you a healthcare experience that's fast, private, and always available.
            </p>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-sky-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              Try It Free
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 leading-tight">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-bold ${f.bg} ${f.textColor} px-2.5 py-1 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <Heart className="w-10 h-10 text-rose-400 mx-auto mb-6" />
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Your health, elevated.
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Join thousands of users who trust AI Doctor Pro for fast, private, and intelligent health guidance.
              </p>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-sky-900/40 hover:-translate-y-0.5 transition-all"
              >
                Start Your Consultation
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
