"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  History, 
  Droplet, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Calendar,
  Stethoscope,
  Loader2,
  LogOut,
  X,
  Activity,
  ArrowLeft,
  Shield,
  Sparkles,
  Zap
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { DOCTORS } from "@/lib/doctors-data";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      const { data: consultationData } = await supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setConsultations(consultationData || []);
      setLoading(false);
    }
    fetchData();
  }, [isLoaded, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-5 h-5 text-sky-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-teal-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            {(() => {
              const doc = DOCTORS.find(d => d.id === selectedConsultation.doctor_id);
              return (
                <>
                  <div className={`p-6 bg-gradient-to-r ${doc?.gradient || 'from-sky-500 to-teal-500'} text-white flex items-center justify-between flex-shrink-0 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
                        {doc?.icon || "🩺"}
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tight">{doc?.name || "AI Specialist"}</h2>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{doc?.specialty}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedConsultation(null)}
                      className="relative z-10 p-2.5 bg-black/20 hover:bg-black/40 rounded-full transition-all border border-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-bold text-white/50 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedConsultation.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>

                    {/* Conclusion */}
                    {selectedConsultation.conclusion && (
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Clinical Conclusion</h3>
                        </div>
                        <p className="text-white/90 font-bold text-lg leading-relaxed">{selectedConsultation.conclusion}</p>
                      </section>
                    )}

                    <div className="h-px bg-white/[0.05]" />

                    {/* Summary */}
                    {selectedConsultation.summary && (
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Consultation Summary</h3>
                        </div>
                        <p className="text-white/60 text-[13px] leading-relaxed font-medium">{selectedConsultation.summary}</p>
                      </section>
                    )}

                    {/* Next Steps */}
                    {selectedConsultation.next_steps && selectedConsultation.next_steps.length > 0 && (
                      <section className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.06] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black text-white/90 mb-5 flex items-center gap-2.5">
                          <Activity className="w-4 h-4 text-sky-400" />
                          Recommended Actions
                        </h3>
                        <ul className="space-y-4">
                          {selectedConsultation.next_steps.map((step: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 text-[13px] text-white/60 font-medium">
                              <div className="w-5 h-5 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[10px] font-black text-sky-400 mt-0.5 flex-shrink-0">
                                {i + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* If nothing detailed is stored yet */}
                    {!selectedConsultation.conclusion && !selectedConsultation.summary && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4 text-white/20">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Full Report Pending</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-white/[0.06] bg-slate-900/50 backdrop-blur-sm">
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/80 font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 border border-white/10 shadow-lg"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Dashboard
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Sidebar - Premium Dark Glass */}
      <aside className="relative z-10 w-full md:w-[280px] bg-white/[0.02] backdrop-blur-2xl border-b md:border-r border-white/[0.06] p-7 flex flex-col space-y-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-sky-400 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-2xl">
              {profile?.full_name?.charAt(0) || <User className="w-6 h-6" />}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-white/90 truncate tracking-tight">{profile?.full_name || "Patient"}</h2>
            <p className="text-[9px] text-sky-400 font-black uppercase tracking-[0.2em] mt-0.5">Medical Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          <button 
            onClick={() => router.push("/consultation")}
            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-2xl font-black text-[13px] shadow-lg shadow-sky-900/40 hover:shadow-sky-900/60 transition-all hover:-translate-y-0.5 active:translate-y-0 mb-6"
          >
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4" />
              New Call
            </div>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
          
          <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-white/[0.08] text-white rounded-xl font-bold text-[13px] border border-white/10 shadow-lg">
            <History className="w-4 h-4 text-sky-400" />
            Health History
          </button>
          <button 
            onClick={() => router.push("/profile/settings")}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl font-bold text-[13px] transition-all"
          >
            <Settings className="w-4 h-4" />
            Medical Profile
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-rose-500/80 hover:bg-rose-500/10 rounded-xl font-bold text-[13px] transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 md:p-12 max-w-6xl overflow-y-auto scrollbar-hide">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-[10px] font-bold mb-4 tracking-widest uppercase">
              <Shield className="w-3 h-3" />
              Patient Records Secure
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Clinical Dashboard</h1>
            <p className="text-white/40 text-sm mt-2 font-medium">Welcome back, your health summary is up to date.</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-3 flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Network</p>
                <p className="text-xs font-bold text-white/80 uppercase">AI Stable</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── New Consultation CTA ── */}
        <button
          onClick={() => router.push("/consultation")}
          className="relative w-full mb-12 group overflow-hidden rounded-[32px] p-8 transition-all duration-300"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-teal-500 to-sky-600 group-hover:scale-105 transition-transform duration-500" />
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-2xl border border-white/20">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Ready to assist</p>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight leading-none">Start New Consultation</h3>
                <p className="text-sm text-white/80 mt-2 font-medium">Connect with a specialist via secure voice call.</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/30 transition-all group-hover:translate-x-1">
              <ChevronRight className="w-7 h-7 text-white" />
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Health Summary Card */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-md rounded-[32px] border border-white/[0.08] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-[60px]" />
              
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Vital Statistics</h3>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-950/20">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-0.5">Blood Group</p>
                    <p className="text-xl font-black text-white/90">{profile?.blood_type || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-950/20 flex-shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Known Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {profile?.allergies?.length > 0 ? (
                        profile.allergies.map((a: string) => (
                          <span key={a} className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black border border-amber-500/20 uppercase tracking-wider">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-white/20 italic font-medium">No recorded allergies</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push("/profile/settings")}
                className="w-full mt-10 py-4 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 hover:text-white/90 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                Update Vitals
              </button>
            </div>
          </section>

          {/* Consultation History */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Call History</h3>
                <span className="text-[10px] font-black bg-white/[0.05] border border-white/10 text-sky-400 px-3 py-1 rounded-full uppercase tracking-widest">
                  {consultations.length} RECORDS
                </span>
              </div>
            </div>

            {consultations.length === 0 ? (
              <div className="bg-white/[0.02] rounded-[32px] border border-dashed border-white/10 p-16 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/10">
                  <History className="w-10 h-10" />
                </div>
                <h4 className="text-white/90 font-black text-lg mb-2">No Records Found</h4>
                <p className="text-white/30 text-sm mb-8 max-w-xs mx-auto font-medium">Your medical consultation reports will appear here after your first session.</p>
                <button 
                  onClick={() => router.push("/consultation")}
                  className="bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 shadow-2xl transition-all active:scale-95"
                >
                  Book Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((c) => {
                  const doctor = DOCTORS.find(d => d.id === c.doctor_id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConsultation(c)}
                      className="group w-full relative overflow-hidden bg-white/[0.03] p-6 rounded-[28px] border border-white/[0.07] hover:border-sky-500/30 transition-all text-left shadow-lg hover:shadow-sky-900/10"
                    >
                      {/* Hover Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${doctor?.gradient || 'from-sky-500 to-teal-500'} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                      
                      <div className="relative z-10 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doctor?.gradient || 'from-slate-700 to-slate-900'} flex items-center justify-center text-white text-2xl shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                          {doctor?.icon || <Stethoscope className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[15px] font-black text-white/90 truncate tracking-tight">{doctor?.name || "AI Specialist"}</h4>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate">{doctor?.specialty}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/25 uppercase tracking-widest flex-shrink-0">
                              <Calendar className="w-3 h-3" />
                              {new Date(c.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-sky-500" />
                            <p className="text-[13px] text-white/50 font-medium line-clamp-1 group-hover:text-white/70 transition-colors">
                              {c.conclusion || "Review consultation transcript and summary"}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/20 group-hover:text-sky-400 group-hover:border-sky-500/30 group-hover:bg-sky-500/10 transition-all flex-shrink-0">
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
