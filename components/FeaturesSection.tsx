const features = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Instant Guidance",
    description:
      "Receive AI-analyzed health guidance in under 10 seconds. No waiting rooms. No appointments. Just answers when you need them most.",
    color: "sky",
    stat: "< 10s",
    statLabel: "Avg. response time",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Private & Secure",
    description:
      "Your health data is end-to-end encrypted. We never sell your information. HIPAA-aligned protocols protect every consultation.",
    color: "teal",
    stat: "E2E",
    statLabel: "Encrypted",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <path d="M3.6 9h16.8M3.6 15h16.8" />
        <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z" />
      </svg>
    ),
    title: "Available Anytime",
    description:
      "Whether it's 3 AM or a holiday, AI Doctor Pro is always on. Get health insight 24/7 from anywhere in the world.",
    color: "emerald",
    stat: "24/7",
    statLabel: "Always available",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
    title: "Evidence-Based",
    description:
      "Powered by medical literature, clinical guidelines, and continuously updated knowledge bases reviewed by healthcare professionals.",
    color: "violet",
    stat: "10K+",
    statLabel: "Medical sources",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Multiple Specialties",
    description:
      "Access AI doctors across general health, mental health, nutrition, urgent care, and more — all in one platform.",
    color: "rose",
    stat: "8+",
    statLabel: "Specialties",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Symptom Tracking",
    description:
      "Log your symptoms over time and let our AI detect patterns, flag changes, and help you monitor your health journey.",
    color: "amber",
    stat: "∞",
    statLabel: "History logged",
  },
];

const colorMap: Record<string, { icon: string; stat: string; border: string; hover: string }> = {
  sky: { icon: "text-sky-500 bg-sky-100", stat: "text-sky-600", border: "border-sky-100", hover: "hover:border-sky-300 hover:shadow-sky-100" },
  teal: { icon: "text-teal-500 bg-teal-100", stat: "text-teal-600", border: "border-teal-100", hover: "hover:border-teal-300 hover:shadow-teal-100" },
  emerald: { icon: "text-emerald-500 bg-emerald-100", stat: "text-emerald-600", border: "border-emerald-100", hover: "hover:border-emerald-300 hover:shadow-emerald-100" },
  violet: { icon: "text-violet-500 bg-violet-100", stat: "text-violet-600", border: "border-violet-100", hover: "hover:border-violet-300 hover:shadow-violet-100" },
  rose: { icon: "text-rose-500 bg-rose-100", stat: "text-rose-600", border: "border-rose-100", hover: "hover:border-rose-300 hover:shadow-rose-100" },
  amber: { icon: "text-amber-500 bg-amber-100", stat: "text-amber-600", border: "border-amber-100", hover: "hover:border-amber-300 hover:shadow-amber-100" },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Built for your peace of mind
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Everything you need to take confident control of your health — backed by AI, secured with care.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const c = colorMap[feature.color];
            return (
              <div
                key={idx}
                className={`group flex flex-col p-7 rounded-3xl bg-white border-2 ${c.border} ${c.hover} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${c.stat}`}>{feature.stat}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{feature.statLabel}</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
