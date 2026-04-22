import Link from "next/link";

export default function MidPageCTA() {
  return (
    <section
      id="consultation"
      className="relative py-24 overflow-hidden bg-gradient-to-r from-sky-500 via-sky-500 to-teal-500"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-300/20 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Floating shapes */}
        <div className="absolute top-8 left-12 w-4 h-4 rounded-full bg-white/20 animate-float" />
        <div className="absolute bottom-12 right-16 w-6 h-6 rounded-full bg-white/15 animate-float" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-16 right-1/4 w-3 h-3 rounded-full bg-white/25 animate-float" style={{ animationDelay: "1.4s" }} />
        <div className="absolute bottom-8 left-1/3 w-5 h-5 rounded-full bg-white/15 animate-float" style={{ animationDelay: "0.4s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 border border-white/30 shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Ready to talk to an AI doctor?
        </h2>
        <p className="text-lg sm:text-xl text-sky-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Thousands of people get clarity on their health every day. Your consultation
          starts here — no sign-up required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            id="mid-page-cta"
            href="/consultation"
            className="inline-flex items-center gap-2.5 bg-white text-sky-600 hover:bg-sky-50 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-sky-400/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-base"
          >
            Start Free Consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm border-b border-white/40 hover:border-white pb-0.5 transition-all duration-200"
          >
            Learn how it works →
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sky-100 text-sm">
          {[
            { icon: "🔒", text: "End-to-end encrypted" },
            { icon: "⚡", text: "Instant response" },
            { icon: "🆓", text: "Free to start" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
