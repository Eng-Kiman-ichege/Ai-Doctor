"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Droplet, 
  FileText, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    blood_type: "",
    allergies: [] as string[],
    medical_history: "",
    date_of_birth: "",
    gender: "",
  });
  const [allergyInput, setAllergyInput] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          blood_type: data.blood_type || "",
          allergies: data.allergies || [],
          medical_history: data.medical_history || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [isLoaded, user?.id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id, // Explicitly include user ID
        ...profile,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);
    if (!error) {
      setSuccess(true);
      // Redirect after a short delay so they can see the success message
      setTimeout(() => {
        router.push("/consultation");
      }, 1500);
    } else {
      console.error("Error saving profile:", error);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !profile.allergies.includes(allergyInput.trim())) {
      setProfile(p => ({ ...p, allergies: [...p.allergies, allergyInput.trim()] }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (a: string) => {
    setProfile(p => ({ ...p, allergies: p.allergies.filter(item => item !== a) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-sm font-bold text-slate-900">Medical Profile Settings</h1>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-sky-100 hover:bg-sky-600 disabled:bg-slate-200 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-semibold">Medical profile updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-sky-500" />
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={profile.full_name}
                  onChange={e => setProfile({...profile, full_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-sky-300 focus:bg-white transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  value={profile.date_of_birth}
                  onChange={e => setProfile({...profile, date_of_birth: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-sky-300 focus:bg-white transition-all"
                />
              </div>
            </div>
          </section>

          {/* Vitals Info */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Droplet className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-slate-900">Quick Stats</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Type</label>
                <select 
                  value={profile.blood_type}
                  onChange={e => setProfile({...profile, blood_type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-sky-300 focus:bg-white transition-all"
                >
                  <option value="">Select...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                <select 
                  value={profile.gender}
                  onChange={e => setProfile({...profile, gender: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-sky-300 focus:bg-white transition-all"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Medical History */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold text-slate-900">Clinical History</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Conditions & Notes</label>
              <textarea 
                rows={5}
                value={profile.medical_history}
                onChange={e => setProfile({...profile, medical_history: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-sky-300 focus:bg-white transition-all resize-none"
                placeholder="List any chronic conditions, past surgeries, or significant health notes..."
              />
            </div>
          </section>

          {/* Allergies */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Allergies</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAllergy()}
                  placeholder="e.g. Penicillin"
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-sky-300 transition-all font-medium"
                />
                <button onClick={addAllergy} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.allergies.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No allergies listed</p>
                ) : (
                  profile.allergies.map(a => (
                    <span key={a} className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                      {a}
                      <button onClick={() => removeAllergy(a)} className="hover:text-amber-900">×</button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
