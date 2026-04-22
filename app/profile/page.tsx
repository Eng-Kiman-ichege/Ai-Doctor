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
  LogOut
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { SignOutButton } from "@clerk/nextjs";
import { DOCTORS } from "@/lib/doctors-data";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .single();
      
      setProfile(profileData);

      // 2. Fetch Consultations
      const { data: consultationData } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });
      
      setConsultations(consultationData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-6 flex flex-col space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-100">
            {profile?.full_name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 truncate w-32">{profile?.full_name || "Patient"}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinical Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm transition-all">
            <History className="w-4 h-4" />
            Consultations
          </button>
          <button 
            onClick={() => router.push("/profile/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium text-sm transition-all"
          >
            <Settings className="w-4 h-4" />
            Medical Profile
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl font-medium text-sm transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Patient Dashboard</h1>
          <p className="text-slate-500 text-sm italic">Review your clinical records and health summary.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Summary Card */}
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Health Vitals</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Blood Type</p>
                    <p className="text-lg font-bold text-slate-900">{profile?.blood_type || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Known Allergies</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {profile?.allergies?.length > 0 ? (
                        profile.allergies.map((a: string) => (
                          <span key={a} className="bg-amber-100/50 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-100">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push("/profile/settings")}
                className="w-full mt-8 py-3 px-4 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all border border-slate-100"
              >
                Update Vitals
              </button>
            </div>
          </section>

          {/* Consultation History */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Consultations</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                {consultations.length} RECORDS
              </span>
            </div>

            {consultations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <History className="w-8 h-8" />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">No Consultations Yet</h4>
                <p className="text-slate-400 text-xs mb-6">Your medical reports will appear here after your first call.</p>
                <button 
                  onClick={() => router.push("/consultation")}
                  className="bg-sky-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-100 active:scale-95 transition-all"
                >
                  Start Consultation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((c) => {
                  const doctor = DOCTORS.find(d => d.id === c.doctor_id);
                  return (
                    <div 
                      key={c.id} 
                      className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${doctor?.gradient || 'from-slate-400 to-slate-600'} flex items-center justify-center text-white text-xl shadow-inner`}>
                          {doctor?.icon || <Stethoscope className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-slate-900">{doctor?.name || "AI Specialist"}</h4>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(c.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{c.conclusion}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
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
