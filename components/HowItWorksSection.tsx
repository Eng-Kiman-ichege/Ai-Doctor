import Link from "next/link";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Tell us how you feel",
      description:
        "Describe your symptoms in plain language — no medical jargon needed. Our AI listens carefully to every detail you share.",
      color: "sky",
    },
    {
      number: "02",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
          <path d="M18 14l2 2 4-4" />
        </svg>
      ),
      title: "Get matched with an AI doctor",
      description:
        "Our system instantly analyzes your symptoms and connects you with a specialized AI model trained for your health concern.",
      color: "teal",
    },
    {
      number: "03",
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Start your consultation",
      description:
        "Receive clear, personalized guidance and next steps — all within seconds of describing how you feel.",
      color: "emerald",
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; icon: string; number: string; connector: string }> = {
    sky: {
      bg: "bg-sky-50",
      border: "border-sky-100",
      icon: "text-sky-500 bg-sky-100",
      number: "text-sky-300",
      connector: "bg-sky-200",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      icon: "text-teal-500 bg-teal-100",
      number: "text-teal-300",
      connector: "bg-teal-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: "text-emerald-500 bg-emerald-100",
      number: "text-emerald-300",
      connector: "bg-emerald-200",
    },
  };

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-500 mb-3">
            Simple &amp; Fast
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How it works
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From describing symptoms to receiving guidance — our process takes under 60 seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-gradient-to-r from-sky-200 via-teal-200 to-emerald-200" />

          {steps.map((step, idx) => {
            const c = colorMap[step.color];
            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center text-center p-8 rounded-3xl ${c.bg} border ${c.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                {/* Step number */}
                <span className={`absolute top-5 right-6 text-6xl font-black ${c.number} select-none leading-none`}>
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${c.icon} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            id="how-it-works-cta"
            href="/consultation"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-sky-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Consultation Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
